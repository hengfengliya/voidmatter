/**
 * 虚空有物质点智库 - 更新日志页面奢华交互系统
 * 为顶级富豪打造的流畅奢华交互体验
 * Version: 2025.09.02
 */

class LuxuryUpdatesInterface {
    constructor() {
        this.manager = null;
        this.animationSettings = {
            staggerDelay: 100,
            fadeInDuration: 800,
            slideInDuration: 600
        };
        this.particleSystem = null;
        this.isLoading = false;
        
        this.init();
    }

    /**
     * 初始化奢华界面
     */
    async init() {
        try {
            // 初始化粒子系统
            this.initLuxuryParticles();
            
            // 等待数据管理器准备就绪
            await this.waitForManager();
            
            // 初始化界面组件
            this.initializeComponents();
            
            // 渲染初始数据
            this.renderInitialData();
            
            console.log('✨ 奢华界面系统初始化完成');
            
        } catch (error) {
            console.error('💥 奢华界面初始化失败:', error);
        }
    }

    /**
     * 等待数据管理器准备就绪
     */
    waitForManager() {
        return new Promise((resolve) => {
            if (window.luxuryUpdatesManager && window.luxuryUpdatesManager.isInitialized()) {
                this.manager = window.luxuryUpdatesManager;
                resolve();
            } else {
                window.addEventListener('updatesManagerReady', (event) => {
                    this.manager = event.detail.manager;
                    resolve();
                });
                
                // 添加超时保护
                setTimeout(() => {
                    if (!this.manager) {
                        resolve(); // 即使超时也继续，避免页面卡住
                    }
                }, 5000); // 5秒超时
            }
        });
    }

    /**
     * 初始化奢华粒子系统
     */
    initLuxuryParticles() {
        const canvas = document.getElementById('particlesCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = [];
        
        // 设置canvas尺寸
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // 粒子类
        class LuxuryParticle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -20;
                this.size = Math.random() * 3 + 1;
                this.speed = Math.random() * 1 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = `hsla(${45 + Math.random() * 15}, 100%, ${60 + Math.random() * 20}%, ${this.opacity})`;
            }

            update() {
                this.y += this.speed;
                this.x += Math.sin(this.y * 0.01) * 0.5;
                
                if (this.y > canvas.height + 20) {
                    this.reset();
                }
                
                // 呼吸效果
                this.opacity += Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.02;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                
                // 金色光点
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = gradient;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                // 光晕效果
                ctx.shadowColor = this.color;
                ctx.shadowBlur = this.size * 2;
                ctx.fill();
                
                ctx.restore();
            }
        }

        // 创建粒子
        for (let i = 0; i < 50; i++) {
            particles.push(new LuxuryParticle());
        }

