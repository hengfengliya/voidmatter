// 质点智库专用JavaScript

// 滚动动画初始化
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    document.querySelectorAll('.tk-fade-up').forEach(el => {
        observer.observe(el);
    });
}

// 标签页功能
function initTabs() {
    const tabs = document.querySelectorAll('.tk-tab');
    const tabContents = document.querySelectorAll('.tk-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有活动状态
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // 激活当前标签
            tab.classList.add('active');
            const targetContent = document.getElementById(tab.dataset.tab);
            if (targetContent) {
                targetContent.style.display = 'block';
                setTimeout(() => {
                    targetContent.classList.add('active');
                }, 10);
            }
            
            // 重新初始化当前标签页的动画
            initTabAnimations(tab.dataset.tab);
        });
    });
    
    // 默认激活第一个标签
    if (tabs.length > 0) {
        tabs[0].click();
    }
}

// 标签页内容动画
function initTabAnimations(tabId) {
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
        const cards = tabContent.querySelectorAll('.tk-report-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// 报告卡片事件
function initReportCards() {
    const reportCards = document.querySelectorAll('.tk-report-card');
    
    reportCards.forEach(card => {
        // 点击事件
        card.addEventListener('click', function() {
            const reportUrl = this.dataset.reportUrl;
            const reportTitle = this.querySelector('h3').textContent;
            
            if (reportUrl) {
                openReportModal(reportUrl, reportTitle);
            }
        });
        
        // 鼠标进入效果
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px) scale(1.02)';
        });
        
        // 鼠标离开效果
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// 打开报告模态框
function openReportModal(reportUrl, reportTitle) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'tk-modal';
    modal.innerHTML = `
        <div class="tk-modal-overlay" onclick="closeReportModal()"></div>
        <div class="tk-modal-content">
                         <div class="tk-modal-header">
                 <div class="flex items-center">
                     <i class="fas fa-expand-arrows-alt text-yellow-400 mr-3 text-lg"></i>
                     <h2 class="tk-gradient-text">${reportTitle}</h2>
                 </div>
                 <div class="flex items-center space-x-4">
                     <span class="text-xs text-gray-400 hidden md:block">按 ESC 键退出全屏</span>
                     <button onclick="closeReportModal()" class="tk-modal-close">
                         <i class="fas fa-times"></i>
                     </button>
                 </div>
             </div>
            <div class="tk-modal-body">
                <div class="tk-loading-container">
                    <div class="tk-loading"></div>
                    <p>正在加载报告...</p>
                </div>
                <iframe id="reportFrame" src="${reportUrl}" frameborder="0" style="display:none;"></iframe>
            </div>
        </div>
    `;
    
    // 添加模态框样式
    if (!document.querySelector('#modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .tk-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .tk-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
            }
            
                         .tk-modal-content {
                 position: relative;
                 width: 100%;
                 height: 100%;
                 background: linear-gradient(145deg, rgba(26, 26, 26, 0.98), rgba(10, 10, 10, 0.98));
                 border: none;
                 border-radius: 0;
                 overflow: hidden;
                 box-shadow: none;
             }
            
                         .tk-modal-header {
                 display: flex;
                 justify-content: space-between;
                 align-items: center;
                 padding: 24px 32px;
                 border-bottom: 2px solid rgba(212, 175, 55, 0.4);
                 background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(184, 134, 11, 0.1));
                 backdrop-filter: blur(10px);
                 z-index: 1000;
             }
            
                         .tk-modal-close {
                 background: rgba(0, 0, 0, 0.3);
                 border: 2px solid rgba(212, 175, 55, 0.5);
                 color: var(--tk-gold);
                 font-size: 28px;
                 cursor: pointer;
                 padding: 12px;
                 border-radius: 50%;
                 transition: all 0.3s ease;
                 width: 50px;
                 height: 50px;
                 display: flex;
                 align-items: center;
                 justify-content: center;
             }
             
             .tk-modal-close:hover {
                 background: rgba(212, 175, 55, 0.3);
                 border-color: rgba(212, 175, 55, 0.8);
                 transform: scale(1.1);
                 box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
             }
            
                         .tk-modal-body {
                 height: calc(100% - 100px);
                 position: relative;
             }
            
            .tk-loading-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                z-index: 10;
            }
            
            .tk-modal-body iframe {
                width: 100%;
                height: 100%;
                border: none;
            }
        `;
        document.head.appendChild(modalStyles);
    }
    
    document.body.appendChild(modal);
    
    // 等待iframe加载
    const iframe = modal.querySelector('#reportFrame');
    iframe.onload = function() {
        modal.querySelector('.tk-loading-container').style.display = 'none';
        iframe.style.display = 'block';
    };
    
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
    
    // 添加ESC键关闭功能
    const handleEscKey = (e) => {
        if (e.key === 'Escape') {
            closeReportModal();
        }
    };
    document.addEventListener('keydown', handleEscKey);
    
    // 将ESC键处理函数存储到模态框元素上，以便关闭时移除
    modal.escKeyHandler = handleEscKey;
}

// 关闭报告模态框
function closeReportModal() {
    const modal = document.querySelector('.tk-modal');
    if (modal) {
        // 移除ESC键监听器
        if (modal.escKeyHandler) {
            document.removeEventListener('keydown', modal.escKeyHandler);
        }
        
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// 搜索功能
function initSearch() {
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.tk-report-card');
            
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const tags = Array.from(card.querySelectorAll('.tk-tag')).map(tag => tag.textContent.toLowerCase());
                
                const isMatch = title.includes(searchTerm) || 
                               description.includes(searchTerm) || 
                               tags.some(tag => tag.includes(searchTerm));
                
                if (isMatch || searchTerm === '') {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    }
}

// 导航栏滚动效果
function initNavbarScroll() {
    const navbar = document.querySelector('.tk-nav');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 向下滚动时隐藏导航栏，向上滚动时显示
        if (window.scrollY > lastScrollY && window.scrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = window.scrollY;
    });
}

// 工具函数：显示加载状态
function showLoading(element) {
    element.innerHTML = '<div class="tk-loading"></div>';
}

// 工具函数：隐藏加载状态
function hideLoading(element, originalContent) {
    element.innerHTML = originalContent;
}

// 工具函数：平滑滚动到元素
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// 官方中信行业分类数据 - 一级分类（按照CSV文件排序）
const industryData = [
    { code: '10', name: '能源', color: '#FF6B6B', icon: '⚡' },
    { code: '15', name: '原材料', color: '#4ECDC4', icon: '🏭' },
    { code: '20', name: '工业', color: '#45B7D1', icon: '⚙️' },
    { code: '25', name: '可选消费', color: '#96CEB4', icon: '🛒' },
    { code: '30', name: '主要消费', color: '#FFEAA7', icon: '🍎' },
    { code: '35', name: '医药卫生', color: '#DDA0DD', icon: '💊' },
    { code: '40', name: '金融', color: '#98D8C8', icon: '💰' },
    { code: '45', name: '信息技术', color: '#F7DC6F', icon: '💻' },
    { code: '50', name: '通信服务', color: '#BB8FCE', icon: '📡' },
    { code: '55', name: '公用事业', color: '#95A5A6', icon: '⚡' },
    { code: '60', name: '房地产', color: '#E8A87C', icon: '🏠' }
];

// 官方中信行业分类数据 - 二级分类
const subIndustryData = {
    '能源': ['全部', '能源'],
    '原材料': ['全部', '化工', '有色金属', '造纸与包装', '钢铁', '非金属材料'],
    '工业': ['全部', '交通运输', '商业服务与用品', '建筑装饰', '机械制造', '环保', '电力设备', '航空航天与国防'],
    '可选消费': ['全部', '乘用车及零部件', '消费者服务', '纺织服装与珠宝', '耐用消费品', '零售业'],
    '主要消费': ['全部', '农牧渔', '家庭与个人用品', '食品、饮料与烟草'],
    '医药卫生': ['全部', '医疗', '医药'],
    '金融': ['全部', '保险', '其他金融', '资本市场', '银行'],
    '信息技术': ['全部', '半导体', '电子', '计算机'],
    '通信服务': ['全部', '传媒', '电信服务', '通信设备及技术服务'],
    '公用事业': ['全部', '公用事业'],
    '房地产': ['全部', '房地产']
};

// 官方中信行业分类数据 - 三级分类
const thirdLevelData = {
    '能源': ['全部', '油气开采与油田服务', '煤炭', '石油与天然气'],
    '乘用车及零部件': ['全部', '乘用车', '摩托车及其他', '汽车经销商与汽车服务', '汽车零部件与轮胎'],
    '交通运输': ['全部', '交通基本设施', '运输业'],
    '传媒': ['全部', '数字媒体', '文化娱乐', '营销与广告'],
    '保险': ['全部', '保险'],
    '公用事业': ['全部', '供热及其他', '市政环卫', '水务', '燃气', '电力及电网'],
    '其他金融': ['全部', '其他金融服务', '消费信贷'],
    '农牧渔': ['全部', '养殖', '种植'],
    '化工': ['全部', '农用化工', '化学制品', '化学原料', '化学纤维', '塑料', '橡胶'],
    '医疗': ['全部', '医疗商业与服务', '医疗器械'],
    '医药': ['全部', '中药', '制药与生物科技服务', '化学药', '生物药品'],
    '半导体': ['全部', '分立器件', '半导体材料与设备', '集成电路'],
    '商业服务与用品': ['全部', '商业服务与用品'],
    '家庭与个人用品': ['全部', '家庭用品', '美容护理'],
    '建筑装饰': ['全部', '建筑与工程', '建筑产品', '建筑装修'],
    '房地产': ['全部', '房地产开发与园区', '房地产投资信托(REITs)', '房地产管理与服务'],
    '有色金属': ['全部', '其他有色金属及合金', '工业金属', '稀有金属', '贵金属'],
    '机械制造': ['全部', '专用机械', '交通运输设备', '工业集团企业', '通用机械'],
    '消费者服务': ['全部', '休闲服务', '其他消费者服务', '教育服务'],
    '环保': ['全部', '污染治理', '节能与生态修复'],
    '电信服务': ['全部', '电信增值服务', '电信运营服务'],
    '电力设备': ['全部', '储能设备', '发电设备', '电网设备'],
    '电子': ['全部', '光学光电子', '其他电子', '电子元件', '电子化学品', '电子终端及组件'],
    '纺织服装与珠宝': ['全部', '珠宝与奢侈品', '纺织服装'],
    '耐用消费品': ['全部', '休闲设备与用品', '家居', '家用电器'],
    '航空航天与国防': ['全部', '国防装备', '航空航天'],
    '计算机': ['全部', '信息技术服务', '软件开发'],
    '资本市场': ['全部', '其他资本市场', '证券公司'],
    '通信设备及技术服务': ['全部', '数据中心', '通信技术服务', '通信设备'],
    '造纸与包装': ['全部', '容器与包装', '纸类与林业产品'],
    '钢铁': ['全部', '钢铁'],
    '银行': ['全部', '商业银行', '抵押信贷机构'],
    '零售业': ['全部', '一般零售', '专营零售', '互联网零售', '旅游零售'],
    '非金属材料': ['全部', '其他非金属材料', '建筑材料'],
    '食品、饮料与烟草': ['全部', '烟草', '软饮料', '酒', '食品']
};

// 官方中信行业分类数据 - 四级分类（基于四级分类CSV）
const fourthLevelData = {
    '油气开采与油田服务': ['全部', '油气开采', '油田服务'],
    '石油与天然气': ['全部', '综合性石油与天然气企业', '燃气分销', '天然气加工', '油气储运设施'],
    '煤炭': ['全部', '煤炭', '焦炭'],
    '农用化工': ['全部', '氮肥', '磷肥', '钾盐肥', '农药', '磷肥及复合肥'],
    '化学纤维': ['全部', '聚酯纤维', '粘胶', '其他化纤原料及产品'],
    '化学原料': ['全部', '纯碱', '氯碱', '无机盐', '氟化工', '其他化学原料'],
    '化学制品': ['全部', '染料', '涂料油墨', '印染化学品', '胶粘剂', '日化', '氯碱', '化纤助剂', '其他化学制品'],
    '塑料': ['全部', '塑料制品', '合成树脂', '膜材料', '塑料包装制品'],
    '橡胶': ['全部', '轮胎', '橡胶制品'],
    '工业金属': ['全部', '铜', '铝', '锌铅', '镍钴'],
    '贵金属': ['全部', '黄金', '贵金属及深加工'],
    '稀有金属': ['全部', '稀土永磁', '锂盐', '钛', '其他稀有金属'],
    '其他有色金属及合金': ['全部', '锡', '其他有色金属及合金'],
    '钢铁': ['全部', '特钢', '普钢', '钢铁辅料'],
    '建筑材料': ['全部', '水泥及水泥制品', '玻璃'],
    '其他非金属材料': ['全部', '玻璃纤维', '其他非金属材料'],
    '容器与包装': ['全部', '金属、玻璃及塑料容器包装', '纸制品包装'],
    '纸类与林业产品': ['全部', '林业产品', '纸制品'],
    '航空航天': ['全部', '航空', '航天'],
    '国防装备': ['全部', '国防装备'],
    '建筑与工程': ['全部', '房屋建设', '基础设施建设', '园林工程', '专业工程', '建筑设计及相关技术'],
    '建筑装修': ['全部', '建筑装修'],
    '建筑产品': ['全部', '建筑产品'],
    '发电设备': ['全部', '发电设备', '风电设备', '光伏太阳能设备'],
    '电网设备': ['全部', '电力自动化', '输变电设备', '电机设备', '新型电力设备'],
    '储能设备': ['全部', '电池', '燃料电池及其他储能'],
    '通用机械': ['全部', '金工机械', '农业机械', '液压机械', '机电和工业自动化', '金属和金属', '磨具磨料', '其他通用机械'],
    '专用机械': ['全部', '冶金机械', '采掘设备机械', '制冷机械', '印刷包装机械', '纺织服装机械', '农业机械', '楼宇设备', '其他专用机械'],
    '交通运输设备': ['全部', '非公路用', '车船配套及其他运输设备', '载货车'],
    '工业集团企业': ['全部', '工业集团企业'],
    '污染治理': ['全部', '固废处理', '废水处理', '大气治理'],
    '节能与生态修复': ['全部', '节能环保设备及服务', '水处理', '生态修复'],
    '商业服务与用品': ['全部', '商业印刷', '市场调研', '办公设备及用品', '贸易', '其他商业服务与用品'],
    '运输业': ['全部', '航空', '高速公路', '港口水运', '物流', '铁路运输', '城市公交', '其他运输'],
    '交通基本设施': ['全部', '机场', '港口', '高速公路'],
    '汽车零部件与轮胎': ['全部', '汽车系统及部件', '车用照明及车载电子', '汽车饰件', '轮胎', '其他汽车零部件'],
    '乘用车': ['全部', '乘用车'],
    '摩托车及其他': ['全部', '摩托车及其他'],
    '汽车经销商与汽车服务': ['全部', '汽车经销商', '汽车服务'],
    '家用电器': ['全部', '白色家电', '黑色家电', '小家电', '家电显示器', '家电配件', '家电零部件及其他'],
    '家居': ['全部', '家居', '智能家居'],
    '休闲设备与用品': ['全部', '休闲设备与用品'],
    '纺织品': ['全部', '纺织品', '服装', '皮鞋皮具', '其他纺织'],
    '珠宝与奢侈品': ['全部', '珠宝与奢侈品'],
    '旅游': ['全部', '旅游'], 
    '餐饮服务': ['全部', '餐饮服务'],
    '酒店': ['全部', '酒店'],
    '博彩娱乐': ['全部', '博彩娱乐'],
    '休闲设施': ['全部', '休闲设施'],
    '体育': ['全部', '体育'],
    '其他休闲服务': ['全部', '其他休闲服务'],
    '学前教育': ['全部', '学前教育'],
    '培训及其他教育': ['全部', '培训及其他教育'],
    '其他消费者服务': ['全部', '其他消费者服务'],
    '一般零售': ['全部', '百货商店', '超市及其他综合零售'],
    '专营零售': ['全部', '专营零售'],
    '旅游零售': ['全部', '旅游零售'],
    '互联网零售': ['全部', '互联网零售'],
    '酒': ['全部', '白酒', '啤酒', '黄酒', '葡萄酒及其他酒类'],
    '软饮料': ['全部', '软饮料'],
    '食品': ['全部', '肉制品', '调味品及食品添加', '乳制品', '烘培食品', '其他食品'],
    '烟草': ['全部', '烟草'],
    '农产品': ['全部', '农产品', '林业'],
    '养殖': ['全部', '水产', '饲料及饲料添加剂', '肉制品', '渔业产品'],
    '家庭用品': ['全部', '家庭用品'],
    '美容护理': ['全部', '美容护理'],
    '医疗器械': ['全部', '医疗设备', '医疗耗材', '康复器械'],
    '医疗商业与服务': ['全部', '医疗分销', '医药商业'],
    '血液制品': ['全部', '血液制品', '疫苗', '其他生物医药制品'],
    '化学药': ['全部', '原料药', '药品制剂'],
    '中药': ['全部', '中药饮片', '中成药'],
    '制药与生物科技服务': ['全部', '制药与生物科技服务'],
    '综合性银行': ['全部', '综合性银行', '城市商业银行'],
    '抵押信贷机构': ['全部', '抵押信贷机构'],
    '资产投资': ['全部', '资产投资', '其他金融服务', '金融综合及交易服务'],
    '消费信贷': ['全部', '消费信贷'],
    '证券公司': ['全部', '证券公司'],
    '资产管理': ['全部', '资产管理', '期货及其他衍生品', '其他资本市场'],
    '人寿及健康保险': ['全部', '人寿及健康保险', '多元化保险', '财产及意外伤害保险', '再保险', '保险经纪商'],
    '通用软件': ['全部', '通用软件', '行业应用软件'],
    '信息技术服务': ['全部', '系统集成服务', '技术咨询服务', '云计算及互联网相关服务'],
    '消费电子周边设备': ['全部', '消费电子周边设备', '有线电视终端', '有线电视系统及组件', '电子设备制造'],
    '印制电路板': ['全部', '印制电路板', '电子元件'],
    '激光': ['全部', '激光', 'LED', '光学元件'],
    '电子化学品': ['全部', '电子化学品'],
    '其他电子': ['全部', '其他电子'],
    '集成电路设计': ['全部', '集成电路设计', '集成电路制造', '集成电路封测'],
    '分立器件': ['全部', '分立器件'],
    '半导体材料': ['全部', '半导体材料', '半导体设备'],
    '电信运营服务': ['全部', '电信运营服务'],
    '电信增值服务': ['全部', '电信增值服务'],
    '通信终端设备制造': ['全部', '通信终端设备制造', '通信系统设备制造'],
    '数据中心': ['全部', '数据中心'],
    '通信技术服务': ['全部', '通信技术服务'],
    '传统营销': ['全部', '传统营销', '数字化营销'],
    '影视动漫': ['全部', '影视动漫', '游戏', '出版', '广播电视'],
    '网络视频': ['全部', '网络视频', '音频媒体', '图书媒体', '数字媒体', '互联网信息服务'],
    '火力发电': ['全部', '火力发电', '水力发电', '核力发电', '风力发电', '太阳能发电', '新能源发电'],
    '燃气': ['全部', '燃气'],
    '水务': ['全部', '水务'],
    '市政环卫': ['全部', '市政环卫'],
    '供热及其他': ['全部', '供热及其他'],
    '房地产开发': ['全部', '房地产开发', '园区'],
    '房地产服务': ['全部', '房地产中介', '房地产服务'],
    '房地产投资信托(REITs)': ['全部', '房地产投资信托(REITs)']
};

// 当前激活的分类
let currentIndustry = '全部';
let currentSubIndustry = '全部';
let currentThirdLevel = '全部';
let currentFourthLevel = '全部';

// 防止hash循环更新的标志
let isUpdatingFromHash = false;

// 防抖变量
let debounceTimer = null;

// 初始化主要标签页（行业研究/公司研究）
function initMainTabs() {
    const industryTab = document.getElementById('industry-tab');
    const companyTab = document.getElementById('company-tab');
    const classificationArea = document.getElementById('classification-area');

    // 行业研究tab点击事件
    industryTab.addEventListener('click', function() {
        // 更新tab状态
        industryTab.classList.add('active');
        companyTab.classList.remove('active');
        
        // 显示分类区域
        classificationArea.style.display = 'block';
        
        // 显示行业研究内容，隐藏公司研究内容
        document.getElementById('industry-reports').style.display = 'block';
        document.getElementById('company-research').style.display = 'none';
    });

    // 公司研究tab点击事件
    companyTab.addEventListener('click', function() {
        // 更新tab状态
        companyTab.classList.add('active');
        industryTab.classList.remove('active');
        
        // 隐藏分类区域
        classificationArea.style.display = 'none';
        
        // 显示公司研究内容，隐藏行业研究内容
        document.getElementById('company-research').style.display = 'block';
        document.getElementById('industry-reports').style.display = 'none';
        
        // 重置所有分类状态
        resetAllClassifications();
    });

    // 默认状态：显示行业研究
    classificationArea.style.display = 'block';
    document.getElementById('industry-reports').style.display = 'block';
    document.getElementById('company-research').style.display = 'none';
}

// 重置所有分类状态
function resetAllClassifications() {
    hideSubIndustryTabs();
    hideThirdLevelTabs();
    hideFourthLevelTabs();
    
    // 重置一级分类选中状态
    document.querySelectorAll('.industry-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 选中"全部"
    const allTab = document.querySelector('.industry-tab');
    if (allTab) {
        allTab.classList.add('active');
    }
    
    currentIndustry = '全部';
    currentSubIndustry = '全部';
    currentThirdLevel = '全部';
    currentFourthLevel = '全部';
}

// 初始化行业分类标签页
function initIndustryTabs() {
    const container = document.getElementById('industry-tabs');
    if (!container) return;

    // 清空现有内容，防止重复生成
    container.innerHTML = '';

    // 创建"全部"标签页
    const allTab = document.createElement('div');
    allTab.className = 'industry-tab active';
    allTab.textContent = '全部';
    allTab.onclick = () => selectIndustryTab(allTab, '全部');
    container.appendChild(allTab);

    // 创建行业标签页
    industryData.forEach(industry => {
        const tab = document.createElement('div');
        tab.className = 'industry-tab';
        tab.style.setProperty('--tab-color', industry.color);
        
        // 检查屏幕尺寸决定显示内容
        if (window.innerWidth <= 768) {
            // 移动端只显示图标
            tab.innerHTML = industry.icon;
            tab.title = industry.name; // 添加悬浮提示
        } else {
            // 桌面端显示图标+文字
            tab.innerHTML = `${industry.icon} ${industry.name}`;
        }
        
        tab.onclick = () => selectIndustryTab(tab, industry.name);
        container.appendChild(tab);
    });

    // 监听窗口大小变化
    window.addEventListener('resize', updateTabsContent);
}



// 更新标签页内容（响应式）
function updateTabsContent() {
    const tabs = document.querySelectorAll('.industry-tab:not(:first-child)');
    tabs.forEach((tab, index) => {
        const industry = industryData[index];
        if (window.innerWidth <= 768) {
            tab.innerHTML = industry.icon;
            tab.title = industry.name;
        } else {
            tab.innerHTML = `${industry.icon} ${industry.name}`;
            tab.removeAttribute('title');
        }
    });
}

// 选择行业标签页
function selectIndustryTab(tabElement, industry) {
    // 更新标签页激活状态
    document.querySelectorAll('.industry-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    tabElement.classList.add('active');

    // 更新当前行业
    currentIndustry = industry;

    // 处理二级分类
    if (industry === '全部') {
        // 选择"全部"时隐藏二级分类、三级分类和四级分类
        hideSubIndustryTabs();
        hideThirdLevelTabs();
        hideFourthLevelTabs();
        filterIndustryContent('全部', '全部', '全部', '全部');
    } else {
        // 选择具体行业时显示对应的二级分类
        hideThirdLevelTabs(); // 隐藏三级分类
        hideFourthLevelTabs(); // 隐藏四级分类
        showSubIndustryTabs(industry);
        filterIndustryContent(industry, '全部', '全部', '全部'); // 默认选中"全部"二级分类
    }

    // 更新URL hash
    updateURLHash(industry, '全部', '全部', '全部');
}

// 显示二级分类标签页
function showSubIndustryTabs(industry) {
    const containerWrapper = document.getElementById('sub-industry-container');
    const container = document.getElementById('sub-industry-tabs');
    if (!container || !containerWrapper) return;

    const subCategories = subIndustryData[industry] || ['全部'];
    
    // 清空现有内容
    container.innerHTML = '';
    
    // 创建二级分类标签页
    subCategories.forEach((subCategory, index) => {
        const tab = document.createElement('div');
        tab.className = 'sub-industry-tab';
        if (index === 0) { // 默认选中第一个（全部）
            tab.classList.add('active');
        }
        tab.textContent = subCategory;
        tab.onclick = () => selectSubIndustryTab(tab, subCategory);
        container.appendChild(tab);
    });

    // 显示二级分类容器
    container.style.display = 'flex';
    containerWrapper.style.display = 'block';
}

// 隐藏二级分类标签页
function hideSubIndustryTabs() {
    const containerWrapper = document.getElementById('sub-industry-container');
    const container = document.getElementById('sub-industry-tabs');
    if (containerWrapper) {
        containerWrapper.style.display = 'none';
    }
    if (container) {
        container.style.display = 'none';
        container.innerHTML = '';
    }
    currentSubIndustry = '全部';
    
    // 同时隐藏三级分类和四级分类
    hideThirdLevelTabs();
    hideFourthLevelTabs();
}

// 选择二级分类标签页
function selectSubIndustryTab(tabElement, subIndustry) {
    // 防抖处理
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(() => {
        // 更新二级分类标签页激活状态
        document.querySelectorAll('.sub-industry-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        tabElement.classList.add('active');

        // 更新当前二级分类
        currentSubIndustry = subIndustry;

        // 处理三级分类
        if (subIndustry === '全部') {
            // 选择"全部"时隐藏三级分类和四级分类
            hideThirdLevelTabs();
            hideFourthLevelTabs();
            filterIndustryContent(currentIndustry, subIndustry, '全部', '全部');
        } else {
            // 选择具体二级分类时显示对应的三级分类
            hideFourthLevelTabs(); // 隐藏四级分类
            showThirdLevelTabs(subIndustry);
            filterIndustryContent(currentIndustry, subIndustry, '全部', '全部'); // 默认选中"全部"三级分类
        }

        // 更新URL hash
        updateURLHash(currentIndustry, subIndustry, '全部', '全部');
        
        debounceTimer = null;
    }, 100);
}

// 显示三级分类标签页
function showThirdLevelTabs(subIndustry) {
    const containerWrapper = document.getElementById('third-level-container');
    const container = document.getElementById('third-level-tabs');
    if (!container || !containerWrapper) return;

    const thirdCategories = thirdLevelData[subIndustry] || ['全部'];
    
    // 清空现有内容
    container.innerHTML = '';
    
    // 创建三级分类标签页
    thirdCategories.forEach((thirdCategory, index) => {
        const tab = document.createElement('div');
        tab.className = 'third-level-tab';
        if (index === 0) { // 默认选中第一个（全部）
            tab.classList.add('active');
        }
        tab.textContent = thirdCategory;
        tab.onclick = () => selectThirdLevelTab(tab, thirdCategory);
        container.appendChild(tab);
    });

    // 显示三级分类容器
    container.style.display = 'flex';
    containerWrapper.style.display = 'block';
    
    // 重置当前三级分类
    currentThirdLevel = '全部';
}

// 隐藏三级分类标签页
function hideThirdLevelTabs() {
    const containerWrapper = document.getElementById('third-level-container');
    const container = document.getElementById('third-level-tabs');
    if (containerWrapper) {
        containerWrapper.style.display = 'none';
    }
    if (container) {
        container.style.display = 'none';
        container.innerHTML = '';
    }
    currentThirdLevel = '全部';
    
    // 同时隐藏四级分类
    hideFourthLevelTabs();
}

// 选择三级分类标签页
function selectThirdLevelTab(tabElement, thirdLevel) {
    // 防抖处理
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(() => {
        // 更新三级分类标签页激活状态
        document.querySelectorAll('.third-level-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        tabElement.classList.add('active');

        // 更新当前三级分类
        currentThirdLevel = thirdLevel;

        // 处理四级分类
        if (thirdLevel === '全部') {
            // 选择"全部"时隐藏四级分类
            hideFourthLevelTabs();
            filterIndustryContent(currentIndustry, currentSubIndustry, thirdLevel, '全部');
        } else {
            // 选择具体三级分类时显示对应的四级分类
            showFourthLevelTabs(thirdLevel);
            filterIndustryContent(currentIndustry, currentSubIndustry, thirdLevel, '全部'); // 默认选中"全部"四级分类
        }

        // 更新URL hash
        updateURLHash(currentIndustry, currentSubIndustry, thirdLevel, '全部');
        
        debounceTimer = null;
    }, 100);
}

// 显示四级分类标签页
function showFourthLevelTabs(thirdLevel) {
    const containerWrapper = document.getElementById('fourth-level-container');
    const container = document.getElementById('fourth-level-tabs');
    if (!container || !containerWrapper) return;

    const fourthCategories = fourthLevelData[thirdLevel] || ['全部'];
    
    // 清空现有内容
    container.innerHTML = '';
    
    // 创建四级分类标签页
    fourthCategories.forEach((fourthCategory, index) => {
        const tab = document.createElement('div');
        tab.className = 'fourth-level-tab';
        if (index === 0) { // 默认选中第一个（全部）
            tab.classList.add('active');
        }
        tab.textContent = fourthCategory;
        tab.onclick = () => selectFourthLevelTab(tab, fourthCategory);
        container.appendChild(tab);
    });

    // 显示四级分类容器
    container.style.display = 'flex';
    containerWrapper.style.display = 'block';
    
    // 重置当前四级分类
    currentFourthLevel = '全部';
}

// 隐藏四级分类标签页
function hideFourthLevelTabs() {
    const containerWrapper = document.getElementById('fourth-level-container');
    const container = document.getElementById('fourth-level-tabs');
    if (containerWrapper) {
        containerWrapper.style.display = 'none';
    }
    if (container) {
        container.style.display = 'none';
        container.innerHTML = '';
    }
    currentFourthLevel = '全部';
}

// 选择四级分类标签页
function selectFourthLevelTab(tabElement, fourthLevel) {
    // 防抖处理
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(() => {
        // 更新四级分类标签页激活状态
        document.querySelectorAll('.fourth-level-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        tabElement.classList.add('active');

        // 更新当前四级分类
        currentFourthLevel = fourthLevel;

        // 筛选内容
        filterIndustryContent(currentIndustry, currentSubIndustry, currentThirdLevel, fourthLevel);

        // 更新URL hash
        updateURLHash(currentIndustry, currentSubIndustry, currentThirdLevel, fourthLevel);
        
        debounceTimer = null;
    }, 100);
}

// 通用分类匹配函数：检查报告是否匹配选择的分类路径
function isReportMatchCategory(cardIndustry, cardSubIndustry, cardThirdLevel, cardFourthLevel, 
                              selectedIndustry, selectedSubIndustry, selectedThirdLevel, selectedFourthLevel) {
    // 构建报告的完整分类路径
    const reportPath = [cardIndustry, cardSubIndustry, cardThirdLevel, cardFourthLevel].filter(item => item && item !== '');
    
    // 构建选择的分类路径（去除"全部"）
    const selectedPath = [];
    if (selectedIndustry && selectedIndustry !== '全部') selectedPath.push(selectedIndustry);
    if (selectedSubIndustry && selectedSubIndustry !== '全部') selectedPath.push(selectedSubIndustry);
    if (selectedThirdLevel && selectedThirdLevel !== '全部') selectedPath.push(selectedThirdLevel);
    if (selectedFourthLevel && selectedFourthLevel !== '全部') selectedPath.push(selectedFourthLevel);
    
    // 如果没有选择任何具体分类，显示所有报告
    if (selectedPath.length === 0) return true;
    
    // 检查报告路径是否包含选择的路径
    // 报告路径必须以选择的路径开头（或完全匹配）
    if (selectedPath.length > reportPath.length) return false;
    
    for (let i = 0; i < selectedPath.length; i++) {
        if (reportPath[i] !== selectedPath[i]) {
            return false;
        }
    }
    
    return true;
}

// 筛选行业内容
function filterIndustryContent(industry, subIndustry, thirdLevel, fourthLevel) {
    // 只显示"全部显示"区域
    const sections = document.querySelectorAll('#industry-content > div[data-industry]');
    sections.forEach(section => {
        const sectionIndustry = section.getAttribute('data-industry');
        // 只显示"全部显示"区域
        if (sectionIndustry === '全部') {
            section.style.display = '';
            section.style.opacity = '1';
        } else {
            section.style.display = 'none';
            section.style.opacity = '0';
        }
    });

    // 使用报告管理器渲染筛选后的报告
    if (window.ReportsManager) {
        const reportCount = window.ReportsManager.renderFilteredReports(
            'reports-container', 
            industry, 
            subIndustry, 
            thirdLevel, 
            fourthLevel
        );
        
        // 更新显示统计
        updateContentStats(industry, subIndustry, thirdLevel, fourthLevel, reportCount);
    } else {
        console.warn('ReportsManager not available');
    }
}

// 更新内容统计
function updateContentStats(industry, subIndustry, thirdLevel, fourthLevel, reportCount = null) {
    // 如果传入了reportCount，直接使用；否则统计DOM中的卡片
    let actualVisibleCount = reportCount;
    
    if (actualVisibleCount === null) {
        const allCards = document.querySelectorAll('#industry-content .report-card:not(.opacity-50)');
        actualVisibleCount = 0;
        allCards.forEach(card => {
            const style = getComputedStyle(card);
            if (style.display !== 'none' && style.opacity !== '0') {
                actualVisibleCount++;
            }
        });
    }
    
    const statsElement = document.querySelector('.tk-content-stats');
    if (statsElement) {
        if (industry === '全部') {
            statsElement.textContent = `发现 ${actualVisibleCount} 个研究报告`;
        } else {
            const categoryText = fourthLevel !== '全部' ? fourthLevel : 
                                thirdLevel !== '全部' ? thirdLevel : 
                                subIndustry !== '全部' ? subIndustry : industry;
            statsElement.textContent = `${categoryText} · 发现 ${actualVisibleCount} 个研究报告`;
        }
    }
    
    // 在控制台显示统计信息（调试用）
    console.log(`当前显示 ${actualVisibleCount} 个报告 - ${industry} > ${subIndustry} > ${thirdLevel} > ${fourthLevel}`);
}

// 更新URL hash
function updateURLHash(industry, subIndustry, thirdLevel, fourthLevel) {
    // 防止循环更新
    if (isUpdatingFromHash) return;
    
    if (industry === '全部') {
        window.location.hash = '';
    } else if (subIndustry === '全部') {
        window.location.hash = `#${encodeURIComponent(industry)}`;
    } else if (thirdLevel === '全部') {
        window.location.hash = `#${encodeURIComponent(industry)}-${encodeURIComponent(subIndustry)}`;
    } else if (fourthLevel === '全部') {
        window.location.hash = `#${encodeURIComponent(industry)}-${encodeURIComponent(subIndustry)}-${encodeURIComponent(thirdLevel)}`;
    } else {
        window.location.hash = `#${encodeURIComponent(industry)}-${encodeURIComponent(subIndustry)}-${encodeURIComponent(thirdLevel)}-${encodeURIComponent(fourthLevel)}`;
    }
}

