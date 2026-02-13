// ===== نظام إدارة الصور المحلية =====

class ImageUploadManager {
    constructor() {
        this.uploadedImages = [];
        this.loadImagesFromStorage();
    }

    // تحميل صورة واحدة
    uploadImage(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject('لا يوجد ملف محدد');
                return;
            }

            // التحقق من نوع الملف
            if (!file.type.startsWith('image/')) {
                reject('يجب اختيار ملف صورة');
                return;
            }

            // التحقق من حجم الملف (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                reject('حجم الملف أكبر من 5MB');
                return;
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                const imageData = {
                    id: Date.now().toString(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: e.target.result, // Base64
                    timestamp: new Date().toISOString()
                };

                this.uploadedImages.push(imageData);
                this.saveImagesToStorage();
                resolve(imageData);
            };

            reader.onerror = () => {
                reject('خطأ في قراءة الملف');
            };

            reader.readAsDataURL(file);
        });
    }

    // تحميل عدة صور
    uploadMultipleImages(files) {
        const uploadPromises = Array.from(files).map(file => this.uploadImage(file));
        return Promise.all(uploadPromises);
    }

    // الحصول على جميع الصور
    getAllImages() {
        return this.uploadedImages;
    }

    // الحصول على صورة واحدة
    getImageById(id) {
        return this.uploadedImages.find(img => img.id === id);
    }

    // حذف صورة
    deleteImage(id) {
        this.uploadedImages = this.uploadedImages.filter(img => img.id !== id);
        this.saveImagesToStorage();
        return true;
    }

    // حفظ الصور في localStorage
    saveImagesToStorage() {
        // تخزين فقط البيانات الأساسية (البيانات الكبيرة تُحفظ في storage محدود)
        localStorage.setItem('drlaptop-uploaded-images', JSON.stringify(this.uploadedImages));
    }

    // تحميل الصور من localStorage
    loadImagesFromStorage() {
        const saved = localStorage.getItem('drlaptop-uploaded-images');
        this.uploadedImages = saved ? JSON.parse(saved) : [];
    }

    // الحصول على معلومات الصورة (بدون البيانات الثقيلة)
    getImageInfo(id) {
        const image = this.getImageById(id);
        if (!image) return null;
        return {
            id: image.id,
            name: image.name,
            size: image.size,
            type: image.type,
            timestamp: image.timestamp
        };
    }

    // الحصول على data URL للصورة
    getImageDataUrl(id) {
        const image = this.getImageById(id);
        return image ? image.data : null;
    }

    // تحويل الصورة إلى صيغة أصغر
    async compressImage(imageData, maxWidth = 800, maxHeight = 800) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // حساب الأبعاد الجديدة
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL(img.type, 0.8));
            };
            img.src = imageData;
        });
    }

    // معالجة رفع ملف مع ضغط
    async uploadImageWithCompression(file) {
        try {
            const imageData = await this.uploadImage(file);
            const compressed = await this.compressImage(imageData.data);
            
            // تحديث البيانات المضغوطة
            const index = this.uploadedImages.findIndex(img => img.id === imageData.id);
            if (index !== -1) {
                this.uploadedImages[index].data = compressed;
                this.saveImagesToStorage();
            }
            
            return this.uploadedImages[index];
        } catch (error) {
            throw error;
        }
    }

    // الحصول على إحصائيات الصور
    getStatistics() {
        const totalSize = this.uploadedImages.reduce((sum, img) => sum + img.size, 0);
        return {
            count: this.uploadedImages.length,
            totalSize: (totalSize / 1024 / 1024).toFixed(2) + ' MB',
            images: this.uploadedImages.map(img => ({
                name: img.name,
                size: (img.size / 1024).toFixed(2) + ' KB',
                date: new Date(img.timestamp).toLocaleDateString('ar-SA')
            }))
        };
    }

    // تصدير الصور
    exportImages() {
        const dataStr = JSON.stringify(this.uploadedImages, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = 'drlaptop-images-' + new Date().toISOString().split('T')[0] + '.json';
        link.click();
    }

    // استيراد الصور
    async importImages(jsonFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importedImages = JSON.parse(e.target.result);
                    if (Array.isArray(importedImages)) {
                        this.uploadedImages = [...this.uploadedImages, ...importedImages];
                        this.saveImagesToStorage();
                        resolve(importedImages);
                    } else {
                        reject('تنسيق ملف غير صحيح');
                    }
                } catch (error) {
                    reject('خطأ في قراءة ملف JSON');
                }
            };

            reader.onerror = () => {
                reject('خطأ في قراءة الملف');
            };

            reader.readAsText(jsonFile);
        });
    }

    // مسح جميع الصور
    clearAllImages() {
        this.uploadedImages = [];
        this.saveImagesToStorage();
    }
}

// إنشاء نسخة عامة من الـ manager
const imageUploadManager = new ImageUploadManager();

// عرض معاينة الصورة
function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// معالج نموذج رفع الصور
function handleImageUpload(inputElement) {
    if (!inputElement.files) return;

    const uploadPromises = [];
    
    for (let file of inputElement.files) {
        uploadPromises.push(
            imageUploadManager.uploadImageWithCompression(file)
        );
    }

    Promise.all(uploadPromises)
        .then(results => {
            console.log('تم رفع الصور بنجاح:', results);
            showImageUploadNotification(`تم رفع ${results.length} صورة بنجاح`);
            // تحديث واجهة إدارة الصور
            updateImageGallery();
        })
        .catch(error => {
            console.error('خطأ في رفع الصور:', error);
            showImageUploadNotification('خطأ: ' + error, true);
        });
}

// عرض إشعار
function showImageUploadNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = 'image-upload-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        background: ${isError ? '#ef4444' : '#10b981'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideInNotification 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// تحديث معرض الصور
function updateImageGallery() {
    const gallery = document.getElementById('images-gallery');
    if (!gallery) return;

    const images = imageUploadManager.getAllImages();
    
    if (images.length === 0) {
        gallery.innerHTML = '<p style="text-align: center; color: #999;">لا توجد صور مرفوعة حتى الآن</p>';
        return;
    }

    gallery.innerHTML = images.map(image => `
        <div class="image-gallery-item" style="
            display: inline-block;
            margin: 10px;
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 8px;
            text-align: center;
            background: #f8f9fa;">
            <img src="${image.data}" alt="${image.name}" style="
                width: 120px;
                height: 120px;
                object-fit: cover;
                border-radius: 6px;
                margin-bottom: 10px;">
            <p style="margin: 5px 0; font-size: 0.9rem; color: #333;">${image.name}</p>
            <p style="margin: 5px 0; font-size: 0.8rem; color: #666;">
                ${(image.size / 1024).toFixed(2)} KB
            </p>
            <button onclick="deleteUploadedImage('${image.id}')" style="
                background: #ef4444;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9rem;">
                حذف
            </button>
        </div>
    `).join('');
}

// حذف صورة مرفوعة
function deleteUploadedImage(imageId) {
    if (confirm('هل تريد حذف هذه الصورة؟')) {
        imageUploadManager.deleteImage(imageId);
        updateImageGallery();
    }
}

// إضافة style للإشعارات
if (document.head) {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInNotification {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}
