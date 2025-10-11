/**
 * 全局导航组件：注入顶部导航、支持主题切换
 */
(function (window, document) {
    'use strict';

    var NAV_ITEMS = [
        { id: 'home', text: '首页', href: 'index.html' },
        { id: 'think-tank', text: '质点智库', href: 'think-tank.html' },
        { id: 'youwo-ai', text: '有物AI', href: 'youwo-ai.html' },
        { id: 'updates', text: '更新日志', href: 'updates.html' },
        { id: 'trends', text: '行业趋势', href: '#' }
    ];

    var STYLE = '.vm-nav{backdrop-filter:blur(14px);background:var(--vm-nav-bg,rgba(15,15,15,.85));border-bottom:1px solid var(--vm-nav-border,rgba(255,215,0,.12));transition:background .3s ease,border-color .3s ease,transform .3s ease,backdrop-filter .3s ease;will-change:transform,backdrop-filter;}' +
        '.vm-nav.vm-nav-scrolled{backdrop-filter:blur(22px);background:var(--vm-nav-bg-scrolled,rgba(15,15,15,.95));border-bottom-color:var(--vm-nav-border-strong,rgba(255,215,0,.28));}' +
        '.vm-nav.vm-nav-hidden{transform:translateY(-100%);}' +
        '.vm-nav-desktop{display:none;align-items:center;gap:1.75rem;}.vm-nav-links{display:flex;gap:2rem;}' +
        '.vm-nav-item{position:relative;display:inline-block;padding:.5rem 0;text-decoration:none;font-weight:300;letter-spacing:.08em;color:var(--vm-nav-link,#d1d5db);transition:color .3s ease,transform .3s ease;}' +
        '.vm-nav-item.active{color:var(--vm-nav-link-active,#D4AF37);}.vm-nav-item::after{content:\"\";position:absolute;bottom:-4px;left:0;width:0;height:2px;background:linear-gradient(90deg,var(--vm-nav-underline-start,#D4AF37),var(--vm-nav-underline-end,#FFD700));transition:width .3s ease;}' +
        '.vm-nav-item.active::after,.vm-nav-item:not(.active):hover::after{width:100%;}.vm-nav-item:not(.active):hover{color:var(--vm-nav-link-hover,#FFD700);transform:translateY(-1px);}' +
        '.vm-nav-brand-subtitle{color:var(--vm-nav-brand,rgba(209,213,219,.85));transition:color .3s ease;}' +
        '.vm-theme-toggle,.vm-theme-toggle-mobile{display:inline-flex;align-items:center;gap:.5rem;border-radius:9999px;border:1px solid var(--vm-toggle-border,rgba(212,175,55,.35));background:var(--vm-toggle-bg,rgba(15,15,15,.5));color:var(--vm-toggle-text,#f1f5f9);letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .3s ease;}' +
        '.vm-theme-toggle{padding:.5rem 1.25rem;font-size:.875rem;}.vm-theme-toggle-mobile{padding:.5rem 1rem;font-size:.75rem;}' +
        '.vm-theme-toggle:hover,.vm-theme-toggle-mobile:hover{border-color:var(--vm-toggle-border-hover,rgba(212,175,55,.55));background:var(--vm-toggle-bg-hover,rgba(212,175,55,.18));color:var(--vm-nav-link-active,#D4AF37);box-shadow:0 18px 36px var(--vm-toggle-shadow,rgba(212,175,55,.18));transform:translateY(-1px);}' +
        '.vm-theme-toggle-icon{display:inline-flex;align-items:center;justify-content:center;width:1.75rem;height:1.75rem;border-radius:9999px;background:var(--vm-toggle-icon-bg,rgba(212,175,55,.12));}' +
        '.vm-nav-mobile{display:none;color:var(--vm-nav-link-active,#D4AF37);transition:color .3s ease,transform .3s ease;}.vm-nav-mobile:hover{color:var(--vm-nav-link-hover,#FFD700);transform:scale(1.05);}' +
        '.vm-nav-mobile-menu{background:var(--vm-mobile-menu-bg,rgba(15,15,15,.96));backdrop-filter:blur(20px);border-top:1px solid var(--vm-nav-border,rgba(255,215,0,.12));margin-top:1rem;border-radius:1rem;overflow:hidden;}' +
        '.vm-nav-mobile-item{display:block;padding:1rem 1.5rem;color:var(--vm-nav-link,#d1d5db);text-decoration:none;border-bottom:1px solid var(--vm-mobile-divider,rgba(255,255,255,.06));transition:all .3s ease;}.vm-nav-mobile-item:last-child{border-bottom:none;}' +
        '.vm-nav-mobile-item.active{color:var(--vm-nav-link-active,#D4AF37);background:var(--vm-mobile-active-bg,rgba(212,175,55,.16));}.vm-nav-mobile-item:hover{color:var(--vm-nav-link-hover,#FFD700);background:var(--vm-mobile-hover-bg,rgba(212,175,55,.1));padding-left:1.75rem;}' +
        '.vm-nav-mobile-theme{padding:1.25rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;background:var(--vm-mobile-theme-bg,rgba(212,175,55,.12));}.vm-nav-mobile-theme-label{font-size:.75rem;letter-spacing:.16em;color:var(--vm-nav-link,#d1d5db);}' +
        '@media (max-width:768px){.vm-nav-desktop{display:none;}.vm-nav-mobile{display:block;}}@media (min-width:769px){.vm-nav-desktop{display:flex;}.vm-nav-mobile{display:none;}.vm-nav-mobile-menu{display:none!important;}}';

    function onReady(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
        else fn();
    }

    function Navigation() {
        this.currentPage = null;
        this.mobileMenu = null;
        this.mobileToggleBtn = null;
        this.themeChangeHandler = null;
        this.scrollHandler = null;
    }

    Navigation.prototype.init = function () {
        this.currentPage = this.detectCurrentPage();
        this.injectCSS();
        this.render();
        this.bindEvents();
        this.observeTheme();
    };

    Navigation.prototype.detectCurrentPage = function () { var file = window.location.pathname.split('/').pop() || 'index.html'; var map = { '': 'home', 'index.html': 'home', 'think-tank.html': 'think-tank', 'youwo-ai.html': 'youwo-ai', 'updates.html': 'updates' }; return map[file] || 'home'; };

    Navigation.prototype.injectCSS = function () { if (document.getElementById('vm-navigation-styles')) return; var style = document.createElement('style'); style.id = 'vm-navigation-styles'; style.textContent = STYLE; document.head.appendChild(style); };

    Navigation.prototype.render = function () {
        var container = document.getElementById('vm-navigation');
        if (!container) {
            container = document.createElement('nav');
            container.id = 'vm-navigation';
            document.body.insertBefore(container, document.body.firstChild);
        }
        container.innerHTML = this.buildTemplate();
        this.mobileMenu = container.querySelector('#vm-mobile-menu');
        this.mobileToggleBtn = container.querySelector('#vm-mobile-menu-btn');
        this.updateActiveStates();
        this.updateThemeToggle(this.getActiveTheme());
    };

    Navigation.prototype.buildTemplate = function () {
        var hasTheme = Boolean(window.vmThemeManager);
        return [
            '<nav class="vm-nav fixed top-0 w-full z-50"><div class="max-w-7xl mx-auto px-6 py-4"><div class="flex justify-between items-center">',
            '<div class="flex items-center space-x-6"><div class="relative group">',
            '<div class="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>',
            '<div class="vm-gradient-text text-3xl font-bold relative z-10 transform group-hover:scale-110 transition-all duration-300">VM</div>',
            '</div><div class="h-8 w-px bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent"></div>',
            '<div class="vm-nav-brand-subtitle text-sm font-light tracking-wider hover:text-yellow-300 transition-colors duration-300">上海虚空有物科技公司</div></div>',
            '<div class="vm-nav-desktop"><div class="vm-nav-links">', this.buildLinks('vm-nav-item'), '</div>', hasTheme ? this.buildDesktopToggle() : '', '</div>',
            '<button id="vm-mobile-menu-btn" type="button" class="vm-nav-mobile"><i class="fas fa-bars text-xl"></i></button>',
            '</div><div id="vm-mobile-menu" class="vm-nav-mobile-menu hidden">', this.buildLinks('vm-nav-mobile-item'), hasTheme ? this.buildMobileToggle() : '', '</div></div></nav>'
        ].join('');
    };

    Navigation.prototype.buildLinks = function (className) { return NAV_ITEMS.map(function (item) { return '<a href="' + item.href + '" class="' + className + '" data-nav-id="' + item.id + '">' + item.text + '</a>'; }).join(''); };

    Navigation.prototype.buildDesktopToggle = function () {
        return '<button id="vm-theme-toggle" type="button" class="vm-theme-toggle" aria-label="切换为浅色模式"><span class="vm-theme-toggle-icon"><i class="fas fa-sun"></i></span><span class="vm-theme-toggle-text">浅色模式</span></button>';
    };

    Navigation.prototype.buildMobileToggle = function () {
        return '<div class="vm-nav-mobile-theme"><div class="vm-nav-mobile-theme-label">THEME</div><button id="vm-theme-toggle-mobile" type="button" class="vm-theme-toggle-mobile" aria-label="切换为浅色模式"><i class="fas fa-sun"></i><span class="vm-theme-toggle-mobile-text">浅色模式</span></button></div>';
    };

    Navigation.prototype.updateActiveStates = function () { var activeId = this.currentPage; document.querySelectorAll('[data-nav-id]').forEach(function (link) { link.classList.toggle('active', link.dataset.navId === activeId); }); };

    Navigation.prototype.bindEvents = function () {
        var _this = this;
        if (this.mobileToggleBtn && this.mobileMenu) {
            this.mobileToggleBtn.addEventListener('click', function () {
                var isHidden = _this.mobileMenu.classList.contains('hidden');
                _this.mobileMenu.classList.toggle('hidden', !isHidden);
                var icon = _this.mobileToggleBtn.querySelector('i');
                if (icon) icon.className = isHidden ? 'fas fa-times text-xl' : 'fas fa-bars text-xl';
            });
            this.mobileMenu.addEventListener('click', function (event) {
                if (event.target.matches('a')) {
                    _this.mobileMenu.classList.add('hidden');
                    var icon = _this.mobileToggleBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars text-xl';
                }
            });
        }
        var desktopToggle = document.getElementById('vm-theme-toggle');
        var mobileToggle = document.getElementById('vm-theme-toggle-mobile');
        var toggleHandler = function () {
            if (!window.vmThemeManager) return;
            var theme = window.vmThemeManager.toggleTheme();
            _this.updateThemeToggle(theme);
        };
        if (desktopToggle) desktopToggle.addEventListener('click', toggleHandler);
        if (mobileToggle) mobileToggle.addEventListener('click', toggleHandler);
        this.bindScrollEffect();
    };

    Navigation.prototype.observeTheme = function () {
        var _this = this;
        if (!window.vmThemeManager) return;
        this.themeChangeHandler = function (event) {
            var theme = event && event.detail ? event.detail.theme : _this.getActiveTheme();
            _this.updateThemeToggle(theme);
        };
        document.addEventListener('vm-theme-change', this.themeChangeHandler);
    };

    Navigation.prototype.updateThemeToggle = function (theme) {
        var isLight = theme === 'light';
        var iconClass = isLight ? 'fas fa-moon' : 'fas fa-sun';
        var label = isLight ? '切换为深色模式' : '切换为浅色模式';
        var text = isLight ? '深色模式' : '浅色模式';
        this.syncToggle(document.getElementById('vm-theme-toggle'), iconClass, text, label);
        this.syncToggle(document.getElementById('vm-theme-toggle-mobile'), iconClass, text, label);
    };

    Navigation.prototype.syncToggle = function (button, iconClass, text, ariaLabel) { if (!button) return; button.setAttribute('aria-label', ariaLabel); button.setAttribute('title', ariaLabel); var icon = button.querySelector('i'); if (icon) icon.className = iconClass; var textNode = button.querySelector('.vm-theme-toggle-text') || button.querySelector('.vm-theme-toggle-mobile-text'); if (textNode) textNode.textContent = text; };

    Navigation.prototype.getActiveTheme = function () { if (window.vmThemeManager && typeof window.vmThemeManager.getTheme === 'function') return window.vmThemeManager.getTheme(); return document.documentElement.getAttribute('data-theme') || 'dark'; };

    Navigation.prototype.bindScrollEffect = function () {
        var nav = document.querySelector('.vm-nav');
        if (!nav) return;
        if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
        var lastY = window.scrollY;
        this.scrollHandler = function () {
            var current = window.scrollY;
            nav.classList.toggle('vm-nav-scrolled', current > 100);
            nav.classList.toggle('vm-nav-hidden', current > lastY && current > 200);
            lastY = current;
        };
        this.scrollHandler();
        window.addEventListener('scroll', this.scrollHandler, { passive: true });
    };

    Navigation.prototype.setCurrentPage = function (pageId) { this.currentPage = pageId; this.updateActiveStates(); };

    Navigation.prototype.getCurrentPage = function () { return this.currentPage; };

    onReady(function () {
        var navigation = new Navigation();
        navigation.init();
        window.vmNavigation = navigation;
        window.VMNavigation = Navigation;
        console.log('VM 导航栏已准备就绪');
    });
})(window, document);
