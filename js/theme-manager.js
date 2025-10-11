/**
 * 主题管理器：负责高端风格站点的浅色与深色切换，以及跨组件的状态同步
 */
(function (window, document) {
    'use strict';

    /**
     * VMThemeManager 用于管理主题状态、持久化以及全局通知
     */
    function VMThemeManager(options) {
        /* 构造函数：初始化配置并立即应用首个主题 */
        this.storageKey = (options && options.storageKey) || 'vm-theme';
        this.defaultTheme = (options && options.defaultTheme) || 'dark';
        this.htmlEl = document.documentElement;
        this.supportedThemes = ['dark', 'light'];
        this.mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
        this.waitingForBody = false;
        this.currentTheme = this.resolveInitialTheme();

        /* 绑定系统主题变更的处理函数，保证 this 指向 */
        this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);

        /* 首次应用主题，emit 关闭以避免重复派发 */
        this.applyTheme(this.currentTheme, { persist: false, emit: false });
        this.registerSystemListener();
    }

    /**
     * 根据缓存与系统偏好确定初始主题
     */
    VMThemeManager.prototype.resolveInitialTheme = function () {
        var storedTheme = this.getStoredTheme();
        if (storedTheme && this.supportedThemes.indexOf(storedTheme) !== -1) {
            return storedTheme;
        }
        if (this.mediaQuery && typeof this.mediaQuery.matches === 'boolean') {
            return this.mediaQuery.matches ? 'light' : 'dark';
        }
        return this.defaultTheme;
    };

    /**
     * 安全地读取本地缓存
     */
    VMThemeManager.prototype.getStoredTheme = function () {
        try {
            return window.localStorage ? window.localStorage.getItem(this.storageKey) : null;
        } catch (error) {
            return null;
        }
    };

    /**
     * 安全地写入本地缓存
     */
    VMThemeManager.prototype.saveTheme = function (theme) {
        try {
            if (window.localStorage) {
                window.localStorage.setItem(this.storageKey, theme);
            }
        } catch (error) {
            /* 本地存储不可用时静默失败，避免打断用户操作 */
        }
    };

    /**
     * 应用主题：更新文档结构、持久化并通知监听者
     */
    VMThemeManager.prototype.applyTheme = function (theme, options) {
        var config = Object.assign({ persist: true, emit: true }, options);
        if (this.supportedThemes.indexOf(theme) === -1) {
            theme = this.defaultTheme;
        }
        this.currentTheme = theme;
        this.updateDocument(theme);
        if (config.persist) {
            this.saveTheme(theme);
        }
        if (config.emit) {
            this.emitThemeChange(theme);
        }
        return theme;
    };

    /**
     * 更新 html/body 属性，方便 CSS 做差异化样式
     */
    VMThemeManager.prototype.updateDocument = function (theme) {
        this.htmlEl.setAttribute('data-theme', theme);
        this.htmlEl.classList.toggle('vm-theme-light', theme === 'light');
        this.htmlEl.style.colorScheme = theme === 'light' ? 'light' : 'dark';

        if (document.body) {
            document.body.dataset.theme = theme;
            document.body.classList.toggle('vm-theme-light', theme === 'light');
        } else if (!this.waitingForBody) {
            /* 若 body 尚未就绪，监听 DOMContentLoaded 后再补一次 */
            this.waitingForBody = true;
            document.addEventListener(
                'DOMContentLoaded',
                function () {
                    this.waitingForBody = false;
                    this.updateDocument(theme);
                }.bind(this),
                { once: true }
            );
        }
    };

    /**
     * 切换主题：返回切换后的值，方便调用者更新 UI
     */
    VMThemeManager.prototype.toggleTheme = function () {
        var nextTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        return this.applyTheme(nextTheme);
    };

    /**
     * 获取当前主题
     */
    VMThemeManager.prototype.getTheme = function () {
        return this.currentTheme;
    };

    /**
     * 响应系统主题变化（仅当用户未手动设置时生效）
     */
    VMThemeManager.prototype.handleSystemThemeChange = function (event) {
        if (this.getStoredTheme()) {
            return;
        }
        var nextTheme = event.matches ? 'light' : 'dark';
        this.applyTheme(nextTheme, { persist: false });
    };

    /**
     * 注册系统主题监听器
     */
    VMThemeManager.prototype.registerSystemListener = function () {
        if (!this.mediaQuery) {
            return;
        }
        if (typeof this.mediaQuery.addEventListener === 'function') {
            this.mediaQuery.addEventListener('change', this.handleSystemThemeChange);
            return;
        }
        if (typeof this.mediaQuery.addListener === 'function') {
            this.mediaQuery.addListener(this.handleSystemThemeChange);
        }
    };

    /**
     * 向全局派发主题变更事件，便于组件自行响应
     */
    VMThemeManager.prototype.emitThemeChange = function (theme) {
        var event = new CustomEvent('vm-theme-change', { detail: { theme: theme } });
        document.dispatchEvent(event);
    };

    /* 创建全局实例，供其他模块共用 */
    window.vmThemeManager = new VMThemeManager();
})(window, document);
