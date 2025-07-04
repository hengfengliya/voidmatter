/**
 * 行业报告管理系统
 * 统一管理所有报告数据、样式和渲染逻辑
 */

// 报告数据结构
const reportsDatabase = [
    {
        id: 'global-oil-gas-oilfield-services-2025',
        title: '全球油气开采与油田服务 - 深度行业分析报告',
        publishDate: '2025-07-03',
        tags: ['深度分析', '全球视野', '油田服务'],
        preview: '全面剖析全球上游油气行业的供需平衡、竞争格局与结构性趋势。深入分析OPEC+决策机制、IOCs战略分化、OFS技术创新，以及能源转型压力下的行业重塑。',
        viewCount: 3200,
        downloadCount: 680,
        rating: 4.9,
        filePath: 'industry-reports/全球油气开采与油田服务.html',
        classification: {
            industry: '能源',
            subIndustry: '能源', 
            thirdLevel: '油气开采与油田服务',
            fourthLevel: ''
        }
    },
    {
        id: 'petroleum-natural-gas-analysis-2025',
        title: '全球石油与天然气行业：市场动态、竞争格局与未来轨迹的结构性分析',
        publishDate: '2025-07-03',
        tags: ['市场动态', '竞争格局', '未来轨迹'],
        preview: '深度解析全球石油与天然气行业的市场动态与竞争格局，从宏观环境、产业链结构、技术创新等多维度分析行业发展轨迹，为投资决策提供战略性洞察。',
        viewCount: 2950,
        downloadCount: 725,
        rating: 4.8,
        filePath: 'industry-reports/石油天然气行业深度分析.html',
        classification: {
            industry: '能源',
            subIndustry: '能源',
            thirdLevel: '石油与天然气',
            fourthLevel: ''
        }
    },
    {
        id: 'agricultural-chemicals-2025',
        title: '全球农用化工行业：转型十字路口的结构性分析与未来展望',
        publishDate: '2025-07-03',
        tags: ['转型分析', '未来展望', '可持续发展'],
        preview: '深入探讨全球农用化工行业在转型十字路口面临的机遇与挑战，分析行业结构性变革、技术创新驱动力、监管政策影响及可持续发展趋势对产业格局的重塑作用。',
        viewCount: 2650,
        downloadCount: 580,
        rating: 4.7,
        filePath: 'industry-reports/农用化工行业深度研究报告.html',
        classification: {
            industry: '原材料',
            subIndustry: '化工',
            thirdLevel: '农用化工',
            fourthLevel: ''
        }
    },
    {
        id: 'chemical-industry-2025',
        title: '全球化学工业：周期底部徘徊，创新驱动未来',
        publishDate: '2025-07-10',
        tags: ['周期分析', '技术创新', '市场前景'],
        preview: '深入分析全球化学工业在当前周期底部的发展态势，探讨技术创新如何重塑行业格局，并展望未来市场的发展前景与投资机遇。',
        viewCount: 1800,
        downloadCount: 420,
        rating: 4.6,
        filePath: 'industry-reports/化学工业.html',
        classification: {
            industry: '原材料',
            subIndustry: '化工',
            thirdLevel: '基础化工',
            fourthLevel: '化学制品'
        }
    },
    {
        id: 'chemical-fiber-2025',
        title: '化学纤维行业：需求复苏与技术升级双轮驱动',
        publishDate: '2025-07-11',
        tags: ['需求复苏', '技术升级', '产业链'],
        preview: '全面解读化学纤维行业在全球需求复苏背景下的增长潜力，聚焦技术升级对产业链的深远影响，评估龙头企业的竞争优势。',
        viewCount: 1650,
        downloadCount: 380,
        rating: 4.5,
        filePath: 'industry-reports/化学纤维.html',
        classification: {
            industry: '原材料',
            subIndustry: '化工',
            thirdLevel: '化学纤维',
            fourthLevel: ''
        }
    },
    {
        id: 'plastics-industry-2025',
        title: '塑料行业：环保新规下的挑战与新材料机遇',
        publishDate: '2025-07-12',
        tags: ['环保新规', '新材料', '可持续发展'],
        preview: '系统梳理全球环保新规对塑料行业的冲击，分析可降解塑料、高性能塑料等新材料带来的市场机遇，探讨行业的可持续发展路径。',
        viewCount: 2100,
        downloadCount: 510,
        rating: 4.7,
        filePath: 'industry-reports/塑料.html',
        classification: {
            industry: '原材料',
            subIndustry: '化工',
            thirdLevel: '塑料',
            fourthLevel: ''
        }
    },
    {
        id: 'rubber-industry-2025',
        title: '橡胶行业：供需格局演变与下游应用前景',
        publishDate: '2025-07-13',
        tags: ['供需格局', '下游应用', '价格预测'],
        preview: '深入研究天然及合成橡胶的全球供需格局演变，分析其在轮胎、工业制品等下游应用领域的增长前景，并对未来价格走势做出预测。',
        viewCount: 1500,
        downloadCount: 350,
        rating: 4.4,
        filePath: 'industry-reports/橡胶.html',
        classification: {
            industry: '原材料',
            subIndustry: '化工',
            thirdLevel: '橡胶',
            fourthLevel: ''
        }
    }
];

