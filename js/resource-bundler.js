/**
 * 资源合并和压缩工具
 * 动态合并CSS和JS文件，减少HTTP请求
 */

class ResourceBundler {
    constructor() {
        this.bundledCSS = null;
        this.bundledJS = null;
        this.loadedResources = new Set();
        this.criticalCSS = '';
        this.init();
    }

    init() {
        this.extractCriticalCSS();
        this.setupResourceOptimization();
    }

    /**
     * 提取关键CSS
     */
    extractCriticalCSS() {
        // 关键CSS规则（首屏必需）
        const criticalStyles = `
            /* Critical CSS for above-the-fold content */
            :root {
                --vm-black: #0f0f0f;
                --vm-gold: #D4AF37;
                --vm-gold-light: #F5E6A8;
                --vm-gold-dark: #B8860B;
                --vm-gold-bright: #FFD700;
            }
            
            body {
                font-family: 'Poppins', 'Noto Sans SC', sans-serif;
                background-color: var(--vm-black);
                color: #f8f9fa;
                margin: 0;
                padding: 0;
                overflow-x: hidden;
            }
            
            /* 导航栏关键样式 */
            .tk-nav, nav {
                position: fixed;
                top: 0;
                width: 100%;
                z-index: 50;
                background: rgba(15, 15, 15, 0.95);
                backdrop-filter: blur(10px);
            }
            
            /* 加载动画 */
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--vm-black);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                transition: opacity 0.5s ease;
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(212, 175, 55, 0.3);
                border-top: 3px solid var(--vm-gold);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

        this.criticalCSS = this.minifyCSS(criticalStyles);
        this.injectCriticalCSS();
    }

    /**
     * 注入关键CSS
     */
    injectCriticalCSS() {
        const style = document.createElement('style');
        style.textContent = this.criticalCSS;
        style.id = 'critical-css';
        document.head.insertBefore(style, document.head.firstChild);
    }

    /**
     * 设置资源优化
     */
    setupResourceOptimization() {
        // 延迟加载非关键CSS
        this.loadNonCriticalCSS();
        
        // 合并JS文件
        this.bundleJavaScript();
        
        // 设置资源提示
        this.setupResourceHints();
    }

    /**
     * 延迟加载非关键CSS
     */
    loadNonCriticalCSS() {
        const cssFiles = [
            'css/style.css',
            'css/think-tank.css',
            'css/reports-style.css'
        ];

        // 延迟到DOM加载完成后再加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadCSSFiles(cssFiles);
            });
        } else {
            this.loadCSSFiles(cssFiles);
        }
    }

    /**
     * 加载CSS文件
     */
    async loadCSSFiles(cssFiles) {
        const promises = cssFiles.map(file => this.loadCSS(file));
        await Promise.all(promises);
        
        // 移除加载覆盖层
        this.removeLoadingOverlay();
    }

    /**
     * 加载单个CSS文件
     */
    loadCSS(href) {
        return new Promise((resolve, reject) => {
            if (this.loadedResources.has(href)) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            
            link.onload = () => {
                this.loadedResources.add(href);
                resolve();
            };
            
            link.onerror = () => {
                console.warn(`Failed to load CSS: ${href}`);
                reject(new Error(`Failed to load CSS: ${href}`));
            };

            document.head.appendChild(link);
        });
    }

    /**
     * 合并JavaScript文件
     */
    bundleJavaScript() {
        const jsFiles = [
            'js/performance.js',
            'js/auth.js',
            'js/auth-credentials.js',
            'js/reports-manager.js',
            'js/think-tank.js',
            'js/main.js'
        ];

        // 按依赖顺序加载JS文件
        this.loadJavaScriptSequentially(jsFiles);
    }

    /**
     * 按顺序加载JavaScript文件
     */
    async loadJavaScriptSequentially(jsFiles) {
        for (const file of jsFiles) {
            try {
                await this.loadJS(file);
            } catch (error) {
                console.warn(`Failed to load JS: ${file}`, error);
            }
        }
    }

    /**
     * 加载单个JavaScript文件
     */
    loadJS(src) {
        return new Promise((resolve, reject) => {
            if (this.loadedResources.has(src)) {
                resolve();
                return;
            }

            // 检查文件是否存在
            if (!this.checkFileExists(src)) {
                resolve(); // 文件不存在时跳过，不报错
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = false; // 保持执行顺序
            
            script.onload = () => {
                this.loadedResources.add(src);
                resolve();
            };
            
            script.onerror = () => {
                resolve(); // 即使失败也继续加载其他文件
            };

            document.head.appendChild(script);
        });
    }

    /**
     * 检查文件是否存在
     */
    checkFileExists(url) {
        const existingScript = document.querySelector(`script[src="${url}"]`);
        const existingLink = document.querySelector(`link[href="${url}"]`);
        return !existingScript && !existingLink;
    }

    /**
     * 设置资源提示
     */
    setupResourceHints() {
        // DNS预解析
        this.addDNSPrefetch([
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com',
            'https://cdn.tailwindcss.com'
        ]);

        // 预连接关键域名
        this.addPreconnect([
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ]);
    }

    /**
     * 添加DNS预解析
     */
    addDNSPrefetch(domains) {
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    /**
     * 添加预连接
     */
    addPreconnect(domains) {
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    /**
     * 压缩CSS
     */
    minifyCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
            .replace(/\s+/g, ' ') // 压缩空白字符
            .replace(/;\s*}/g, '}') // 移除最后一个分号
            .replace(/\s*{\s*/g, '{') // 压缩大括号
            .replace(/}\s*/g, '}') // 压缩大括号
            .replace(/:\s*/g, ':') // 压缩冒号
            .replace(/;\s*/g, ';') // 压缩分号
            .trim();
    }

    /**
     * 移除加载覆盖层
     */
    removeLoadingOverlay() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 500);
        }
    }

    /**
     * 创建加载覆盖层
     */
    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
        `;
        document.body.appendChild(overlay);
    }

    /**
     * 获取资源加载统计
     */
    getLoadingStats() {
        return {
            loadedResources: this.loadedResources.size,
            resourceList: Array.from(this.loadedResources)
        };
    }
}

// 初始化资源打包器
const resourceBundler = new ResourceBundler();

// 导出供全局使用
if (typeof window !== 'undefined') {
    window.ResourceBundler = ResourceBundler;
    window.resourceBundler = resourceBundler;
}