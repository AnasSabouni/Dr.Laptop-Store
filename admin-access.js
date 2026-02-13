// نظام حماية متقدم مع حل مشكلة IP المتغير وبصمة الجهاز
class AdminAccess {
    constructor() {
        this.myIP = null;
        this.password = "Anas0217951@#$";
        this.allowedNetworks = [];
        this.authorizedDevices = this.getAuthorizedDevices();
        this.currentDeviceId = null;
        this.otpSecret = "DRLAPTOP2024SECRET";
        this.init();
    }

    async init() {
        await this.fetchVisitorIP();
        await this.generateDeviceFingerprint();
        this.checkAccessSilently();
        this.loadAllowedNetworks();
    }

    async fetchVisitorIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            this.myIP = data.ip;
            console.log('IP الحالي:', this.myIP);
            return data.ip;
        } catch (error) {
            console.log('تعذر الحصول على IP');
            this.myIP = 'unknown';
            return 'unknown';
        }
    }

    async generateDeviceFingerprint() {
        try {
            const fingerprint = {
                ua: navigator.userAgent,
                pl: navigator.platform,
                lg: navigator.language,
                sr: `${screen.width}x${screen.height}`,
                cd: screen.colorDepth,
                tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
                hc: navigator.hardwareConcurrency || 'u',
                dm: navigator.deviceMemory || 'u',
                mt: navigator.maxTouchPoints || 'u',
                dt: new Date().getTimezoneOffset(),
                dt2: new Date().toLocaleDateString(),
                hash: this.simpleHash(navigator.userAgent + navigator.platform + screen.width + screen.height)
            };

            const fingerprintStr = JSON.stringify(fingerprint);
            this.currentDeviceId = await this.hashString(fingerprintStr);
            
            localStorage.setItem('drlaptop_device_id', this.currentDeviceId);
            
            console.log('بصمة الجهاز:', this.currentDeviceId.substring(0, 10) + '...');
            return this.currentDeviceId;
        } catch (error) {
            console.error('خطأ في توليد بصمة الجهاز:', error);
            this.currentDeviceId = 'device-error-' + Date.now();
            return this.currentDeviceId;
        }
    }

    async hashString(str) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(str);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            return this.simpleHash(str);
        }
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    getAuthorizedDevices() {
        const devices = localStorage.getItem('drlaptop_authorized_devices');
        return devices ? JSON.parse(devices) : [];
    }

    saveAuthorizedDevices() {
        localStorage.setItem('drlaptop_authorized_devices', JSON.stringify(this.authorizedDevices));
    }

    addAuthorizedDevice(deviceId, deviceName = 'جهاز جديد') {
        const existing = this.authorizedDevices.find(d => d.id === deviceId);
        
        if (!existing) {
            this.authorizedDevices.push({
                id: deviceId,
                name: deviceName,
                addedAt: new Date().toISOString(),
                lastAccess: new Date().toISOString(),
                active: true,
                ip: this.myIP || 'unknown'
            });
            
            this.saveAuthorizedDevices();
            return true;
        }
        
        return false;
    }

    updateDeviceLastAccess(deviceId) {
        const device = this.authorizedDevices.find(d => d.id === deviceId);
        if (device) {
            device.lastAccess = new Date().toISOString();
            device.ip = this.myIP || device.ip;
            this.saveAuthorizedDevices();
        }
    }

    isDeviceAuthorized() {
        if (!this.currentDeviceId) return false;
        
        const device = this.authorizedDevices.find(d => 
            d.id === this.currentDeviceId && d.active === true
        );
        
        return !!device;
    }

    generateOTP() {
        const time = Math.floor(Date.now() / 1000 / 300);
        const message = `${this.otpSecret}${time}`;
        return this.simpleHash(message).substring(0, 6);
    }

    verifyOTP(otp) {
        if (!otp) return false;
        
        const currentOTP = this.generateOTP();
        const previousOTP = this.generateOTP(Math.floor(Date.now() / 1000 / 300) - 1);
        
        return otp === currentOTP || otp === previousOTP;
    }

    getAllowedIPs() {
        const ips = localStorage.getItem('drlaptop_allowed_ips');
        return ips ? JSON.parse(ips) : [];
    }

    loadAllowedNetworks() {
        const networks = localStorage.getItem('drlaptop_allowed_networks');
        this.allowedNetworks = networks ? JSON.parse(networks) : [];
    }

    saveAllowedNetworks() {
        localStorage.setItem('drlaptop_allowed_networks', JSON.stringify(this.allowedNetworks));
    }

    addNetwork(networkPattern, note = '') {
        this.allowedNetworks.push({
            pattern: networkPattern,
            note: note,
            addedAt: new Date().toISOString()
        });
        this.saveAllowedNetworks();
    }

    checkNetworkAccess(ip) {
        for (const network of this.allowedNetworks) {
            const pattern = network.pattern.replace(/\*/g, '.*');
            const regex = new RegExp(`^${pattern}$`);
            if (regex.test(ip)) {
                return true;
            }
        }
        return false;
    }

    getIPPrefix(ip) {
        const parts = ip.split('.');
        if (parts.length === 4) {
            return `${parts[0]}.${parts[1]}.${parts[2]}`;
        }
        return null;
    }

    addIPAutomatically(ip, networkPrefix) {
        const allowedIPs = this.getAllowedIPs();
       
        if (!allowedIPs.some(item => item.ip === ip)) {
            allowedIPs.push({
                ip: ip,
                note: `تمت الإضافة تلقائياً - نطاق ${networkPrefix}.*`,
                addedAt: new Date().toISOString(),
                autoAdded: true,
                active: true
            });
           
            localStorage.setItem('drlaptop_allowed_ips', JSON.stringify(allowedIPs));
            console.log('تمت إضافة الـ IP تلقائياً:', ip);
        }
    }

    checkAccess(requiresDevice = true) {
        const allowedIPs = this.getAllowedIPs();
        const currentIP = this.myIP;
       
        console.log('التحقق من IP:', currentIP);
       
        if (requiresDevice && this.isDeviceAuthorized()) {
            console.log('الجهاز مسموح - تخطي فحص IP');
            this.updateDeviceLastAccess(this.currentDeviceId);
            
            const isPasswordValid = sessionStorage.getItem('admin_authenticated') === 'true';
            return isPasswordValid;
        }
       
        if (currentIP.startsWith('192.168.') ||
            currentIP.startsWith('10.') ||
            currentIP === '127.0.0.1' ||
            currentIP === 'localhost') {
            console.log('IP محلي - السماح بالدخول مع كلمة المرور فقط');
        } else {
            if (allowedIPs.length > 0) {
                const isIPAllowed = allowedIPs.some(ip =>
                    ip.ip === currentIP && ip.active === true
                );
               
                if (!isIPAllowed) {
                    console.log('IP غير مسموح:', currentIP);
                   
                    const ipPrefix = this.getIPPrefix(currentIP);
                    if (ipPrefix && this.checkNetworkAccess(`${ipPrefix}.*`)) {
                        console.log('النطاق مسموح:', ipPrefix);
                        this.addIPAutomatically(currentIP, ipPrefix);
                    } else {
                        return false;
                    }
                }
            }
        }
       
        const isPasswordValid = sessionStorage.getItem('admin_authenticated') === 'true';
        console.log('حالة كلمة المرور:', isPasswordValid);
       
        return isPasswordValid;
    }

    authenticate(inputPassword, otp = null) {
        if (inputPassword !== this.password) {
            return { success: false, error: 'كلمة المرور غير صحيحة' };
        }

        if (otp !== null && !this.verifyOTP(otp)) {
            return { success: false, error: 'رمز OTP غير صحيح' };
        }

        const isDeviceAuthorized = this.isDeviceAuthorized();

        if (!isDeviceAuthorized && otp === null) {
            return { 
                success: false, 
                error: 'الجهاز غير معتمد',
                requiresOTP: true,
                deviceId: this.currentDeviceId
            };
        }

        if (!isDeviceAuthorized && otp !== null && this.verifyOTP(otp)) {
            this.addAuthorizedDevice(this.currentDeviceId, 'تمت الإضافة عبر OTP');
        }

        sessionStorage.setItem('admin_authenticated', 'true');
        
        if (this.currentDeviceId) {
            this.updateDeviceLastAccess(this.currentDeviceId);
        }
        
        return { success: true };
    }

    checkAccessSilently() {
        const hasAccess = this.checkAccess();
       
        if (document.body) {
            const indicator = document.createElement('div');
            indicator.id = 'access-indicator';
            indicator.style.cssText = `
                position: fixed;
                bottom: 70px;
                left: 20px;
                background: ${hasAccess ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                z-index: 9997;
                display: flex;
                align-items: center;
                gap: 8px;
                backdrop-filter: blur(10px);
                border: 1px solid ${hasAccess ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
            `;
            indicator.innerHTML = `
                <i class="fas fa-${hasAccess ? 'shield-check' : 'shield-exclamation'}"></i>
                ${hasAccess ? 'الوصول مسموح' : 'الوصول مقيد'}
                ${this.currentDeviceId ? `<br><small>${this.currentDeviceId.substring(0, 8)}...</small>` : ''}
            `;
            document.body.appendChild(indicator);
        }
       
        return hasAccess;
    }

    blockAccess() {
        document.body.innerHTML = '';
       
        const blockPage = `
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>الوصول مرفوض | Dr.Laptop</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Tajawal', sans-serif;
                        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: white;
                        padding: 20px;
                    }
                    .block-container {
                        text-align: center;
                        padding: 50px 40px;
                        background: rgba(255,255,255,0.05);
                        backdrop-filter: blur(20px);
                        border-radius: 25px;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                        max-width: 600px;
                        width: 100%;
                        border: 1px solid rgba(255,255,255,0.1);
                    }
                    .warning-icon {
                        font-size: 5rem;
                        color: #ef4444;
                        margin-bottom: 30px;
                        animation: pulse 2s infinite;
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                    h1 {
                        font-size: 2.5rem;
                        margin-bottom: 20px;
                        color: #fecaca;
                    }
                    .device-info {
                        background: rgba(59, 130, 246, 0.1);
                        padding: 20px;
                        border-radius: 15px;
                        margin: 25px 0;
                        text-align: right;
                        border: 1px solid rgba(59, 130, 246, 0.2);
                    }
                    .device-id {
                        font-family: monospace;
                        font-size: 0.9rem;
                        color: #60a5fa;
                        word-break: break-all;
                        direction: ltr;
                        margin-top: 10px;
                    }
                    .otp-section {
                        background: rgba(245, 158, 11, 0.1);
                        border-radius: 15px;
                        padding: 20px;
                        margin: 25px 0;
                        text-align: center;
                    }
                    .otp-display {
                        font-family: monospace;
                        font-size: 2rem;
                        letter-spacing: 10px;
                        color: #10b981;
                        margin: 15px 0;
                    }
                    .actions {
                        margin-top: 40px;
                        display: flex;
                        gap: 15px;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    .btn {
                        padding: 15px 30px;
                        border-radius: 12px;
                        border: none;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        min-width: 180px;
                        justify-content: center;
                    }
                    .btn-primary {
                        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                        color: white;
                    }
                    .btn-secondary {
                        background: rgba(255,255,255,0.1);
                        color: white;
                        border: 1px solid rgba(255,255,255,0.2);
                    }
                    .btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                    }
                </style>
            </head>
            <body>
                <div class="block-container">
                    <div class="warning-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                   
                    <h1>🚫 الوصول مرفوض</h1>
                    <p style="color: #cbd5e1; font-size: 1.1rem; margin-bottom: 10px;">
                        نظام الحماية يعتمد على بصمة الجهاز
                    </p>
                   
                    <div class="device-info">
                        <div style="color: #94a3b8; margin-bottom: 10px;">بصمة جهازك:</div>
                        <div class="device-id">${this.currentDeviceId || 'غير متاح'}</div>
                    </div>
                   
                    <div class="otp-section">
                        <h3><i class="fas fa-key"></i> رمز OTP للدخول مرة واحدة</h3>
                        <div class="otp-display" id="block-otp">${this.generateOTP()}</div>
                        <p style="color: #94a3b8;">صالح لمدة 5 دقائق فقط</p>
                    </div>
                   
                    <div class="actions">
                        <button class="btn btn-primary" onclick="window.location.href='admin-gateway.html'">
                            <i class="fas fa-key"></i> الدخول باستخدام OTP
                        </button>
                        <button class="btn btn-secondary" onclick="window.location.href='index.html'">
                            <i class="fas fa-home"></i> العودة للمتجر
                        </button>
                    </div>
                </div>
               
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </body>
            </html>
        `;
       
        document.write(blockPage);
        document.close();
    }

    getDevices() {
        return this.authorizedDevices;
    }

    toggleDevice(deviceId) {
        const device = this.authorizedDevices.find(d => d.id === deviceId);
        if (device) {
            device.active = !device.active;
            this.saveAuthorizedDevices();
            return device.active;
        }
        return false;
    }

    removeDevice(deviceId) {
        this.authorizedDevices = this.authorizedDevices.filter(d => d.id !== deviceId);
        this.saveAuthorizedDevices();
    }

    simpleAuthenticate(inputPassword) {
        if (inputPassword === this.password) {
            sessionStorage.setItem('admin_authenticated', 'true');
            return true;
        }
        return false;
    }
}

if (typeof window !== 'undefined') {
    window.adminAccess = new AdminAccess();
}