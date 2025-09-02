/**
 * 虚空有物质点智库 - 更新日志数据管理系统
 * 智能提取与管理更新数据，为顶级富豪提供专属体验
 * Version: 2025.09.02
 */

class LuxuryUpdatesManager {
    constructor() {
        this.reportsData = [];
        this.updatesData = {};
        this.filteredData = {};
        this.currentFilters = {
            industry: '',
            timeRange: 'all',
            searchTerm: ''
        };
        this.initialized = false;
        
        this.init();
    }

    /**
     * 初始化数据管理器
     */
    async init() {
        try {
            await this.loadReportsData();
            this.generateUpdatesData();
            this.initialized = true;
            console.log('🏆 奢华更新数据管理器初始化完成');
        } catch (error) {
            console.error('❌ 更新数据管理器初始化失败:', error);
        }
    }

    /**
     * 加载报告数据
     */
    async loadReportsData() {
        // 等待reports-manager.js加载完成
        if (typeof window.reportsDatabase === 'undefined') {
            await this.waitForReportsDatabase();
        }
        
        this.reportsData = [...window.reportsDatabase];
        console.log(`📊 已加载 ${this.reportsData.length} 个报告数据`);
    }

    /**
     * 等待报告数据库加载
     */
    waitForReportsDatabase() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 30; // 减少到3秒
            