        // 动画循环
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animate);
        };

        animate();
        this.particleSystem = { canvas, particles };
    }

    /**
     * 初始化界面组件
     */
    initializeComponents() {
        this.initNavigation();
        this.initScrollEffects();
    }

    /**
     * 初始化导航
     */
    initNavigation() {
        // 导航链接悬停效果（简化版）
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-1px)';
            });
            
            link.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * 初始化滚动效果
     */
    initScrollEffects() {
        // 导航栏滚动效果
        let lastScrollY = window.scrollY;
        const nav = document.querySelector('.vm-nav');
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (nav) {
                if (currentScrollY > 100) {
                    nav.style.background = 'rgba(15, 15, 15, 0.95)';
                    nav.style.backdropFilter = 'blur(15px)';
                } else {
                    nav.style.background = 'rgba(15, 15, 15, 0.8)';
                    nav.style.backdropFilter = 'blur(10px)';
                }
                
                // 滚动隐藏/显示导航
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    nav.style.transform = 'translateY(-100%)';
                } else {
                    nav.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }

    /**
     * 渲染初始数据
     */
    async renderInitialData() {
        this.showLoading();
        
        try {
            if (!this.manager) {
                console.error('❌ 数据管理器未就绪，无法渲染数据');
                this.showError('数据管理器初始化失败，请刷新页面重试');
                return;
            }
            
            // 更新统计信息
            await this.updateStatistics();
            
            // 渲染时间线
            await this.renderTimeline();
            
        } catch (error) {
            console.error('渲染初始数据失败:', error);
            this.showError('数据加载失败，请刷新页面重试');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * 更新统计信息
     */
    async updateStatistics() {
        if (!this.manager) return;
        
        try {
            const stats = this.manager.getStatistics();
            console.log('统计数据:', stats); // 调试信息
            
            this.animateNumber('total-reports', stats.totalReports);
            this.animateNumber('latest-month', stats.currentMonthReports);
            this.animateNumber('total-industries', stats.totalIndustries);
        } catch (error) {
            console.error('更新统计信息失败:', error);
        }
    }

    /**
     * 数字动画
     */
    animateNumber(elementId, targetNumber) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startNumber = 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 缓动函数
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * easeOutCubic);
            
            element.textContent = currentNumber;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = targetNumber;
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * 渲染时间线
     */
    async renderTimeline() {
        const container = document.getElementById('luxury-timeline');
        const navContainer = document.getElementById('luxury-nav-list');
        if (!container) return;

        if (!this.manager) {
            this.showError('数据管理器未初始化');
            return;
        }

        try {
            const updatesData = this.manager.getAllUpdates();
            const sortedMonths = this.manager.getSortedMonths();

            if (!sortedMonths || sortedMonths.length === 0) {
                container.innerHTML = '<div class="luxury-empty-state"><p>暂无更新数据</p></div>';
                return;
            }

            // 预处理所有月份的日期，确保倒序排列
            const processedUpdatesData = {};
            sortedMonths.forEach(monthKey => {
                const monthData = updatesData[monthKey];
                
                // 重新排序日期，确保倒序（最新日期在前）
                const dateEntries = Object.entries(monthData.dates);
                
                // 按日期字符串倒序排列（更可靠的方法）
                dateEntries.sort(([dateA], [dateB]) => {
                    return dateB.localeCompare(dateA); // 字符串倒序比较，确保 2025-08-26 > 2025-08-01
                });
                
                const sortedDates = dateEntries.map(([key, data]) => data);
                
                // 创建处理后的月份数据
                processedUpdatesData[monthKey] = {
                    ...monthData,
                    sortedDates: sortedDates // 保存排序后的日期数组
                };
            });

            // 生成左侧导航 - 使用处理后的数据
            this.generateNavigation(processedUpdatesData, sortedMonths);
            
            // 生成时间线内容 - 使用处理后的数据
            let timelineHTML = '';
            sortedMonths.forEach((monthKey, monthIndex) => {
                const monthData = processedUpdatesData[monthKey];
                timelineHTML += this.generateMonthSection(monthData, monthData.sortedDates, monthIndex);
            });

            container.innerHTML = timelineHTML;
            this.addTimelineInteractions();
            this.addNavigationInteractions();
            this.animateTimelineEntrance();
            
        } catch (error) {
            console.error('渲染时间线失败:', error);
            this.showError('时间线数据渲染失败');
        }
    }

    /**
     * 生成左侧导航
     */
    generateNavigation(processedUpdatesData, sortedMonths) {
        const navContainer = document.getElementById('luxury-nav-list');
        if (!navContainer) return;

        let navHTML = '';
        
        sortedMonths.forEach(monthKey => {
            const monthData = processedUpdatesData[monthKey];
            const sortedDates = monthData.sortedDates; // 使用预处理的排序后日期
            
            // 月份标题（可点击跳转到月份）
            navHTML += `
                <div class="luxury-nav-item luxury-nav-month" data-target="month-${monthKey}">
                    ${monthData.displayName}
                </div>
            `;
            
            // 该月份下的所有日期（已经按时间倒序排列）
            sortedDates.forEach(dateData => {
                navHTML += `
                    <div class="luxury-nav-item luxury-nav-date" data-target="date-${dateData.date}">
                        ${dateData.displayDate.short} (${dateData.reports.length}个报告)
                    </div>
                `;
            });
        });

        navContainer.innerHTML = navHTML;
    }

    /**
     * 添加导航交互功能
     */
    addNavigationInteractions() {
        const navItems = document.querySelectorAll('.luxury-nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.target.dataset.target;
                if (target) {
                    // 移除所有活动状态
                    navItems.forEach(nav => nav.classList.remove('active'));
                    // 添加当前活动状态
                    e.target.classList.add('active');
                    
                    // 滚动到对应的时间线位置
                    const targetElement = document.querySelector(`[data-id="${target}"]`);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // 监听滚动，自动高亮当前可见的导航项
        this.setupScrollSpy();
    }

    /**
     * 设置滚动监听，自动高亮当前可见区域
     */
    setupScrollSpy() {
        const navItems = document.querySelectorAll('.luxury-nav-item');
        const timelineItems = document.querySelectorAll('[data-id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.dataset.id;
                    
                    // 移除所有活动状态
                    navItems.forEach(nav => nav.classList.remove('active'));
                    
                    // 高亮对应的导航项
                    const activeNav = document.querySelector(`[data-target="${id}"]`);
                    if (activeNav) {
                        activeNav.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -60% 0px'
        });

        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }
    /**
     * 生成月份区域HTML
     */
    generateMonthSection(monthData, dates, monthIndex) {
        let monthHTML = `
            <div class="luxury-timeline-month" data-id="month-${monthData.yearMonth}" data-month="${monthData.yearMonth}" style="animation-delay: ${monthIndex * 200}ms;">
                <div class="luxury-month-header">
                    <div class="luxury-month-indicator">
                        <div class="luxury-month-dot"></div>
                        <div class="luxury-month-line"></div>
                    </div>
                    <div class="luxury-month-info">
                        <h2 class="luxury-month-title">${monthData.displayName}</h2>
                        <div class="luxury-month-stats">
                            <span class="luxury-month-count">${this.getTotalReportsInMonth(dates)} 个研究报告</span>
                            <span class="luxury-month-divider">•</span>
                            <span class="luxury-month-range">${this.getDateRange(dates)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="luxury-timeline-content">
        `;

        // 生成每日报告
        dates.forEach((dateData, dateIndex) => {
            monthHTML += this.generateDateSection(dateData, dateIndex);
        });

        monthHTML += `
                </div>
            </div>
        `;

        return monthHTML;
    }

    /**
     * 生成日期区域HTML - 文字版
     */
    generateDateSection(dateData, dateIndex) {
        let dateHTML = `
            <div class="luxury-text-date" data-id="date-${dateData.date}" data-date="${dateData.date}" style="animation-delay: ${dateIndex * 100}ms;">
                <div class="luxury-text-date-header">
                    <div class="luxury-text-date-dot"></div>
                    <h3 class="luxury-text-date-title">${dateData.displayDate.full}</h3>
                    <span class="luxury-text-date-count">${dateData.reports.length}个报告</span>
                </div>
                <div class="luxury-text-reports">
        `;

        // 生成报告列表
        dateData.reports.forEach((report, reportIndex) => {
            dateHTML += `
                <div class="luxury-text-report" style="animation-delay: ${reportIndex * 50}ms;" onclick="luxuryUpdatesInterface.openReport('${report.filePath}')">
                    <div class="luxury-text-report-category">${report.categoryShort}</div>
                    <div class="luxury-text-report-title">${report.title}</div>
                    <div class="luxury-text-report-summary">${report.summary}</div>
                </div>
            `;
        });

        dateHTML += `
                </div>
            </div>
        `;

        return dateHTML;
    }

    /**
     * 生成报告卡片HTML
     */
    generateReportCard(report, index) {
        const tagsHTML = report.tags.map(tag => 
            `<span class="luxury-report-tag">${tag}</span>`
        ).join('');

        return `
            <div class="luxury-report-card" 
                 data-report-id="${report.id}"
                 data-category="${report.categoryShort}"
                 style="animation-delay: ${index * 150}ms;"
                 onclick="luxuryUpdatesInterface.openReport('${report.filePath}')">
                
                <div class="luxury-card-glow"></div>
                
                <div class="luxury-card-header">
                    <div class="luxury-card-category">
                        <i class="fas fa-crown luxury-category-icon"></i>
                        <span class="luxury-category-text">${report.categoryShort}</span>
                    </div>
                    <div class="luxury-card-stats">
                        <div class="luxury-stat">
                            <i class="fas fa-star"></i>
                            <span>${report.rating}</span>
                        </div>
                    </div>
                </div>
                
                <div class="luxury-card-content">
                    <h4 class="luxury-report-title">${report.title}</h4>
                    <p class="luxury-report-summary">${report.summary}</p>
                    
                    ${tagsHTML ? `<div class="luxury-report-tags">${tagsHTML}</div>` : ''}
                </div>
                
                <div class="luxury-card-footer">
                    <div class="luxury-card-metrics">
                        <span class="luxury-metric">
                            <i class="fas fa-eye"></i>
                            ${this.manager.formatNumber(report.viewCount)}
                        </span>
                        <span class="luxury-metric">
                            <i class="fas fa-download"></i>
                            ${this.manager.formatNumber(report.downloadCount)}
                        </span>
                    </div>
                    <div class="luxury-card-action">
                        <span class="luxury-action-text">查看详情</span>
                        <i class="fas fa-arrow-right luxury-action-icon"></i>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 添加时间线交互
     */
    addTimelineInteractions() {
        // 文字报告悬停效果
        document.querySelectorAll('.luxury-text-report').forEach(report => {
            report.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-2px)';
            });
            
            report.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0)';
            });
        });

        // 月份区域交互
        document.querySelectorAll('.luxury-timeline-month').forEach(month => {
            month.addEventListener('mouseenter', (e) => {
                e.currentTarget.classList.add('hover');
            });
            
            month.addEventListener('mouseleave', (e) => {
                e.currentTarget.classList.remove('hover');
            });
        });
    }

    /**
     * 时间线入场动画
     */
    animateTimelineEntrance() {
        // 使用Intersection Observer实现滚动触发动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('luxury-fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px'
        });

        // 观察所有时间线元素
        document.querySelectorAll('.luxury-timeline-month, .luxury-text-date, .luxury-text-report').forEach(el => {
            observer.observe(el);
        });
    }








    /**
     * 打开报告
     */
    openReport(filePath) {
        if (typeof window.requestAccess === 'function') {
            window.requestAccess(filePath);
        } else {
            // 备用方案：直接打开
            window.open(filePath, '_blank');
        }
    }

    /**
     * 显示错误状态
     */
    showError(message) {
        const container = document.getElementById('luxury-timeline');
        if (container) {
            container.innerHTML = `
                <div class="luxury-empty-state">
                    <div class="luxury-empty-icon">
                        <i class="fas fa-exclamation-triangle" style="color: #ff6b6b;"></i>
                    </div>
                    <h3 class="luxury-empty-title" style="color: #ff6b6b;">加载出错</h3>
                    <p class="luxury-empty-desc">${message}</p>
                    <button class="luxury-empty-action" onclick="location.reload()">
                        <i class="fas fa-refresh"></i>
                        刷新页面
                    </button>
                </div>
            `;
        }
    }

    /**
     * 显示加载状态
     */
    showLoading() {
        const loading = document.getElementById('luxury-loading');
        if (loading) {
            loading.style.display = 'block';
            loading.classList.add('luxury-fade-in');
        }
        this.isLoading = true;
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        const loading = document.getElementById('luxury-loading');
        if (loading) {
            loading.style.display = 'none';
            loading.classList.remove('luxury-fade-in');
        }
        this.isLoading = false;
    }

    /**
     * 添加奢华光晕效果
     */
    addLuxuryGlow(element) {
        element.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.3)';
        element.style.transition = 'all 0.3s ease';
    }

    /**
     * 移除奢华光晕效果
     */
    removeLuxuryGlow(element) {
        element.style.boxShadow = '';
    }

    /**
     * 通用元素动画
     */
    animateElement(element, animationType) {
        element.classList.add(`luxury-${animationType}`);
        
        setTimeout(() => {
            element.classList.remove(`luxury-${animationType}`);
        }, 800);
    }

    /**
     * 获取月份中的总报告数
     */
    getTotalReportsInMonth(dates) {
        return dates.reduce((total, dateData) => total + dateData.reports.length, 0);
    }

    /**
     * 获取日期范围
     */
    getDateRange(dates) {
        if (dates.length === 0) return '';
        
        // dates数组已经是倒序排列的，第一个是最新的，最后一个是最早的
        const latestDate = dates[0].displayDate.short;
        const earliestDate = dates[dates.length - 1].displayDate.short;
        
        return latestDate === earliestDate ? latestDate : `${earliestDate} - ${latestDate}`;
    }
}

// 全局实例
let luxuryUpdatesInterface;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    luxuryUpdatesInterface = new LuxuryUpdatesInterface();
    
    // 确保全局可访问
    if (typeof window !== 'undefined') {
        window.luxuryUpdatesInterface = luxuryUpdatesInterface;
    }
});

// 导出到全局作用域
if (typeof window !== 'undefined') {
    window.LuxuryUpdatesInterface = LuxuryUpdatesInterface;
}