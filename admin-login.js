// ملف بيانات تسجيل الدخول - يمكنك تعديله كما تريد
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123",
    fullName: "مدير النظام",
    email: "admin@drlaptop.com"
};

// نظام تسجيل الدخول البسيط
class SimpleLoginSystem {
    constructor() {
        this.credentials = ADMIN_CREDENTIALS;
        this.checkLoginStatus();
    }

    // التحقق من حالة تسجيل الدخول
    checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('drlaptop_logged_in') === 'true';
        const userData = sessionStorage.getItem('drlaptop_user_data');
        
        if (isLoggedIn && userData) {
            return JSON.parse(userData);
        }
        return null;
    }

    // تسجيل الدخول
    login(username, password) {
        // التحقق من بيانات الدخول
        if (username === this.credentials.username && 
            password === this.credentials.password) {
            
            // حفظ بيانات الجلسة
            const userData = {
                username: this.credentials.username,
                fullName: this.credentials.fullName,
                email: this.credentials.email,
                loginTime: new Date().toISOString(),
                sessionId: Date.now().toString(36) + Math.random().toString(36).substr(2)
            };
            
            sessionStorage.setItem('drlaptop_logged_in', 'true');
            sessionStorage.setItem('drlaptop_user_data', JSON.stringify(userData));
            
            return {
                success: true,
                message: "تم تسجيل الدخول بنجاح",
                user: userData
            };
        }
        
        return {
            success: false,
            message: "اسم المستخدم أو كلمة المرور غير صحيحة"
        };
    }

    // تسجيل الخروج
    logout() {
        sessionStorage.removeItem('drlaptop_logged_in');
        sessionStorage.removeItem('drlaptop_user_data');
        return {
            success: true,
            message: "تم تسجيل الخروج بنجاح"
        };
    }

    // الحصول على بيانات المستخدم الحالي
    getCurrentUser() {
        return this.checkLoginStatus();
    }

    // التحقق من صلاحية الدخول للصفحة
    requireLogin() {
        const user = this.checkLoginStatus();
        if (!user) {
            window.location.href = 'admin-login.html';
            return false;
        }
        return user;
    }
}

// إنشاء نسخة عالمية من النظام
if (typeof window !== 'undefined') {
    window.simpleLogin = new SimpleLoginSystem();
}