            const checkDatabase = () => {
                attempts++;
                
                if (typeof window.reportsDatabase !== 'undefined') {
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('报告数据库加载超时'));
                } else {
                    setTimeout(checkDatabase, 100);
                }
            };
            checkDatabase();
        });
    }

    /**
     * 生成更新日志数据结构
     */
    generateUpdatesData() {
        this.updatesData = {};
        
        // 按日期分组报告
        this.reportsData.forEach((report) => {
            const publishDate = report.publishDate;
            const dateObj = new Date(publishDate);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const yearMonth = `${year}-${month}`;
            const fullDate = publishDate;

            // 初始化年月数据
            if (!this.updatesData[yearMonth]) {
                this.updatesData[yearMonth] = {
                    yearMonth: yearMonth,
                    displayName: this.formatMonthDisplay(year, month),
                    dates: {}
                };
            }

            // 初始化日期数据
            if (!this.updatesData[yearMonth].dates[fullDate]) {
                this.updatesData[yearMonth].dates[fullDate] = {
                    date: fullDate,
                    displayDate: this.formatDateDisplay(dateObj),
                    reports: []
                };
            }

            // 添加报告到对应日期
            this.updatesData[yearMonth].dates[fullDate].reports.push({
                id: report.id,
                title: report.title,
                category: this.formatCategoryPath(report.classification),
                categoryShort: report.classification.industry,
                summary: this.generateSummary(report.preview),
                filePath: report.filePath,
                tags: report.tags || [],
                viewCount: report.viewCount || 0,
                downloadCount: report.downloadCount || 0,
                rating: report.rating || 0,
                classification: report.classification
            });
        });

        // 排序数据
        this.sortUpdatesData();
    }

    /**
     * 排序更新数据
     */
    sortUpdatesData() {
        // 对每个月的日期进行排序（最新的在前）
        Object.values(this.updatesData).forEach(monthData => {
            const sortedDates = {};
            const dateKeys = Object.keys(monthData.dates).sort((a, b) => new Date(b) - new Date(a));
            dateKeys.forEach(dateKey => {
                sortedDates[dateKey] = monthData.dates[dateKey];
                // 对每天的报告按时间排序
                sortedDates[dateKey].reports.sort((a, b) => b.rating - a.rating);
            });
            monthData.dates = sortedDates;
        });
    }

    /**
     * 格式化月份显示
     */
    formatMonthDisplay(year, month) {
        const monthNames = [
            '一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ];
        return `${year}年${monthNames[parseInt(month) - 1]}`;
    }

    /**
     * 格式化日期显示
     */
    formatDateDisplay(dateObj) {
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const weekday = weekdays[dateObj.getDay()];
        
        return {
            short: `${month}月${day}日`,
            full: `${month}月${day}日 ${weekday}`,
            numeric: dateObj.toISOString().split('T')[0]
        };
    }

    /**
     * 格式化分类路径
     */
    formatCategoryPath(classification) {
        const parts = [
            classification.industry,
            classification.subIndustry,
            classification.thirdLevel,
            classification.fourthLevel
        ].filter(part => part && part !== '');
        
        return parts.join(' > ');
    }

    /**
     * 生成报告摘要
     */
    generateSummary(preview) {
        if (!preview) return '暂无预览';
        
        // 提取第一句话作为摘要
        const firstSentence = preview.split(/[。！？]/, 1)[0];
        if (firstSentence.length > 80) {
            return firstSentence.substring(0, 80) + '...';
        }
        return firstSentence + (preview.includes('。') ? '。' : '');
    }

    /**
     * 获取所有更新数据
     */
    getAllUpdates() {
        return this.updatesData;
    }

    /**
     * 获取排序后的年月列表
     */
    getSortedMonths() {
        return Object.keys(this.updatesData).sort((a, b) => b.localeCompare(a));
    }

    /**
     * 获取统计信息
     */
    getStatistics() {
        const totalReports = this.reportsData.length;
        
        // 统计最小级行业数量（使用第三级分类，因为第四级多为空）
        const minimalIndustries = new Set();
        this.reportsData.forEach(report => {
            const classification = report.classification;
            // 优先使用第四级分类，如果为空则使用第三级分类
            const minimalLevel = (classification.fourthLevel && classification.fourthLevel.trim()) 
                ? classification.fourthLevel 
                : classification.thirdLevel;
            
            if (minimalLevel && minimalLevel.trim()) {
                minimalIndustries.add(minimalLevel);
            }
        });
        
        // 获取最近有数据的月份的报告数量，而不是当前日期月份
        const latestMonthReports = this.getLatestMonthReports();

        return {
            totalReports,
            totalIndustries: minimalIndustries.size,
            currentMonthReports: latestMonthReports,
            latestUpdate: this.getLatestUpdate()
        };
    }

    /**
     * 获取最近有数据的月份的报告数量
     */
    getLatestMonthReports() {
        if (this.reportsData.length === 0) return 0;
        
        // 找到最新的报告日期
        const latestReport = this.reportsData
            .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))[0];
        
        const latestMonth = latestReport.publishDate.substr(0, 7); // 格式: 2025-08
        
        // 统计该月份的报告数量
        const latestMonthReports = this.reportsData.filter(r => 
            r.publishDate.startsWith(latestMonth)
        );
        
        return latestMonthReports.length;
    }

    /**
     * 获取最新更新
     */
    getLatestUpdate() {
        if (this.reportsData.length === 0) return null;
        
        const latestReport = this.reportsData
            .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))[0];
        
        return {
            date: latestReport.publishDate,
            title: latestReport.title,
            category: this.formatCategoryPath(latestReport.classification)
        };
    }

    /**
     * 获取所有行业列表
     */
    getIndustries() {
        const industries = new Set(this.reportsData.map(r => r.classification.industry));
        return Array.from(industries).sort();
    }

    /**
     * 根据筛选条件过滤数据
     */
    filterData(filters = {}) {
        this.currentFilters = { ...this.currentFilters, ...filters };
        
        let filteredReports = [...this.reportsData];

        // 行业筛选
        if (this.currentFilters.industry) {
            filteredReports = filteredReports.filter(report => 
                report.classification.industry === this.currentFilters.industry
            );
        }

        // 时间范围筛选
        if (this.currentFilters.timeRange !== 'all') {
            const days = parseInt(this.currentFilters.timeRange);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            
            filteredReports = filteredReports.filter(report => 
                new Date(report.publishDate) >= cutoffDate
            );
        }

        // 搜索筛选
        if (this.currentFilters.searchTerm) {
            const searchTerm = this.currentFilters.searchTerm.toLowerCase();
            filteredReports = filteredReports.filter(report =>
                report.title.toLowerCase().includes(searchTerm) ||
                (report.preview && report.preview.toLowerCase().includes(searchTerm)) ||
                (report.tags && report.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }

        // 重新生成筛选后的数据结构
        this.generateFilteredData(filteredReports);
        
        return this.filteredData;
    }

    /**
     * 生成筛选后的数据结构
     */
    generateFilteredData(reports) {
        this.filteredData = {};
        
        reports.forEach(report => {
            const publishDate = report.publishDate;
            const dateObj = new Date(publishDate);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const yearMonth = `${year}-${month}`;
            const fullDate = publishDate;

            if (!this.filteredData[yearMonth]) {
                this.filteredData[yearMonth] = {
                    yearMonth: yearMonth,
                    displayName: this.formatMonthDisplay(year, month),
                    dates: {}
                };
            }

            if (!this.filteredData[yearMonth].dates[fullDate]) {
                this.filteredData[yearMonth].dates[fullDate] = {
                    date: fullDate,
                    displayDate: this.formatDateDisplay(dateObj),
                    reports: []
                };
            }

            this.filteredData[yearMonth].dates[fullDate].reports.push({
                id: report.id,
                title: report.title,
                category: this.formatCategoryPath(report.classification),
                categoryShort: report.classification.industry,
                summary: this.generateSummary(report.preview),
                filePath: report.filePath,
                tags: report.tags || [],
                viewCount: report.viewCount || 0,
                downloadCount: report.downloadCount || 0,
                rating: report.rating || 0,
                classification: report.classification
            });
        });

        // 排序筛选后的数据
        this.sortFilteredData();
    }

    /**
     * 排序筛选后的数据
     */
    sortFilteredData() {
        Object.values(this.filteredData).forEach(monthData => {
            const sortedDates = {};
            const dateKeys = Object.keys(monthData.dates).sort((a, b) => new Date(b) - new Date(a));
            dateKeys.forEach(dateKey => {
                sortedDates[dateKey] = monthData.dates[dateKey];
                sortedDates[dateKey].reports.sort((a, b) => b.rating - a.rating);
            });
            monthData.dates = sortedDates;
        });
    }

    /**
     * 获取当前筛选条件
     */
    getCurrentFilters() {
        return { ...this.currentFilters };
    }

    /**
     * 清除所有筛选
     */
    clearFilters() {
        this.currentFilters = {
            industry: '',
            timeRange: 'all',
            searchTerm: ''
        };
        this.filteredData = { ...this.updatesData };
        return this.filteredData;
    }

    /**
     * 获取筛选结果统计
     */
    getFilterStatistics() {
        const dataToUse = Object.keys(this.filteredData).length > 0 ? this.filteredData : this.updatesData;
        
        let totalFilteredReports = 0;
        let totalDates = 0;
        
        Object.values(dataToUse).forEach(monthData => {
            Object.values(monthData.dates).forEach(dateData => {
                totalFilteredReports += dateData.reports.length;
                totalDates++;
            });
        });

        return {
            totalReports: totalFilteredReports,
            totalDates: totalDates,
            totalMonths: Object.keys(dataToUse).length
        };
    }

    /**
     * 格式化数字显示
     */
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    /**
     * 获取报告详情
     */
    getReportDetails(reportId) {
        return this.reportsData.find(report => report.id === reportId);
    }

    /**
     * 检查数据是否已初始化
     */
    isInitialized() {
        return this.initialized;
    }

    /**
     * 重新加载数据
     */
    async reload() {
        this.initialized = false;
        await this.init();
    }
}

// 创建全局实例
let luxuryUpdatesManager;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    try {
        luxuryUpdatesManager = new LuxuryUpdatesManager();
        
        // 等待初始化完成
        const waitForInit = () => {
            return new Promise((resolve) => {
                const checkInit = () => {
                    if (luxuryUpdatesManager.isInitialized()) {
                        resolve();
                    } else {
                        setTimeout(checkInit, 100);
                    }
                };
                checkInit();
            });
        };
        
        await waitForInit();
        
        // 触发初始化完成事件
        window.dispatchEvent(new CustomEvent('updatesManagerReady', {
            detail: { manager: luxuryUpdatesManager }
        }));
        
        console.log('🎭 奢华更新管理器已准备就绪');
        
    } catch (error) {
        console.error('💥 奢华更新管理器初始化失败:', error);
    }
});

// 导出到全局作用域
if (typeof window !== 'undefined') {
    window.LuxuryUpdatesManager = LuxuryUpdatesManager;
    window.luxuryUpdatesManager = luxuryUpdatesManager;
}