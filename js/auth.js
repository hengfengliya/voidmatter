//
// --- 虚空有物-质点智库：会员认证系统 (Auth System) ---
//
// **功能描述**:
// 1.  **前端认证**: 无需后端，在客户端完成简单的会员身份验证。
// 2.  **弹窗登录**: 当用户尝试访问受保护的报告时，会弹出一个登录框。
// 3.  **会话管理**: 使用 `sessionStorage` 管理登录状态，关闭浏览器标签页后需重新登录。
// 4.  **动态生成**: 登录框的HTML和CSS由JS动态生成并注入页面，保持主HTML文件整洁。
// 5.  **访问控制**: 登录成功后，用户才能访问报告链接；否则，访问将被阻止。
//

// --- 全局变量和常量 ---
const AUTH_STYLES_ID = 'auth-styles';
const AUTH_MODAL_ID = 'auth-modal';
const LOGGED_IN_KEY = 'vm_user_logged_in';
let postLoginRedirectUrl = null; // 用于存储登录后需要跳转的URL

/**
 * 检查用户是否已登录
 * @returns {boolean} 如果用户已登录，返回 true；否则返回 false。
 */
function isAuthenticated() {
    return sessionStorage.getItem(LOGGED_IN_KEY) === 'true';
}

/**
 * 请求访问受保护的资源 (如报告)
 * @param {string} url - 目标资源的URL
 */
function requestAccess(url) {
    if (isAuthenticated()) {
        // 如果已登录，使用模态框打开报告（保留阅读进度条和ESC退出功能）
        if (window.openReportModal) {
            // 从URL获取报告标题
            const reportTitle = getReportTitleFromUrl(url);
            window.openReportModal(url, reportTitle);
        } else {
            // 降级处理：直接在新标签页打开
            window.open(url, '_blank');
        }
    } else {
        // 如果未登录，存储目标URL并显示登录框
        postLoginRedirectUrl = url;
        showLoginModal();
    }
}

/**
 * 从URL路径获取报告标题
 * @param {string} url - 报告文件路径
 * @returns {string} - 报告标题
 */
function getReportTitleFromUrl(url) {
    // 从reports database中查找对应的标题
    if (window.reportsDatabase) {
        const report = window.reportsDatabase.find(r => r.filePath === url);
        if (report) {
            return report.title;
        }
    }
    
    // 降级处理：从文件名生成标题
    const fileName = url.split('/').pop().split('.')[0];
    return fileName.replace(/[-_]/g, ' ');
}

/**
 * 执行登录操作
 * @param {string} username - 用户名
 * @param {string} password - 密码
 */
function login(username, password) {
    const errorElement = document.getElementById('auth-error-message');
    const errorText = errorElement.querySelector('.error-text');
    
    // 检查凭证是否存在于 `userCredentials` (来自 auth-credentials.js)
    if (userCredentials[username] && userCredentials[username] === password) {
        // 凭证正确
        sessionStorage.setItem(LOGGED_IN_KEY, 'true');
        hideLoginModal();
        updateAuthUI(); // 更新UI状态

        // 如果有登录后需要跳转的链接，则使用模态框打开
        if (postLoginRedirectUrl) {
            if (window.openReportModal) {
                const reportTitle = getReportTitleFromUrl(postLoginRedirectUrl);
                window.openReportModal(postLoginRedirectUrl, reportTitle);
            } else {
                // 降级处理：直接在新标签页打开
                window.open(postLoginRedirectUrl, '_blank');
            }
            postLoginRedirectUrl = null; // 清除
        }
    } else {
        // 凭证错误
        errorText.textContent = '用户名或密码错误，请重试';
        errorElement.style.display = 'flex';
        
        // 添加震动效果
        errorElement.classList.add('shake');
        setTimeout(() => {
            errorElement.classList.remove('shake');
        }, 600);
    }
}

/**
 * 执行登出操作
 */
function logout() {
    sessionStorage.removeItem(LOGGED_IN_KEY);
    updateAuthUI();
}

/**
 * 显示登录弹窗
 */
function showLoginModal() {
    const modal = document.getElementById(AUTH_MODAL_ID);
    if (modal) {
        modal.style.display = 'flex';
        // 在显示时添加动效
        setTimeout(() => {
            const modalContent = modal.querySelector('.auth-modal-content');
            if(modalContent) modalContent.style.transform = 'translateY(0)';
        }, 10);
    }
}