/**
 * 格式化发布日期
 */
function formatPublishDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

/**
 * 格式化数字（添加k单位）
 */
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

/**
 * 生成报告卡片HTML
 */
function generateReportCard(report) {
    const formattedDate = formatPublishDate(report.publishDate);
    const formattedViews = formatNumber(report.viewCount);
    const formattedDownloads = formatNumber(report.downloadCount);
    
    // 生成标签HTML
    const tagsHTML = report.tags.map(tag => `<span class="report-tag">${tag}</span>`).join('');
    
    // 分类数据属性
    const { industry, subIndustry, thirdLevel, fourthLevel } = report.classification;
    const dataAttrs = [
        `data-industry="${industry}"`,
        subIndustry ? `data-sub-industry="${subIndustry}"` : '',
        thirdLevel ? `data-third-level="${thirdLevel}"` : '',
        fourthLevel ? `data-fourth-level="${fourthLevel}"` : ''
    ].filter(attr => attr).join(' ');
    
    return `
        <div class="report-card cursor-pointer" 
             ${dataAttrs}
             onclick="requestAccess('${report.filePath}')">
            
            <div class="report-card-header">
                <div class="report-tags">
                    ${tagsHTML}
                </div>
                <div class="report-date">${formattedDate}</div>
            </div>
            
            <h3 class="report-title">${report.title}</h3>
            
            <p class="report-preview">${report.preview}</p>
            
            <div class="report-footer">
                <div class="report-stats">
                    <span class="stat-item">
                        <i class="fas fa-eye"></i>
                        ${formattedViews}
                    </span>
                    <span class="stat-item">
                        <i class="fas fa-download"></i>
                        ${formattedDownloads}
                    </span>
                    <span class="stat-item">
                        <i class="fas fa-star"></i>
                        ${report.rating}
                    </span>
                </div>
                <div class="report-action">
                    <span class="action-text">查看报告</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染所有报告到指定容器
 */
function renderReports(containerId = 'reports-container') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id '${containerId}' not found`);
        return;
    }
    
    const reportsHTML = reportsDatabase.map(report => generateReportCard(report)).join('');
    container.innerHTML = reportsHTML;
}

/**
 * 根据分类筛选报告
 */
function filterReports(industry, subIndustry = '', thirdLevel = '', fourthLevel = '') {
    return reportsDatabase.filter(report => {
        if (industry === '全部' || !industry) return true;
        
        const { classification } = report;
        
        // 使用之前的通用匹配逻辑
        return isReportMatchCategory(
            classification.industry, 
            classification.subIndustry, 
            classification.thirdLevel, 
            classification.fourthLevel,
            industry, subIndustry, thirdLevel, fourthLevel
        );
    });
}

/**
 * 渲染筛选后的报告
 */
function renderFilteredReports(containerId, industry, subIndustry = '', thirdLevel = '', fourthLevel = '') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const filteredReports = filterReports(industry, subIndustry, thirdLevel, fourthLevel);
    const reportsHTML = filteredReports.map(report => generateReportCard(report)).join('');
    
    if (filteredReports.length === 0) {
        container.innerHTML = `
            <div class="no-reports-message">
                <i class="fas fa-search text-4xl text-gray-500 mb-4"></i>
                <p class="text-gray-500">该分类下暂无报告</p>
                <p class="text-sm text-gray-600 mt-2">更多精彩内容即将推出</p>
            </div>
        `;
    } else {
        container.innerHTML = reportsHTML;
    }
    
    return filteredReports.length;
}

/**
 * 添加新报告
 */
function addReport(reportData) {
    // 验证必要字段
    const requiredFields = ['id', 'title', 'publishDate', 'classification'];
    for (let field of requiredFields) {
        if (!reportData[field]) {
            console.error(`Missing required field: ${field}`);
            return false;
        }
    }
    
    // 检查ID是否重复
    if (reportsDatabase.find(report => report.id === reportData.id)) {
        console.error(`Report with id '${reportData.id}' already exists`);
        return false;
    }
    
    // 设置默认值
    const defaultReport = {
        tags: [],
        preview: '',
        viewCount: 0,
        downloadCount: 0,
        rating: 0,
        filePath: '#',
        ...reportData
    };
    
    reportsDatabase.push(defaultReport);
    return true;
}

/**
 * 获取所有报告
 */
function getAllReports() {
    return [...reportsDatabase];
}

/**
 * 根据ID获取报告
 */
function getReportById(id) {
    return reportsDatabase.find(report => report.id === id);
}

// 导出函数供全局使用
if (typeof window !== 'undefined') {
    window.ReportsManager = {
        renderReports,
        renderFilteredReports,
        filterReports,
        addReport,
        getAllReports,
        getReportById,
        generateReportCard,
        formatPublishDate,
        formatNumber
    };
    
    // 暴露报告数据库供认证系统使用
    window.reportsDatabase = reportsDatabase;
} 