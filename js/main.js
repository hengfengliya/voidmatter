// VM · 虚空有物 - 主JavaScript文件
// 实现页面动画、图表和交互效果

document.addEventListener('DOMContentLoaded', function() {
    // 初始化动画
    initHeroAnimations();
    
    // 初始化滚动效果
    initScrollEffects();
    
    // 初始化导航
    initNavigation();
    
    // 初始化按钮事件
    initButtonEvents();
});

// 英雄区域动画
function initHeroAnimations() {
    // 页面加载完成后依次显示元素
    const timeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    });
    
    timeline
        .add({
            targets: '#hero-title',
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 1200,
            delay: 300
        })
        .add({
            targets: '#hero-subtitle',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            delay: 200
        }, '-=800')
        .add({
            targets: '#hero-stats',
            opacity: [0, 1],
            translateY: [30, 0],
            scale: [0.9, 1],
            duration: 800,
            delay: 150
        }, '-=400')
        .add({
            targets: '#hero-buttons',
            opacity: [0, 1],
            translateY: [20, 0],
            scale: [0.95, 1],
            duration: 600
        }, '-=300')
        .add({
            targets: '#scroll-hint',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 400
        }, '-=200');
}



// 滚动效果
function initScrollEffects() {
    // 视差滚动效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.vm-parallax');
        
        parallaxElements.forEach(element => {
            const speed = 0.1;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // 滚动时触发元素动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateOnScroll(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察所有卡片和内容区域
    document.querySelectorAll('.vm-card, .luxury-card, .vm-section h2, .vm-section p').forEach(el => {
        observer.observe(el);
    });
}

// 滚动触发的动画
function animateOnScroll(element) {
    if (element.classList.contains('vm-card') || element.classList.contains('luxury-card')) {
        anime({
            targets: element,
            opacity: [0, 1],
            translateY: [50, 0],
            scale: [0.95, 1],
            duration: 800,
            easing: 'easeOutCubic',
            delay: Math.random() * 200
        });
    } else {
        anime({
            targets: element,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 1000,
            easing: 'easeOutExpo'
        });
    }
}

// 导航功能
function initNavigation() {
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 导航栏背景透明度
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.vm-nav');
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(15, 15, 15, 0.95)';
        } else {
            nav.style.background = 'rgba(15, 15, 15, 0.8)';
        }
    });
}

// 按钮事件
function initButtonEvents() {
    // 英雄区域按钮
    document.getElementById('hero-button').addEventListener('click', function() {
        document.getElementById('about').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // 鼠标悬停效果
    document.querySelectorAll('.vm-button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // 卡片悬停效果
    document.querySelectorAll('.vm-card, .luxury-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                translateY: -5,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                translateY: 0,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
}

// 页面加载进度效果
function showLoadingProgress() {
    const loadingBar = document.createElement('div');
    loadingBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, #FFD700, #B8860B);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(loadingBar);
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loadingBar.style.opacity = '0';
                setTimeout(() => {
                    loadingBar.remove();
                }, 300);
            }, 200);
        }
        loadingBar.style.width = progress + '%';
    }, 100);
}

// 启动加载进度
showLoadingProgress();

// 添加一些交互细节
document.addEventListener('mousemove', function(e) {
    // 创建鼠标跟随的微光效果
    const cursor = document.querySelector('.cursor-glow') || createCursorGlow();
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

function createCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(255, 215, 0, 0.3), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(glow);
    return glow;
}

// 性能优化：防抖滚动事件
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 应用防抖到滚动事件
const debouncedScrollHandler = debounce(function() {
    // 滚动相关的性能敏感操作
}, 16); // 约60fps

window.addEventListener('scroll', debouncedScrollHandler); 