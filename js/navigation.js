/**
 * 虚空有物质点智库 - 全局导航栏组件
 * 统一的导航栏实现，支持自动激活状态检测
 * Version: 2025.09.02
 */

class VMNavigation {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.navItems = [
            { id: 'home', text: '首页', href: 'index.html' },
            { id: 'think-tank', text: '质点智库', href: 'think-tank.html' },
            { id: 'youwo-ai', text: '有物AI', href: 'youwo-ai.html' },
            { id: 'updates', text: '更新日志', href: 'updates.html' },
            { id: 'trends', text: '行业趋势', href: '#' }
        ];
        this.init();
    }

    /**
     * 检测当前页面
     */
    detectCurrentPage() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop() || 'index.html';
        
        // 页面映射
        const pageMap = {
            'index.html': 'home',
            '': 'home',
            'think-tank.html': 'think-tank',
            'youwo-ai.html': 'youwo-ai',
            'updates.html': 'updates'
        };
        
        return pageMap[fileName] || 'home';
    }

    /**
     * 初始化导航栏
     */
    init() {
        this.injectCSS();
        this.renderNavigation();
        this.addEventListeners();
    }

    /**
     * 注入导航栏样式
     */
    injectCSS() {
        if (document.getElementById('vm-navigation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'vm-navigation-styles';
        style.textContent = `
            .vm-nav {
                backdrop-filter: blur(10px);
                background: rgba(15, 15, 15, 0.8);
                border-bottom: 1px solid rgba(255, 215, 0, 0.1);
                transition: all 0.3s ease;
            }
            
            .vm-nav-item {
                position: relative;
                display: inline-block;
                padding: 0.5rem 0;
                text-decoration: none;
                font-weight: 300;
                letter-spacing: 0.05em;
                transition: all 0.3s ease;
            }
            
            .vm-nav-item.active {
                color: #D4AF37;
            }
            
            .vm-nav-item:not(.active) {
                color: #d1d5db;
            }
            
            .vm-nav-item:not(.active):hover {
                color: #D4AF37;
                transform: translateY(-1px);
            }
            
            .vm-nav-item::after {
                content: '';
                position: absolute;
                bottom: -4px;
                left: 0;
                width: 0;
                height: 2px;
                background: linear-gradient(90deg, #D4AF37, #FFD700);
                transition: width 0.3s ease;
            }
            
            .vm-nav-item.active::after {
                width: 100%;
            }
            
            .vm-nav-item:not(.active):hover::after {
                width: 100%;
            }
            
            .vm-gradient-text {
                background: linear-gradient(135deg, #D4AF37, #FFD700, #F5E6A8, #C9AA71, #B8860B);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                background-size: 200% 200%;
                animation: vm-glass-shimmer 4s ease-in-out infinite;
            }
            
            @keyframes vm-glass-shimmer {
                0%, 100% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
            }
            
            /* 移动端样式 */
            @media (max-width: 768px) {
                .vm-nav-desktop {
                    display: none;
                }
                
                .vm-nav-mobile {
                    display: block;
                }
                
                .vm-nav-mobile-menu {
                    background: rgba(15, 15, 15, 0.95);
                    backdrop-filter: blur(15px);
                    border-top: 1px solid rgba(255, 215, 0, 0.1);
                }
                
                .vm-nav-mobile-item {
                    display: block;
                    padding: 1rem 1.5rem;
                    color: #d1d5db;
                    text-decoration: none;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.3s ease;
                }
                
                .vm-nav-mobile-item.active {
                    color: #D4AF37;
                    background: rgba(212, 175, 55, 0.1);
                }
                
                .vm-nav-mobile-item:hover {
                    color: #D4AF37;
                    background: rgba(212, 175, 55, 0.05);
                }
            }
            
            @media (min-width: 769px) {
                .vm-nav-mobile {
                    display: none;
                }
                
                .vm-nav-desktop {
                    display: flex;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 渲染导航栏
     */
    renderNavigation() {
        // 查找导航容器
        let navContainer = document.getElementById('vm-navigation');
        if (!navContainer) {
            // 如果没有容器，在body顶部创建
            navContainer = document.createElement('nav');
            navContainer.id = 'vm-navigation';
            document.body.insertBefore(navContainer, document.body.firstChild);
        }

        const navHTML = `
            <nav class="vm-nav fixed top-0 w-full z-50">
                <div class="max-w-7xl mx-auto px-6 py-4">
                    <div class="flex justify-between items-center">
                        <!-- 左侧：品牌标识 -->
                        <div class="flex items-center space-x-6">
                            <div class="relative group">
                                <div class="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <div class="vm-gradient-text text-3xl font-bold relative z-10 transform group-hover:scale-110 transition-all duration-300">VM</div>
                            </div>
                            <div class="h-8 w-px bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent"></div>
                            <div class="text-gray-300 text-sm font-light tracking-wider hover:text-yellow-300 transition-colors duration-300">上海虚空有物科技公司</div>
                        </div>
                        
                        <!-- 右侧：桌面端导航菜单 -->
                        <div class="vm-nav-desktop space-x-8">
                            ${this.renderDesktopNavItems()}
                        </div>
                        
                        <!-- 移动端菜单按钮 -->
                        <button id="vm-mobile-menu-btn" class="vm-nav-mobile text-yellow-400 hover:text-yellow-300 transition-colors duration-300 transform hover:scale-110">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                    </div>
                    
                    <!-- 移动端导航菜单 -->
                    <div id="vm-mobile-menu" class="vm-nav-mobile-menu hidden">
                        ${this.renderMobileNavItems()}
                    </div>
                </div>
            </nav>
        `;

        navContainer.innerHTML = navHTML;
    }

    /**
     * 渲染桌面端导航项
     */
    renderDesktopNavItems() {
        return this.navItems.map(item => {
            const isActive = this.currentPage === item.id;
            const activeClass = isActive ? 'active' : '';
            
            return `
                <a href="${item.href}" class="vm-nav-item ${activeClass}">
                    ${item.text}
                </a>
            `;
        }).join('');
    }

    /**
     * 渲染移动端导航项
     */
    renderMobileNavItems() {
        return this.navItems.map(item => {
            const isActive = this.currentPage === item.id;
            const activeClass = isActive ? 'active' : '';
            
            return `
                <a href="${item.href}" class="vm-nav-mobile-item ${activeClass}">
                    ${item.text}
                </a>
            `;
        }).join('');
    }

    /**
     * 添加事件监听器
     */
    addEventListeners() {
        // 移动端菜单切换
        const mobileMenuBtn = document.getElementById('vm-mobile-menu-btn');
        const mobileMenu = document.getElementById('vm-mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                const isHidden = mobileMenu.classList.contains('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                
                if (isHidden) {
                    mobileMenu.classList.remove('hidden');
                    icon.className = 'fas fa-times text-xl';
                } else {
                    mobileMenu.classList.add('hidden');
                    icon.className = 'fas fa-bars text-xl';
                }
            });
            
            // 点击移动端链接时关闭菜单
            mobileMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    mobileMenu.classList.add('hidden');
                    mobileMenuBtn.querySelector('i').className = 'fas fa-bars text-xl';
                }
            });
        }

        // 滚动时导航栏透明度变化
        this.addScrollEffect();
    }

    /**
     * 添加滚动效果
     */
    addScrollEffect() {
        let lastScrollY = window.scrollY;
        const nav = document.querySelector('.vm-nav');
        
        if (!nav) return;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                nav.style.background = 'rgba(15, 15, 15, 0.95)';
                nav.style.backdropFilter = 'blur(15px)';
            } else {
                nav.style.background = 'rgba(15, 15, 15, 0.8)';
                nav.style.backdropFilter = 'blur(10px)';
            }
            
            // 滚动隐藏/显示导航（可选功能）
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    /**
     * 手动设置当前页面（如果自动检测不准确）
     */
    setCurrentPage(pageId) {
        this.currentPage = pageId;
        this.renderNavigation();
        this.addEventListeners();
    }

    /**
     * 获取当前页面ID
     */
    getCurrentPage() {
        return this.currentPage;
    }
}

// 创建全局导航实例
let vmNavigation;

// DOM加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
    vmNavigation = new VMNavigation();
    
    // 导出到全局作用域
    if (typeof window !== 'undefined') {
        window.VMNavigation = VMNavigation;
        window.vmNavigation = vmNavigation;
    }
    
    console.log('✨ VM导航栏组件初始化完成');
});

// 导出类和实例
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VMNavigation, vmNavigation };
}