// ===== نظام إدارة الصور المحلية (نسخة محسنة ومطورة) =====

class ImageUploadManager {
    constructor() {
        this.uploadedImages = [];
        this.loadImagesFromStorage();
    }

    uploadImage(file) {
        return new Promise((resolve, reject) => {
            if (!file) { reject('لا يوجد ملف محدد'); return; }
            if (!file.type.startsWith('image/')) { reject('يجب اختيار ملف صورة'); return; }
            // السماح بصور حتى 20 ميغابايت لأنه سيتم ضغطها
            if (file.size > 20 * 1024 * 1024) { reject('حجم الملف كبير جداً'); return; }

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    id: Date.now().toString(),
                    name: file.name,
                    size: file.size,
                    type: file.type, 
                    data: e.target.result, 
                    timestamp: new Date().toISOString()
                };
                resolve(imageData);
            };
            reader.onerror = () => { reject('خطأ في قراءة الملف'); };
            reader.readAsDataURL(file);
        });
    }

    // تحويل الصورة إلى صيغة أصغر (JPEG) لضمان عدم تجاوز سعة المتصفح
    async compressImage(imageData, fileType, maxWidth = 800, maxHeight = 800) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                // إضافة خلفية بيضاء لتجنب الشفافية في بعض الصور عند التحويل لـ JPEG
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);

                // استخدام JPEG مع جودة 0.7 لتقليل الحجم بشكل كبير جداً
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = imageData;
        });
    }

    async uploadImageWithCompression(file) {
        try {
            const imageData = await this.uploadImage(file);
            const compressed = await this.compressImage(imageData.data, imageData.type);
            
            // تحديث البيانات بالنسخة المضغوطة
            imageData.data = compressed;
            // تقدير الحجم الجديد
            imageData.size = Math.round((compressed.length * 3) / 4);
            
            this.uploadedImages.push(imageData);
            this.saveImagesToStorage();
            
            return imageData;
        } catch (error) {
            throw error;
        }
    }

    getAllImages() { return this.uploadedImages; }
    getImageById(id) { return this.uploadedImages.find(img => img.id === id); }
    
    deleteImage(id) {
        this.uploadedImages = this.uploadedImages.filter(img => img.id !== id);
        this.saveImagesToStorage();
        return true;
    }

    saveImagesToStorage() {
        try {
            localStorage.setItem('drlaptop-uploaded-images', JSON.stringify(this.uploadedImages));
        } catch(e) {
            console.warn("مساحة التخزين ممتلئة للصور المرفوعة");
        }
    }

    loadImagesFromStorage() {
        const saved = localStorage.getItem('drlaptop-uploaded-images');
        this.uploadedImages = saved ? JSON.parse(saved) : [];
    }
}

const imageUploadManager = new ImageUploadManager();

// الدالة التي يتم استدعاؤها من زر رفع اللابتوبات
window.handleImageUpload = function(inputElement) {
    if (!inputElement.files || inputElement.files.length === 0) return;

    const uploadPromises = [];
    for (let file of inputElement.files) {
        uploadPromises.push(imageUploadManager.uploadImageWithCompression(file));
    }

    // إظهار رسالة جاري الرفع
    showImageUploadNotification('جاري رفع وضغط الصور...', false, 2000);

    Promise.all(uploadPromises)
        .then(results => {
            showImageUploadNotification(`تم رفع وضغط ${results.length} صورة بنجاح`);
            
            const mainInput = document.getElementById('product-image');
            const additionalInput = document.getElementById('product-additional-images');
            
            if (results.length > 0) {
                // إذا كان الحقل فارغاً، ضع الصورة الأولى كرئيسية
                if (mainInput && (!mainInput.value || mainInput.value.includes('images.unsplash.com'))) {
                    mainInput.value = results[0].data;
                }
                
                // وضع باقي الصور في حقل الصور الإضافية
                if (additionalInput) {
                    const urls = results.map(r => r.data);
                    if (additionalInput.value.trim() === '') {
                        additionalInput.value = urls.join(', ');
                    } else {
                        additionalInput.value += ', ' + urls.join(', ');
                    }
                }
            }
            
            if (typeof updateImageGallery === 'function') {
                updateImageGallery();
            }
        })
        .catch(error => {
            showImageUploadNotification('خطأ: ' + error, true);
        });
};

// معالجة رفع صور الاكسسوارات (تم التعديل لضمان استخدام الضغط)
window.handleAccessoryImageUpload = function(input) {
    if (!input.files || input.files.length === 0) return;
    
    showImageUploadNotification('جاري رفع وضغط الصورة...', false, 2000);
    
    imageUploadManager.uploadImageWithCompression(input.files[0])
        .then(result => {
            const accImage = document.getElementById('accessory-image');
            if (accImage) {
                accImage.value = result.data;
            }
            showImageUploadNotification('تم تعيين صورة الاكسسوار بنجاح');
        })
        .catch(err => {
            showImageUploadNotification('خطأ: ' + err, true);
        });
};

function showImageUploadNotification(message, isError = false, duration = 3000) {
    // إزالة أي إشعار سابق
    const existing = document.querySelector('.image-upload-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'image-upload-notification';
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px; padding: 15px 25px;
        background: ${isError ? '#ef4444' : '#10b981'};
        color: white; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999; animation: slideInNotification 0.3s ease; font-weight: bold;
    `;
    notification.innerHTML = `<i class="fas fa-${isError ? 'exclamation-circle' : 'check-circle'}"></i> ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) notification.remove();
    }, duration);
}

window.updateImageGallery = function() {
    const gallery = document.getElementById('images-gallery');
    if (!gallery) return;

    const images = imageUploadManager.getAllImages();
    if (images.length === 0) {
        gallery.innerHTML = '<p style="text-align: center; color: #999; width: 100%;">لا توجد صور مرفوعة حتى الآن</p>';
        return;
    }

    gallery.innerHTML = images.map(image => `
        <div class="image-gallery-item" style="
            display: inline-block; margin: 5px; padding: 10px;
            border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;
            background: #f8fafc; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <img src="${image.data}" alt="${image.name}" style="
                width: 100px; height: 100px; object-fit: cover;
                border-radius: 6px; margin-bottom: 10px; border: 1px solid #cbd5e1;">
            <p style="margin: 5px 0; font-size: 0.8rem; color: #334155; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100px;">${image.name}</p>
            <div style="display: flex; flex-direction: column; gap: 5px; margin-top: 10px;">
                <button type="button" onclick="setAsMainImage('${image.id}')" style="background: #3b82f6; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;"><i class="fas fa-star"></i> رئيسية</button>
                <button type="button" onclick="deleteUploadedImage('${image.id}')" style="background: #ef4444; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;"><i class="fas fa-trash"></i> حذف</button>
            </div>
        </div>
    `).join('');
};

window.setAsMainImage = function(id) {
    const image = imageUploadManager.getImageById(id);
    if (image) {
        const mainInput = document.getElementById('product-image');
        if(mainInput) {
            mainInput.value = image.data;
            showImageUploadNotification('تم تعيين الصورة كصورة رئيسية');
        }
    }
};

window.deleteUploadedImage = function(imageId) {
    if (confirm('هل تريد حذف هذه الصورة؟')) {
        imageUploadManager.deleteImage(imageId);
        updateImageGallery();
    }
};

if (document.head) {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInNotification {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}