/**
 * 隐藏登录弹窗
 */
function hideLoginModal() {
    const modal = document.getElementById(AUTH_MODAL_ID);
    if (modal) {
        const modalContent = modal.querySelector('.auth-modal-content');
        if (modalContent) {
            modalContent.style.transform = 'translateY(-50px) scale(0.95)';
            modalContent.style.opacity = '0';
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
            // 重置状态
            if (modalContent) {
                modalContent.style.transform = '';
                modalContent.style.opacity = '';
            }
        }, 300);
        
        // 清理可能存在的错误信息
        const errorElement = document.getElementById('auth-error-message');
        if (errorElement) {
            errorElement.querySelector('.error-text').textContent = '';
            errorElement.style.display = 'none';
        }
    }
}

/**
 * 创建并注入登录弹窗的HTML结构 - 高端重设计版本
 */
function createLoginModal() {
    if (document.getElementById(AUTH_MODAL_ID)) return; // 防止重复创建

    const modalHTML = `
        <div id="${AUTH_MODAL_ID}" class="auth-modal-overlay">
            <!-- 背景粒子效果 -->
            <div class="auth-particles">
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
            </div>
            
            <div class="auth-modal-content">
                <!-- 装饰框架 -->
                <div class="auth-frame-decoration">
                    <div class="frame-corner frame-tl"></div>
                    <div class="frame-corner frame-tr"></div>
                    <div class="frame-corner frame-bl"></div>
                    <div class="frame-corner frame-br"></div>
                </div>
                
                <!-- 关闭按钮 -->
                <button class="auth-close-btn">
                    <i class="fas fa-times"></i>
                </button>
                
                <!-- 品牌标识区域 -->
                <div class="auth-brand-section">
                    <div class="auth-brand-logo">
                        <div class="logo-glow"></div>
                        <div class="brand-text">VM</div>
                    </div>
                    <div class="auth-title">质点智库</div>
                    <div class="auth-subtitle">Point Mass Think Tank</div>
                    <div class="auth-divider"></div>
                </div>
                
                <!-- 登录表单 -->
                <form id="auth-login-form" class="auth-form">
                    <div class="form-section-title">
                        <i class="fas fa-crown"></i>
                        <span>会员专区登录</span>
                    </div>
                    
                    <div class="auth-input-container">
                        <div class="auth-input-group">
                            <div class="input-icon">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <input type="text" id="auth-username" placeholder="用户名" required>
                            <div class="input-highlight"></div>
                        </div>
                        
                        <div class="auth-input-group">
                            <div class="input-icon">
                                <i class="fas fa-key"></i>
                            </div>
                            <input type="password" id="auth-password" placeholder="密码" required>
                            <div class="input-highlight"></div>
                        </div>
                    </div>
                    
                    <!-- 错误提示 -->
                    <div id="auth-error-message" class="auth-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span class="error-text"></span>
                    </div>
                    
                    <!-- 登录按钮 -->
                    <button type="submit" class="auth-submit-btn">
                        <div class="btn-bg"></div>
                        <div class="btn-content">
                            <i class="fas fa-sign-in-alt"></i>
                            <span>立即登录</span>
                        </div>
                        <div class="btn-ripple"></div>
                    </button>
                </form>
                
                <!-- 底部信息 -->
                <div class="auth-footer">
                    <div class="footer-info">
                        <i class="fas fa-shield-alt"></i>
                        <span>安全登录 · 专业服务</span>
                    </div>
                    <div class="footer-contact">
                        需要帮助？<a href="#" class="contact-link">联系客服</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // --- 添加事件监听器 ---
    const modal = document.getElementById(AUTH_MODAL_ID);
    const form = document.getElementById('auth-login-form');
    
    // 关闭按钮
    modal.querySelector('.auth-close-btn').addEventListener('click', hideLoginModal);

    // 点击遮罩层关闭
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideLoginModal();
        }
    });

    // 表单提交
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = form.querySelector('#auth-username').value.trim();
        const password = form.querySelector('#auth-password').value.trim();
        login(username, password);
    });

    // 输入框焦点效果
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

/**
 * 创建并注入认证系统所需的CSS样式 - 高端重设计版本
 */
function injectAuthStyles() {
    if (document.getElementById(AUTH_STYLES_ID)) return; // 防止重复创建

    const styles = `
        /* --- 高端认证弹窗样式 --- */
        .auth-modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, 
                rgba(0, 0, 0, 0.9) 0%, 
                rgba(20, 20, 20, 0.95) 50%, 
                rgba(0, 0, 0, 0.9) 100%);
            backdrop-filter: blur(20px);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* 背景粒子效果 */
        .auth-particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
        }

        .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--tk-gold);
            border-radius: 50%;
            opacity: 0.3;
            animation: particleFloat 8s infinite linear;
        }

        .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
        .particle:nth-child(2) { left: 25%; animation-delay: 1s; }
        .particle:nth-child(3) { left: 40%; animation-delay: 2s; }
        .particle:nth-child(4) { left: 60%; animation-delay: 3s; }
        .particle:nth-child(5) { left: 75%; animation-delay: 4s; }
        .particle:nth-child(6) { left: 90%; animation-delay: 5s; }

        @keyframes particleFloat {
            0% { transform: translateY(100vh) scale(0); opacity: 0; }
            10% { opacity: 0.3; }
            90% { opacity: 0.3; }
            100% { transform: translateY(-100px) scale(1); opacity: 0; }
        }

        /* 主要弹窗容器 */
        .auth-modal-content {
            position: relative;
            background: linear-gradient(145deg, 
                rgba(26, 26, 26, 0.95) 0%, 
                rgba(44, 44, 44, 0.90) 50%, 
                rgba(26, 26, 26, 0.95) 100%);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 20px;
            width: 90%;
            max-width: 480px;
            padding: 0;
            backdrop-filter: blur(30px);
            box-shadow: 
                0 25px 60px rgba(0, 0, 0, 0.5),
                0 0 100px rgba(212, 175, 55, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: modalEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modalEnter {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        /* 装饰框架 */
        .auth-frame-decoration {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            border-radius: 20px;
        }

        .frame-corner {
            position: absolute;
            width: 20px;
            height: 20px;
            border: 2px solid transparent;
            background: linear-gradient(45deg, var(--tk-gold), transparent);
            background-clip: padding-box;
        }

        .frame-tl { top: 15px; left: 15px; border-right: none; border-bottom: none; }
        .frame-tr { top: 15px; right: 15px; border-left: none; border-bottom: none; }
        .frame-bl { bottom: 15px; left: 15px; border-right: none; border-top: none; }
        .frame-br { bottom: 15px; right: 15px; border-left: none; border-top: none; }

        /* 关闭按钮 */
        .auth-close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 50%;
            color: #888;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }

        .auth-close-btn:hover {
            background: rgba(212, 175, 55, 0.1);
            border-color: var(--tk-gold);
            color: var(--tk-gold);
            transform: rotate(90deg);
        }

        /* 品牌标识区域 */
        .auth-brand-section {
            text-align: center;
            padding: 50px 40px 30px;
            position: relative;
        }

        .auth-brand-logo {
            position: relative;
            display: inline-block;
            margin-bottom: 20px;
        }

        .logo-glow {
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }

        .brand-text {
            position: relative;
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #D4AF37, #FFD700, #F5E6A8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            z-index: 2;
        }

        .auth-title {
            font-size: 1.8rem;
            font-weight: 600;
            color: #e0e0e0;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }

        .auth-subtitle {
            font-size: 0.9rem;
            color: #888;
            margin-bottom: 25px;
            font-style: italic;
        }

        .auth-divider {
            width: 60px;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--tk-gold), transparent);
            margin: 0 auto;
        }

        /* 表单区域 */
        .auth-form {
            padding: 0 40px 40px;
        }

        .form-section-title {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 30px;
            color: var(--tk-gold);
            font-size: 1.1rem;
            font-weight: 500;
        }

        .form-section-title i {
            margin-right: 8px;
            font-size: 1.2rem;
        }

        .auth-input-container {
            margin-bottom: 25px;
        }

                 .auth-input-group {
             position: relative;
             margin-bottom: 20px;
             background: rgba(0, 0, 0, 0.4);
             border: 1px solid rgba(255, 255, 255, 0.1);
             border-radius: 12px;
             transition: all 0.3s ease;
             overflow: hidden;
         }

                 .auth-input-group.focused {
             border-color: var(--tk-gold);
             background: rgba(0, 0, 0, 0.5);
             box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
         }

        .input-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #888;
            font-size: 1.1rem;
            transition: color 0.3s ease;
            z-index: 2;
        }

        .auth-input-group.focused .input-icon {
            color: var(--tk-gold);
        }

                 .auth-input-group input {
             width: 100%;
             padding: 16px 20px 16px 50px;
             background: transparent;
             border: none;
             outline: none;
             color: #fff;
             font-size: 1rem;
             font-weight: 400;
         }

         .auth-input-group input:-webkit-autofill,
         .auth-input-group input:-webkit-autofill:hover,
         .auth-input-group input:-webkit-autofill:focus,
         .auth-input-group input:-webkit-autofill:active {
             -webkit-box-shadow: 0 0 0 30px rgba(0, 0, 0, 0.4) inset !important;
             -webkit-text-fill-color: #fff !important;
             transition: background-color 5000s ease-in-out 0s;
         }

         /* Firefox 自动填充样式 */
         .auth-input-group input:-moz-autofill {
             background-color: rgba(0, 0, 0, 0.4) !important;
             color: #fff !important;
         }

         /* 强制覆盖所有自动填充样式 */
         .auth-input-group input[data-autocompleted] {
             background-color: rgba(0, 0, 0, 0.4) !important;
             color: #fff !important;
         }

        .auth-input-group input::placeholder {
            color: #666;
            transition: color 0.3s ease;
        }

        .auth-input-group.focused input::placeholder {
            color: #888;
        }

        .input-highlight {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            width: 0;
            background: linear-gradient(90deg, var(--tk-gold), var(--tk-gold-light));
            transition: width 0.3s ease;
        }

        .auth-input-group.focused .input-highlight {
            width: 100%;
        }

        /* 错误提示 */
        .auth-error {
            display: none;
            align-items: center;
            background: rgba(255, 107, 107, 0.1);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 8px;
            padding: 12px 15px;
            margin-bottom: 20px;
            color: #ff6b6b;
            font-size: 0.9rem;
        }

        .auth-error i {
            margin-right: 8px;
            font-size: 1rem;
        }

        .auth-error.shake {
            animation: shake 0.6s ease-in-out;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        /* 登录按钮 */
        .auth-submit-btn {
            position: relative;
            width: 100%;
            height: 50px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            overflow: hidden;
            transition: all 0.3s ease;
            margin-bottom: 25px;
        }

        .btn-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, var(--tk-gold), var(--tk-gold-dark));
            transition: all 0.3s ease;
        }

        .btn-content {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #000;
            font-size: 1.1rem;
            font-weight: 600;
            z-index: 2;
        }

        .btn-content i {
            margin-right: 8px;
            font-size: 1rem;
        }

        .btn-ripple {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.3s ease;
        }

        .auth-submit-btn:hover .btn-bg {
            background: linear-gradient(135deg, var(--tk-gold-light), var(--tk-gold));
        }

        .auth-submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
        }

        .auth-submit-btn:active .btn-ripple {
            width: 300px;
            height: 300px;
        }

        /* 底部信息 */
        .auth-footer {
            padding: 0 40px 30px;
            text-align: center;
        }

        .footer-info {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
            color: #888;
            font-size: 0.9rem;
        }

        .footer-info i {
            margin-right: 8px;
            color: var(--tk-gold);
        }

        .footer-contact {
            font-size: 0.85rem;
            color: #666;
        }

        .contact-link {
            color: var(--tk-gold);
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .contact-link:hover {
            color: var(--tk-gold-light);
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .auth-modal-content {
                max-width: 95%;
                margin: 20px;
            }
            
            .auth-brand-section,
            .auth-form,
            .auth-footer {
                padding-left: 25px;
                padding-right: 25px;
            }
            
            .brand-text {
                font-size: 2.5rem;
            }
            
            .auth-title {
                font-size: 1.5rem;
            }
        }

        /* -- 导航栏会员区域样式 -- */
        .member-area {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .member-status {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 16px;
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 25px;
            transition: all 0.3s ease;
        }

                 .member-status:hover {
             background: rgba(212, 175, 55, 0.2);
             box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
         }

         .member-status-simple {
             display: flex;
             align-items: center;
             padding: 8px 16px;
             background: rgba(212, 175, 55, 0.1);
             border: 1px solid rgba(212, 175, 55, 0.3);
             border-radius: 20px;
             transition: all 0.3s ease;
         }

         .member-status-simple:hover {
             background: rgba(212, 175, 55, 0.15);
             border-color: rgba(212, 175, 55, 0.5);
             box-shadow: 0 3px 12px rgba(212, 175, 55, 0.2);
         }

         .member-level-text {
             font-size: 0.9rem;
             font-weight: 500;
             color: var(--tk-gold);
             letter-spacing: 0.5px;
             text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
         }

        .member-avatar {
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, var(--tk-gold), var(--tk-gold-light));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            color: #000;
        }

        .member-info {
            display: flex;
            flex-direction: column;
        }

        .member-name {
            font-size: 0.85rem;
            font-weight: 500;
            color: var(--tk-gold);
        }

        .member-level {
            font-size: 0.7rem;
            color: #888;
        }

        .auth-btn {
            padding: 8px 20px;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 20px;
            color: var(--tk-gold);
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
        }

        .auth-btn:hover {
            background: rgba(212, 175, 55, 0.1);
            border-color: var(--tk-gold);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
        }

        /* 移动端会员区域样式 */
        .mobile-member-area {
            display: flex;
            align-items: center;
        }

        .mobile-auth-btn {
            width: 36px;
            height: 36px;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 50%;
            color: var(--tk-gold);
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .mobile-auth-btn:hover {
            background: rgba(212, 175, 55, 0.1);
            border-color: var(--tk-gold);
            transform: scale(1.1);
            box-shadow: 0 3px 10px rgba(212, 175, 55, 0.3);
        }

        .mobile-member-status {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 20px;
            transition: all 0.3s ease;
        }

        .mobile-member-status:hover {
            background: rgba(212, 175, 55, 0.2);
            box-shadow: 0 3px 10px rgba(212, 175, 55, 0.2);
        }

        .mobile-member-avatar-small {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, var(--tk-gold), var(--tk-gold-light));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: #000;
        }

        /* 移动端菜单样式优化 */
        .mobile-menu {
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-menu.open {
            left: 0;
            opacity: 1;
            transform: translateY(0);
        }

        .mobile-menu-content {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .mobile-menu-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 10px 15px;
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .mobile-menu-item:hover {
            background: rgba(212, 175, 55, 0.1);
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
        }

        .mobile-menu-item i {
            font-size: 1.2rem;
            color: #fff;
        }

        .mobile-menu-item.active {
            background: rgba(212, 175, 55, 0.2);
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
        }

        .mobile-menu-item.active i {
            color: var(--tk-gold);
        }

        .mobile-menu-item.active .mobile-member-card {
            display: block;
        }

        .mobile-member-card {
            background: rgba(26, 26, 26, 0.8);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 12px;
            padding: 20px;
            margin-top: 8px;
        }

        .mobile-login-card {
            background: rgba(26, 26, 26, 0.8);
            border: 1px solid rgba(111, 111, 111, 0.3);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }

        .member-status-indicator {
            display: flex;
            align-items: center;
        }

        .member-status-indicator i {
            font-size: 8px;
            animation: pulse 2s infinite;
        }

        @media (max-width: 768px) {
            .mobile-member-area {
                margin-right: 8px;
            }
            
            .auth-btn {
                padding: 6px 16px;
                font-size: 0.85rem;
            }
        }

        /* 移动端菜单样式 */
    `;

    const styleSheet = document.createElement("style");
    styleSheet.id = AUTH_STYLES_ID;
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

/**
 * 更新UI，主要是导航栏的会员区域（桌面端和移动端）
 */
function updateAuthUI() {
    const memberArea = document.getElementById('member-area');
    const mobileMemberArea = document.getElementById('mobile-member-area');
    const mobileMemberInfo = document.getElementById('mobile-member-info');

    if (isAuthenticated()) {
        // 桌面端会员状态
        if (memberArea) {
            memberArea.innerHTML = `
                <div class="member-status">
                    <div class="member-avatar">
                        <i class="fas fa-crown"></i>
                    </div>
                    <div class="member-info">
                        <div class="member-level">VIP · Premium</div>
                    </div>
                </div>
                <button class="auth-btn" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    退出登录
                </button>
            `;
            
            // 添加退出登录事件
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', logout);
            }
        }

                 // 移动端会员状态（导航栏简化版）
         if (mobileMemberArea) {
             mobileMemberArea.innerHTML = `
                 <div class="mobile-member-status">
                     <div class="mobile-member-avatar-small">
                         <i class="fas fa-crown"></i>
                     </div>
                 </div>
             `;
         }

        // 移动端菜单内的会员信息
        if (mobileMemberInfo) {
            mobileMemberInfo.innerHTML = `
                <div class="mobile-member-card">
                    <div class="flex items-center space-x-3 mb-4 p-4 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 rounded-lg border border-yellow-400/20">
                        <div class="member-avatar">
                            <i class="fas fa-crown"></i>
                        </div>
                                                 <div class="flex-1">
                             <div class="member-level">VIP · Premium</div>
                         </div>
                        <div class="member-status-indicator">
                            <i class="fas fa-circle text-green-400 text-xs"></i>
                        </div>
                    </div>
                    <button class="w-full auth-btn" id="mobile-logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        退出登录
                    </button>
                </div>
            `;
            
            // 添加移动端退出登录事件
            const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
            if (mobileLogoutBtn) {
                mobileLogoutBtn.addEventListener('click', logout);
            }
        }
    } else {
        // 桌面端登录按钮
        if (memberArea) {
            memberArea.innerHTML = `
                <button class="auth-btn" id="login-btn">
                    <i class="fas fa-user-circle"></i>
                    会员登录
                </button>
            `;
            
            // 添加登录事件
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) {
                loginBtn.addEventListener('click', showLoginModal);
            }
        }

        // 移动端登录按钮（导航栏简化版）
        if (mobileMemberArea) {
            mobileMemberArea.innerHTML = `
                <button class="mobile-auth-btn" id="mobile-login-btn">
                    <i class="fas fa-user-circle"></i>
                </button>
            `;
            
            // 添加移动端登录事件
            const mobileLoginBtn = document.getElementById('mobile-login-btn');
            if (mobileLoginBtn) {
                mobileLoginBtn.addEventListener('click', showLoginModal);
            }
        }

        // 移动端菜单内的登录区域
        if (mobileMemberInfo) {
            mobileMemberInfo.innerHTML = `
                <div class="mobile-login-card">
                    <div class="text-center p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-gray-600/30">
                        <i class="fas fa-user-circle text-3xl text-gray-400 mb-3"></i>
                        <p class="text-gray-300 text-sm mb-4">登录享受专属研究报告</p>
                        <button class="w-full auth-btn" id="mobile-main-login-btn">
                            <i class="fas fa-sign-in-alt"></i>
                            会员登录
                        </button>
                    </div>
                </div>
            `;
            
            // 添加移动端主登录事件
            const mobileMainLoginBtn = document.getElementById('mobile-main-login-btn');
            if (mobileMainLoginBtn) {
                mobileMainLoginBtn.addEventListener('click', showLoginModal);
            }
        }
    }
}

/**
 * 初始化移动端菜单功能
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times text-xl"></i>';
                // 添加打开动画
                setTimeout(() => {
                    mobileMenu.style.opacity = '1';
                    mobileMenu.style.transform = 'translateY(0)';
                }, 10);
            } else {
                mobileMenu.style.opacity = '0';
                mobileMenu.style.transform = 'translateY(-10px)';
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 200);
            }
        });

        // 点击菜单外部关闭菜单
        document.addEventListener('click', (event) => {
            if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.style.opacity = '0';
                    mobileMenu.style.transform = 'translateY(-10px)';
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                    setTimeout(() => {
                        mobileMenu.classList.add('hidden');
                    }, 200);
                }
            }
        });
    }
}

/**
 * 初始化认证系统
 */
function initAuthSystem() {
    // 确保DOM加载完毕
    document.addEventListener('DOMContentLoaded', () => {
        injectAuthStyles();
        createLoginModal();
        initMobileMenu();
        
        // --- 在导航栏创建会员区域 ---
        const navMenu = document.querySelector('.tk-nav .hidden.md\\:flex');
        if (navMenu) {
            const memberAreaHTML = `<div class="member-area" id="member-area"></div>`;
            navMenu.insertAdjacentHTML('beforeend', memberAreaHTML);
        }
        
        updateAuthUI();
    });
}

// --- 系统初始化 ---
initAuthSystem(); 