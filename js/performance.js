/**
 * 性能优化工具类
 * 包含懒加载、图像优化、预加载等功能
 */

class PerformanceOptimizer {
    constructor() {
        this.imageObserver = null;
        this.linkObserver = null;
        this.isPreloadingEnabled = true;
        this.loadedImages = new Set();
        this.init();
    }

    init() {
        this.initLazyLoading();
        this.initLinkPreloading();
        this.initCriticalResourcePreloading();
        this.setupPerformanceMonitoring();
    }

    /**
     * 初始化图像懒加载
     */
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // 观察所有懒加载图片
            this.observeImages();
        } else {
            // 降级方案：直接加载所有图片
            this.loadAllImages();
        }
    }

    /**
     * 观察所有需要懒加载的图片
     */
    observeImages() {
        document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    /**
     * 加载单个图片
     */
    loadImage(img) {
        return new Promise((resolve, reject) => {
            const imageSrc = img.dataset.src || img.src;
            
            if (this.loadedImages.has(imageSrc)) {
                resolve();
                return;
            }

            // 显示加载状态
            img.classList.add('loading');

            // 创建新图片对象进行预加载
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
                // 设置图片源
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                    img.removeAttribute('data-srcset');
                }

                // 添加淡入动画
                img.classList.remove('loading');
                img.classList.add('loaded');
                
                this.loadedImages.add(imageSrc);
                resolve();
            };

            imageLoader.onerror = () => {
                img.classList.remove('loading');
                img.classList.add('error');
                console.warn(`Failed to load image: ${imageSrc}`);
                reject(new Error(`Failed to load image: ${imageSrc}`));
            };

            imageLoader.src = imageSrc;
        });
    }

    /**
     * 降级方案：加载所有图片
     */
    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    /**
     * 初始化链接预加载
     */
    initLinkPreloading() {
        if ('IntersectionObserver' in window) {
            this.linkObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && this.isPreloadingEnabled) {
                        const link = entry.target;
                        this.preloadPage(link.href);
                    }
                });
            }, {
                rootMargin: '200px'
            });

            // 观察重要链接
            document.querySelectorAll('a[href]').forEach(link => {
                if (this.shouldPreloadLink(link)) {
                    this.linkObserver.observe(link);
                }
            });
        }
    }

    /**
     * 判断是否应该预加载链接
     */
    shouldPreloadLink(link) {
        const href = link.href;
        return href && 
               href.startsWith(window.location.origin) && 
               !href.includes('#') && 
               !href.includes('mailto:') && 
               !href.includes('tel:');
    }

    /**
     * 预加载页面
     */
    preloadPage(url) {
        if (!url || url === window.location.href) return;

        // 检查是否已经预加载过
        if (document.querySelector(`link[rel="prefetch"][href="${url}"]`)) return;

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    /**
     * 初始化关键资源预加载
     */
    initCriticalResourcePreloading() {
        // 预加载关键字体
        this.preloadFont('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        this.preloadFont('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap');

        // 预加载关键CSS
        const criticalCSS = [
            'css/style.css',
            'css/think-tank.css'
        ];

        criticalCSS.forEach(css => this.preloadCSS(css));
    }

    /**
     * 预加载字体
     */
    preloadFont(fontUrl) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = fontUrl;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    }

    /**
     * 预加载CSS
     */
    preloadCSS(cssUrl) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = cssUrl;
        document.head.appendChild(link);
    }

    /**
     * 设置性能监控
     */
    setupPerformanceMonitoring() {
        // 监控首屏渲染时间
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        const metrics = {
                            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                            firstPaint: this.getFirstPaint(),
                            firstContentfulPaint: this.getFirstContentfulPaint()
                        };
                        
                        // 只在开发环境记录
                        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                            console.log('Performance Metrics:', metrics);
                        }
                    }
                }, 0);
            });
        }
    }

    /**
     * 获取首次绘制时间
     */
    getFirstPaint() {
        const paint = performance.getEntriesByType('paint');
        const fp = paint.find(entry => entry.name === 'first-paint');
        return fp ? fp.startTime : null;
    }

    /**
     * 获取首次内容绘制时间
     */
    getFirstContentfulPaint() {
        const paint = performance.getEntriesByType('paint');
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? fcp.startTime : null;
    }

    /**
     * 动态观察新添加的图片
     */
    observeNewImages(container = document) {
        if (this.imageObserver) {
            container.querySelectorAll('img[data-src]:not(.observed)').forEach(img => {
                img.classList.add('observed');
                this.imageObserver.observe(img);
            });
        }
    }

    /**
     * 启用/禁用预加载
     */
    togglePreloading(enabled) {
        this.isPreloadingEnabled = enabled;
    }

    /**
     * 清理资源
     */
    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
        if (this.linkObserver) {
            this.linkObserver.disconnect();
        }
    }
}

// 初始化性能优化器
const performanceOptimizer = new PerformanceOptimizer();

// 导出供全局使用
if (typeof window !== 'undefined') {
    window.PerformanceOptimizer = PerformanceOptimizer;
    window.performanceOptimizer = performanceOptimizer;
}