// 从URL hash恢复分类状态
function restoreFromURLHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    // 设置标志防止循环
    isUpdatingFromHash = true;
    
    const parts = decodeURIComponent(hash).split('-');
    const industry = parts[0];
    const subIndustry = parts[1] || '全部';
    const thirdLevel = parts[2] || '全部';
    const fourthLevel = parts[3] || '全部';

    // 查找对应的一级分类标签页
    const industryTabs = document.querySelectorAll('.industry-tab');
    for (let tab of industryTabs) {
        if (tab.textContent === industry || (tab.textContent.includes(industry) && industry !== '全部')) {
            selectIndustryTab(tab, industry);
            
            // 如果有二级分类，选择对应的二级分类标签页
            if (subIndustry !== '全部') {
                setTimeout(() => {
                    const subTabs = document.querySelectorAll('.sub-industry-tab');
                    for (let subTab of subTabs) {
                        if (subTab.textContent === subIndustry) {
                            selectSubIndustryTab(subTab, subIndustry);
                            
                            // 如果有三级分类，选择对应的三级分类标签页
                            if (thirdLevel !== '全部') {
                                setTimeout(() => {
                                    const thirdTabs = document.querySelectorAll('.third-level-tab');
                                    for (let thirdTab of thirdTabs) {
                                        if (thirdTab.textContent === thirdLevel) {
                                            selectThirdLevelTab(thirdTab, thirdLevel);
                                            
                                            // 如果有四级分类，选择对应的四级分类标签页
                                            if (fourthLevel !== '全部') {
                                                setTimeout(() => {
                                                    const fourthTabs = document.querySelectorAll('.fourth-level-tab');
                                                    for (let fourthTab of fourthTabs) {
                                                        if (fourthTab.textContent === fourthLevel) {
                                                            selectFourthLevelTab(fourthTab, fourthLevel);
                                                            break;
                                                        }
                                                    }
                                                    // 重置标志
                                                    isUpdatingFromHash = false;
                                                }, 100);
                                            } else {
                                                // 重置标志
                                                isUpdatingFromHash = false;
                                            }
                                            break;
                                        }
                                    }
                                }, 100);
                            } else {
                                // 重置标志
                                isUpdatingFromHash = false;
                            }
                            break;
                        }
                    }
                }, 100);
            } else {
                // 重置标志
                isUpdatingFromHash = false;
            }
            break;
        }
    }
    
    // 确保标志被重置（防止意外情况）
    setTimeout(() => {
        isUpdatingFromHash = false;
    }, 500);
}

// 导出函数供全局使用
window.openReportModal = openReportModal;
window.closeReportModal = closeReportModal;



// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化基础功能
    initScrollAnimations();
    initTabs();
    initReportCards();
    initSearch();
    initNavbarScroll();
    
    // 初始化分类功能
    initMainTabs();
    initIndustryTabs();
    
    // 初始化报告管理器
    if (window.ReportsManager) {
        window.ReportsManager.renderReports('reports-container');
        console.log('Reports Manager initialized successfully');
    } else {
        console.warn('Reports Manager not available');
    }
    
    // 从URL hash恢复状态
    setTimeout(restoreFromURLHash, 100);
    
    // 监听hash变化
    window.addEventListener('hashchange', restoreFromURLHash);
});