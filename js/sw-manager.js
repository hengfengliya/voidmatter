/**
 * Service Worker 管理器
 * 负责注册、更新、通信等功能
 */

class ServiceWorkerManager {
    constructor() {
        this.sw = null;
        this.isUpdateAvailable = false;
        this.deferredPrompt = null;
        this.init();
    }

    async init() {
        if ('serviceWorker' in navigator) {
            try {
                await this.registerServiceWorker();
                this.setupUpdateHandling();
                this.setupPWAInstallPrompt();
                this.setupOfflineDetection();
            } catch (error) {
                console.warn('SW Manager: Service Worker not available:', error);
            }
        } else {
            console.warn('SW Manager: Service Worker not supported');
        }
    }

    /**
     * 注册Service Worker
     */
    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            this.sw = registration;

            console.log('SW Manager: Service Worker registered successfully');

            // 监听安装事件
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // 有新版本可用
                            this.isUpdateAvailable = true;
                            this.showUpdateNotification();
                        } else {
                            // 首次安装
                            this.showInstallNotification();
                        }
                    }
                });
            });

            // 监听控制权变更
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });

        } catch (error) {
            console.error('SW Manager: Service Worker registration failed:', error);
            throw error;
        }
    }

    /**
     * 设置更新处理
     */
    setupUpdateHandling() {
        // 检查更新按钮
        document.addEventListener('click', (event) => {
            if (event.target.matches('.update-app-btn')) {
                this.updateApp();
            }
        });

        // 定期检查更新（每小时）
        setInterval(() => {
            this.checkForUpdates();
        }, 3600000);
    }

    /**
     * 检查更新
     */
    async checkForUpdates() {
        if (this.sw) {
            try {
                await this.sw.update();
            } catch (error) {
                console.warn('SW Manager: Update check failed:', error);
            }
        }
    }

    /**
     * 更新应用
     */
    async updateApp() {
        if (this.sw && this.sw.waiting) {
            this.sw.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    }

    /**
     * 显示更新通知
     */
    showUpdateNotification() {
        this.showNotification({
            message: '发现新版本',
            description: '点击更新以获得最新功能',
            action: '立即更新',
            actionClass: 'update-app-btn',
            type: 'update'
        });
    }

    /**
     * 显示安装通知
     */
    showInstallNotification() {
        this.showNotification({
            message: '应用已缓存',
            description: '现在可以离线使用VM网站',
            type: 'success'
        });
    }

    /**
     * 设置PWA安装提示
     */
    setupPWAInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            this.deferredPrompt = event;
            this.showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            this.showNotification({
                message: '应用已安装',
                description: 'VM网站已添加到您的主屏幕',
                type: 'success'
            });
        });
    }

    /**
     * 显示安装提示
     */
    showInstallPrompt() {
        this.showNotification({
            message: '安装应用',
            description: '将VM网站添加到主屏幕，获得更好的体验',
            action: '立即安装',
            actionClass: 'install-app-btn',
            type: 'install',
            persistent: true
        });

        // 添加安装按钮事件
        document.addEventListener('click', (event) => {
            if (event.target.matches('.install-app-btn')) {
                this.installApp();
            }
        });
    }

    /**
     * 安装PWA
     */
    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('SW Manager: PWA installed');
            } else {
                console.log('SW Manager: PWA installation dismissed');
            }
            
            this.deferredPrompt = null;
            this.hideNotification('install');
        }
    }

    /**
     * 设置离线检测
     */
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.showNotification({
                message: '连接已恢复',
                description: '网络连接已恢复正常',
                type: 'success',
                duration: 3000
            });
        });

        window.addEventListener('offline', () => {
            this.showNotification({
                message: '离线模式',
                description: '网络连接中断，正在使用缓存数据',
                type: 'warning',
                persistent: true
            });
        });

        // 初始状态检查
        if (!navigator.onLine) {
            this.showNotification({
                message: '离线模式',
                description: '当前处于离线状态',
                type: 'warning'
            });
        }
    }

    /**
     * 显示通知
     */
    showNotification(options) {
        const {
            message,
            description,
            action,
            actionClass = '',
            type = 'info',
            duration = 8000,
            persistent = false
        } = options;

        // 移除现有的同类型通知
        this.hideNotification(type);

        const notification = document.createElement('div');
        notification.className = `sw-notification sw-notification-${type}`;
        notification.dataset.type = type;
        
        const icon = this.getNotificationIcon(type);
        
        notification.innerHTML = `
            <div class="sw-notification-content">
                <div class="sw-notification-icon">${icon}</div>
                <div class="sw-notification-text">
                    <div class="sw-notification-title">${message}</div>
                    <div class="sw-notification-description">${description}</div>
                </div>
                ${action ? `<button class="sw-notification-action ${actionClass}">${action}</button>` : ''}
                <button class="sw-notification-close" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // 添加样式
        this.ensureNotificationStyles();
        
        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // 自动隐藏
        if (!persistent && duration > 0) {
            setTimeout(() => {
                this.hideNotification(type);
            }, duration);
        }
    }

    /**
     * 隐藏通知
     */
    hideNotification(type) {
        const notification = document.querySelector(`.sw-notification[data-type="${type}"]`);
        if (notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }

    /**
     * 获取通知图标
     */
    getNotificationIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            error: '<i class="fas fa-times-circle"></i>',
            info: '<i class="fas fa-info-circle"></i>',
            update: '<i class="fas fa-download"></i>',
            install: '<i class="fas fa-mobile-alt"></i>'
        };
        return icons[type] || icons.info;
    }

    /**
     * 确保通知样式存在
     */
    ensureNotificationStyles() {
        if (document.getElementById('sw-notification-styles')) {
            return;
        }

        const styles = document.createElement('style');
        styles.id = 'sw-notification-styles';
        styles.textContent = `
            .sw-notification {
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(10, 10, 10, 0.95));
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 12px;
                padding: 16px;
                max-width: 400px;
                z-index: 10001;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                transform: translateX(450px);
                opacity: 0;
                transition: all 0.3s ease;
            }

            .sw-notification.show {
                transform: translateX(0);
                opacity: 1;
            }

            .sw-notification-content {
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }

            .sw-notification-icon {
                color: var(--vm-gold);
                font-size: 20px;
                margin-top: 2px;
            }

            .sw-notification-text {
                flex: 1;
                color: #f8f9fa;
            }

            .sw-notification-title {
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 4px;
            }

            .sw-notification-description {
                font-size: 12px;
                color: #adb5bd;
                line-height: 1.4;
            }

            .sw-notification-action {
                background: var(--vm-gold);
                color: var(--vm-black);
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-left: 8px;
            }

            .sw-notification-action:hover {
                background: var(--vm-gold-bright);
                transform: translateY(-1px);
            }

            .sw-notification-close {
                background: none;
                border: none;
                color: #6c757d;
                cursor: pointer;
                padding: 4px;
                margin-left: 8px;
                border-radius: 4px;
                transition: color 0.3s ease;
            }

            .sw-notification-close:hover {
                color: #f8f9fa;
            }

            .sw-notification-warning {
                border-color: rgba(255, 193, 7, 0.3);
            }

            .sw-notification-warning .sw-notification-icon {
                color: #ffc107;
            }

            .sw-notification-success {
                border-color: rgba(40, 167, 69, 0.3);
            }

            .sw-notification-success .sw-notification-icon {
                color: #28a745;
            }

            .sw-notification-error {
                border-color: rgba(220, 53, 69, 0.3);
            }

            .sw-notification-error .sw-notification-icon {
                color: #dc3545;
            }

            @media (max-width: 768px) {
                .sw-notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    transform: translateY(-100px);
                }

                .sw-notification.show {
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(styles);
    }

    /**
     * 获取缓存信息
     */
    async getCacheInfo() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            const cacheInfo = {};
            
            for (const name of cacheNames) {
                const cache = await caches.open(name);
                const keys = await cache.keys();
                cacheInfo[name] = {
                    count: keys.length,
                    urls: keys.map(req => req.url)
                };
            }
            
            return cacheInfo;
        }
        return {};
    }

    /**
     * 清理缓存
     */
    async clearCache() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            
            this.showNotification({
                message: '缓存已清理',
                description: '所有缓存数据已被清除',
                type: 'success'
            });
        }
    }
}

// 初始化Service Worker管理器
const swManager = new ServiceWorkerManager();

// 导出供全局使用
if (typeof window !== 'undefined') {
    window.ServiceWorkerManager = ServiceWorkerManager;
    window.swManager = swManager;
}