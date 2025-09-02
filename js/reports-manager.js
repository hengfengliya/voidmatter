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
    },
    // 新增投研报告
    {
        id: 'biological-pharmaceuticals-2025',
        title: '创新驱动：驾驭全球生物制药行业的结构性变革与价值解锁',
        publishDate: '2025-07-02',
        tags: ['生物制药', '创新驱动', '价值解锁'],
        preview: '深度解析全球生物制药行业的创新驱动模式，剖析结构性变革对产业格局的重塑，识别价值投资机会与风险因素。',
        viewCount: 4200,
        downloadCount: 920,
        rating: 4.9,
        filePath: 'industry-reports/352010生物药品行业研究报告_20250702.html',
        classification: {
            industry: '医药卫生',
            subIndustry: '医药',
            thirdLevel: '生物药品',
            fourthLevel: ''
        }
    },
    {
        id: 'industrial-metals-2025',
        title: '全球工业金属行业深度分析报告',
        publishDate: '2025-07-03',
        tags: ['工业金属', '供需分析', '价格预测'],
        preview: '全面分析全球工业金属市场供需格局，深入探讨铜、铝、锌等核心品种的基本面变化，为投资决策提供专业指导。',
        viewCount: 3800,
        downloadCount: 820,
        rating: 4.8,
        filePath: 'industry-reports/152010工业金属行业研究报告_20250703.html',
        classification: {
            industry: '原材料',
            subIndustry: '有色金属',
            thirdLevel: '工业金属',
            fourthLevel: ''
        }
    },
    {
        id: 'rare-metals-2025',
        title: '稀有金属行业深度研究报告',
        publishDate: '2025-07-04',
        tags: ['稀有金属', '战略资源', '供应链'],
        preview: '深度研究稀土、钨、锂等稀有金属的战略价值，分析全球供应链格局与产业政策影响，把握新能源时代的投资机遇。',
        viewCount: 3600,
        downloadCount: 780,
        rating: 4.8,
        filePath: 'industry-reports/152030稀有金属行业研究报告_20250704.html',
        classification: {
            industry: '原材料',
            subIndustry: '有色金属',
            thirdLevel: '稀有金属',
            fourthLevel: ''
        }
    },
    {
        id: 'precious-metals-2025',
        title: '贵金属行业深度研究报告',
        publishDate: '2025-07-05',
        tags: ['贵金属', '避险属性', '投资价值'],
        preview: '系统分析黄金、白银、铂族金属的投资价值与避险属性，解读货币政策对贵金属价格的影响机制。',
        viewCount: 4100,
        downloadCount: 950,
        rating: 4.9,
        filePath: 'industry-reports/152020贵金属行业研究报告_20250705.html',
        classification: {
            industry: '原材料',
            subIndustry: '有色金属',
            thirdLevel: '贵金属',
            fourthLevel: ''
        }
    },
    {
        id: 'steel-industry-2025',
        title: '钢铁行业深度研究报告',
        publishDate: '2025-07-06',
        tags: ['钢铁', '产能优化', '绿色转型'],
        preview: '全面解析钢铁行业产能优化与绿色转型趋势，评估供给侧改革成效，预测行业盈利能力变化。',
        viewCount: 3200,
        downloadCount: 680,
        rating: 4.7,
        filePath: 'industry-reports/153010钢铁行业研究报告_20250706.html',
        classification: {
            industry: '原材料',
            subIndustry: '钢铁',
            thirdLevel: '钢铁',
            fourthLevel: ''
        }
    },
    {
        id: 'construction-materials-2025',
        title: '建筑材料行业深度研究报告',
        publishDate: '2025-07-08',
        tags: ['建筑材料', '基建投资', '绿色建筑'],
        preview: '深入研究水泥、玻璃、建筑钢材等核心建筑材料的市场前景，分析基建投资与绿色建筑发展对行业的推动作用。',
        viewCount: 2900,
        downloadCount: 620,
        rating: 4.6,
        filePath: 'industry-reports/154010建筑材料行业研究报告_20250708.html',
        classification: {
            industry: '原材料',
            subIndustry: '非金属材料',
            thirdLevel: '建筑材料',
            fourthLevel: ''
        }
    },
    {
        id: 'paper-forestry-2025',
        title: '纸类与林业产品行业研究报告',
        publishDate: '2025-07-14',
        tags: ['纸类产品', '林业资源', '环保政策'],
        preview: '分析纸类产品与林业资源的可持续发展模式，探讨环保政策对行业结构的重塑作用。',
        viewCount: 2200,
        downloadCount: 480,
        rating: 4.5,
        filePath: 'industry-reports/155020纸类与林业产品行业研究报告_20250714.html',
        classification: {
            industry: '原材料',
            subIndustry: '造纸与包装',
            thirdLevel: '纸类与林业产品',
            fourthLevel: ''
        }
    },
    {
        id: 'aerospace-2025',
        title: '航空航天行业研究报告',
        publishDate: '2025-07-13',
        tags: ['航空航天', '技术创新', '国防军工'],
        preview: '深度剖析航空航天产业的技术创新路径，评估军民融合发展机遇，前瞻产业投资价值。',
        viewCount: 3500,
        downloadCount: 750,
        rating: 4.8,
        filePath: 'industry-reports/201010航空航天行业研究报告_20250713.html',
        classification: {
            industry: '工业',
            subIndustry: '航空航天与国防',
            thirdLevel: '航空航天',
            fourthLevel: ''
        }
    },
    {
        id: 'defense-equipment-2025',
        title: '国防装备行业研究报告',
        publishDate: '2025-07-12',
        tags: ['国防装备', '军工产业', '技术升级'],
        preview: '系统研究国防装备现代化进程，分析军工产业链投资机会与技术升级趋势。',
        viewCount: 3300,
        downloadCount: 720,
        rating: 4.7,
        filePath: 'industry-reports/201020国防装备行业研究报告_20250712.html',
        classification: {
            industry: '工业',
            subIndustry: '航空航天与国防',
            thirdLevel: '国防装备',
            fourthLevel: ''
        }
    },
    {
        id: 'construction-engineering-2025',
        title: '建筑与工程行业研究报告',
        publishDate: '2025-07-09',
        tags: ['建筑工程', '基础设施', '智慧建造'],
        preview: '全面分析建筑与工程行业发展态势，探讨基础设施建设与智慧建造技术的投资前景。',
        viewCount: 2800,
        downloadCount: 580,
        rating: 4.6,
        filePath: 'industry-reports/202010建筑与工程行业研究报告_20250709.html',
        classification: {
            industry: '工业',
            subIndustry: '建筑装饰',
            thirdLevel: '建筑与工程',
            fourthLevel: ''
        }
    },
    {
        id: 'building-decoration-2025',
        title: '建筑装修行业研究报告',
        publishDate: '2025-07-11',
        tags: ['建筑装修', '消费升级', '智能家居'],
        preview: '深入研究建筑装修行业消费升级趋势，分析智能家居与绿色装修的市场机遇。',
        viewCount: 2500,
        downloadCount: 520,
        rating: 4.5,
        filePath: 'industry-reports/202020建筑装修行业研究报告_20250711.html',
        classification: {
            industry: '工业',
            subIndustry: '建筑装饰',
            thirdLevel: '建筑装修',
            fourthLevel: ''
        }
    },
    {
        id: 'building-products-2025',
        title: '建筑产品行业研究报告',
        publishDate: '2025-07-10',
        tags: ['建筑产品', '标准化', '产业链'],
        preview: '系统分析建筑产品标准化趋势，解读产业链整合对行业格局的影响。',
        viewCount: 2400,
        downloadCount: 500,
        rating: 4.4,
        filePath: 'industry-reports/202030建筑产品行业研究报告_20250710.html',
        classification: {
            industry: '工业',
            subIndustry: '建筑装饰',
            thirdLevel: '建筑产品',
            fourthLevel: ''
        }
    },
    {
        id: 'power-generation-equipment-2025',
        title: '发电设备行业研究报告',
        publishDate: '2025-07-17',
        tags: ['发电设备', '清洁能源', '技术升级'],
        preview: '深度分析传统发电设备向清洁能源转型，评估风电、光伏等新能源设备的投资价值。',
        viewCount: 3400,
        downloadCount: 740,
        rating: 4.8,
        filePath: 'industry-reports/203010发电设备行业研究报告_20250717.html',
        classification: {
            industry: '工业',
            subIndustry: '电力设备',
            thirdLevel: '发电设备',
            fourthLevel: ''
        }
    },
    {
        id: 'grid-equipment-2025',
        title: '电网设备行业研究报告',
        publishDate: '2025-07-18',
        tags: ['电网设备', '智能电网', '特高压'],
        preview: '全面研究智能电网建设对设备需求的拉动作用，分析特高压技术的产业化前景。',
        viewCount: 3100,
        downloadCount: 680,
        rating: 4.7,
        filePath: 'industry-reports/203020电网设备行业研究报告_20250718.html',
        classification: {
            industry: '工业',
            subIndustry: '电力设备',
            thirdLevel: '电网设备',
            fourthLevel: ''
        }
    },
    {
        id: 'energy-storage-equipment-2025',
        title: '储能设备行业研究报告',
        publishDate: '2025-07-16',
        tags: ['储能设备', '电化学储能', '产业爆发'],
        preview: '深入分析储能设备产业爆发式增长动力，解读电化学储能技术路线与投资机遇。',
        viewCount: 4000,
        downloadCount: 890,
        rating: 4.9,
        filePath: 'industry-reports/203030储能设备行业研究报告_20250716.html',
        classification: {
            industry: '工业',
            subIndustry: '电力设备',
            thirdLevel: '储能设备',
            fourthLevel: ''
        }
    },
    {
        id: 'general-machinery-2025',
        title: '通用机械行业研究报告',
        publishDate: '2025-07-19',
        tags: ['通用机械', '制造升级', '自动化'],
        preview: '系统研究通用机械行业制造升级趋势，分析自动化技术对产业结构的重塑作用。',
        viewCount: 2700,
        downloadCount: 560,
        rating: 4.6,
        filePath: 'industry-reports/204010通用机械行业研究报告_20250719.html',
        classification: {
            industry: '工业',
            subIndustry: '机械制造',
            thirdLevel: '通用机械',
            fourthLevel: ''
        }
    },
    {
        id: 'specialized-machinery-2025',
        title: '专用机械行业研究报告',
        publishDate: '2025-07-22',
        tags: ['专用机械', '定制化', '技术壁垒'],
        preview: '深度分析专用机械的定制化发展模式，评估技术壁垒构建的竞争优势。',
        viewCount: 2600,
        downloadCount: 540,
        rating: 4.5,
        filePath: 'industry-reports/204020专用机械行业研究报告_20250722.html',
        classification: {
            industry: '工业',
            subIndustry: '机械制造',
            thirdLevel: '专用机械',
            fourthLevel: ''
        }
    },
    {
        id: 'transportation-equipment-2025',
        title: '交通运输设备行业研究报告',
        publishDate: '2025-07-23',
        tags: ['交通运输设备', '新能源汽车', '智能交通'],
        preview: '全面解析交通运输设备电动化、智能化发展趋势，前瞻新能源汽车产业链投资价值。',
        viewCount: 3600,
        downloadCount: 790,
        rating: 4.8,
        filePath: 'industry-reports/204030交通运输设备行业研究报告_20250723.html',
        classification: {
            industry: '工业',
            subIndustry: '机械制造',
            thirdLevel: '交通运输设备',
            fourthLevel: ''
        }
    },
    {
        id: 'industrial-conglomerates-2025',
        title: '工业集团企业行业研究报告',
        publishDate: '2025-07-24',
        tags: ['工业集团', '多元化', '协同效应'],
        preview: '深入研究工业集团企业多元化经营模式，分析业务协同效应与价值创造路径。',
        viewCount: 2300,
        downloadCount: 480,
        rating: 4.4,
        filePath: 'industry-reports/204040工业集团企业行业研究报告_20250724.html',
        classification: {
            industry: '工业',
            subIndustry: '机械制造',
            thirdLevel: '工业集团企业',
            fourthLevel: ''
        }
    },
    {
        id: 'pollution-control-2025',
        title: '污染治理行业研究报告',
        publishDate: '2025-07-25',
        tags: ['污染治理', '环保政策', '绿色发展'],
        preview: '系统分析污染治理行业政策驱动与市场化发展，评估环保产业投资机遇。',
        viewCount: 3000,
        downloadCount: 640,
        rating: 4.7,
        filePath: 'industry-reports/205010污染治理行业研究报告_20250725.html',
        classification: {
            industry: '工业',
            subIndustry: '环保',
            thirdLevel: '污染治理',
            fourthLevel: ''
        }
    },
    {
        id: 'energy-conservation-ecological-restoration-2025',
        title: '节能与生态修复行业研究报告',
        publishDate: '2025-07-15',
        tags: ['节能', '生态修复', '可持续发展'],
        preview: '深度研究节能技术与生态修复产业的协同发展，分析可持续发展理念下的投资价值。',
        viewCount: 2800,
        downloadCount: 600,
        rating: 4.6,
        filePath: 'industry-reports/205020节能与生态修复行业研究报告_20250715.html',
        classification: {
            industry: '工业',
            subIndustry: '环保',
            thirdLevel: '节能与生态修复',
            fourthLevel: ''
        }
    },
    {
        id: 'commercial-services-supplies-2025',
        title: '商业服务与用品行业研究报告',
        publishDate: '2025-07-20',
        tags: ['商业服务', '用品供应', '数字化转型'],
        preview: '全面分析商业服务与用品行业数字化转型趋势，探讨服务模式创新带来的投资机会。',
        viewCount: 2500,
        downloadCount: 520,
        rating: 4.5,
        filePath: 'industry-reports/206010商业服务与用品行业研究报告_20250720.html',
        classification: {
            industry: '工业',
            subIndustry: '商业服务与用品',
            thirdLevel: '商业服务与用品',
            fourthLevel: ''
        }
    },
    // 8月新增报告 - 按日期分布
    {
        id: 'transportation-industry-2025-08-01',
        title: '全球运输行业深度研究报告',
        publishDate: '2025-08-01',
        tags: ['运输行业', '物流升级', '智能运输'],
        preview: '深度解析全球运输行业转型升级趋势，从海运、空运到陆运的全链条分析，重点关注智能运输技术革新与供应链重构。',
        viewCount: 2800,
        downloadCount: 620,
        rating: 4.7,
        filePath: 'industry-reports/207010运输业行业研究报告_20250825.html',
        classification: {
            industry: '工业',
            subIndustry: '交通运输',
            thirdLevel: '运输业',
            fourthLevel: ''
        }
    },
    {
        id: 'transportation-infrastructure-2025-08-02',
        title: '交通基础设施行业研究报告',
        publishDate: '2025-08-02',
        tags: ['基础设施', '交通建设', '智慧交通'],
        preview: '系统研究交通基础设施建设投资机会，分析高铁、城轨、智慧交通等细分领域的发展前景与投资价值。',
        viewCount: 3200,
        downloadCount: 720,
        rating: 4.8,
        filePath: 'industry-reports/207020交通基础设施行业研究报告_20250825.html',
        classification: {
            industry: '工业',
            subIndustry: '交通运输',
            thirdLevel: '交通基本设施',
            fourthLevel: ''
        }
    },
    {
        id: 'passenger-vehicles-2025-08-03',
        title: '乘用车行业深度研究报告',
        publishDate: '2025-08-03',
        tags: ['乘用车', '新能源汽车', '智能驾驶'],
        preview: '全面剖析乘用车行业电动化、智能化发展趋势，重点分析新能源汽车产业链投资机会与竞争格局演变。',
        viewCount: 4100,
        downloadCount: 950,
        rating: 4.9,
        filePath: 'industry-reports/251020乘用车行业研究报告_20250825.html',
        classification: {
            industry: '可选消费',
            subIndustry: '乘用车及零部件',
            thirdLevel: '乘用车',
            fourthLevel: ''
        }
    },
    {
        id: 'auto-dealers-services-2025-08-04',
        title: '汽车经销商与汽车服务行业研究报告',
        publishDate: '2025-08-04',
        tags: ['汽车经销', '汽车服务', '后市场'],
        preview: '深入研究汽车经销与服务行业转型升级，分析新零售模式、售后服务数字化等新兴商业模式的投资价值。',
        viewCount: 2900,
        downloadCount: 650,
        rating: 4.6,
        filePath: 'industry-reports/251040汽车经销商与汽车服务行业研究报告_20250825.html',
        classification: {
            industry: '可选消费',
            subIndustry: '乘用车及零部件',
            thirdLevel: '汽车经销商与汽车服务',
            fourthLevel: ''
        }
    },
    {
        id: 'home-appliances-2025-08-05',
        title: '家用电器行业研究报告',
        publishDate: '2025-08-05',
        tags: ['家用电器', '智能家居', '消费升级'],
        preview: '系统分析家用电器行业智能化升级趋势，探讨高端家电、智能家居生态的市场机遇与投资前景。',
        viewCount: 3500,
        downloadCount: 780,
        rating: 4.8,
        filePath: 'industry-reports/252010家用电器行业研究报告_20250825.html',
        classification: {
            industry: '可选消费',
            subIndustry: '耐用消费品',
            thirdLevel: '家用电器',
            fourthLevel: ''
        }
    },
    {
        id: 'home-furnishings-2025-08-06',
        title: '家居行业深度研究报告',
        publishDate: '2025-08-06',
        tags: ['家居产业', '定制家具', '家装一体化'],
        preview: '全面解析家居行业定制化、智能化发展趋势，重点关注定制家具、整装模式的市场空间与盈利模式创新。',
        viewCount: 2700,
        downloadCount: 580,
        rating: 4.5,
        filePath: 'industry-reports/252020家居行业研究报告_20250825.html',
        classification: {
            industry: '可选消费',
            subIndustry: '耐用消费品',
            thirdLevel: '家居',
            fourthLevel: ''
        }
    },
    {
        id: 'leisure-equipment-supplies-2025-08-07',
        title: '休闲设备与用品行业研究报告',
        publishDate: '2025-08-07',
        tags: ['休闲用品', '户外运动', '体育产业'],
        preview: '深度研究休闲设备与用品行业消费升级趋势，分析户外运动、体育用品等细分市场的增长潜力。',
        viewCount: 2300,
        downloadCount: 490,
        rating: 4.4,
        filePath: 'industry-reports/252030休闲设备与用品行业研究报告_20250825.html',
        classification: {
            industry: '可选消费',
            subIndustry: '耐用消费品',
            thirdLevel: '休闲设备与用品',
            fourthLevel: ''
        }
    },
    {
        id: 'textile-apparel-2025-08-08',
        title: '纺织服装行业深度研究报告',
        publishDate: '2025-08-08',
        tags: ['纺织服装', '快时尚', '可持续时尚'],
        preview: '全面分析纺织服装行业可持续发展趋势，探讨快时尚向可持续时尚转型的投资机会与行业重塑。',
        viewCount: 3100,
        downloadCount: 690,
        rating: 4.7,
        filePath: 'industry-reports/253010纺织服装行业研究报告_20250825.html',
        classification: {
            industry: '可选消费',
            subIndustry: '纺织服装与珠宝',
            thirdLevel: '纺织服装',
            fourthLevel: ''
        }
    },
    {
        id: 'jewelry-luxury-2025-08-09',
        title: '珠宝与奢侈品行业研究报告',
        publishDate: '2025-08-09',
        tags: ['珠宝奢侈品', '高端消费', '品牌价值'],
        preview: '系统研究珠宝与奢侈品行业高端消费趋势，分析品牌价值构建、消费者代际变化对行业格局的影响。',
        viewCount: 2600,
        downloadCount: 560,
        rating: 4.6,
        filePath: 'industry-reports/253020珠宝与奢侈品行业研究报告_20250825.html',
        classification: {
            industry: '可选消费',
            subIndustry: '纺织服装与珠宝',
            thirdLevel: '珠宝与奢侈品',
            fourthLevel: ''
        }
    },
    {
        id: 'leisure-services-2025-08-10',
        title: '休闲服务行业深度研究报告',
        publishDate: '2025-08-10',
        tags: ['休闲服务', '文旅消费', '体验经济'],
        preview: '深入分析休闲服务行业复苏态势，重点关注文旅消费、体验经济等新兴服务模式的市场前景。',
        viewCount: 2800,
        downloadCount: 610,
        rating: 4.5,
        filePath: 'industry-reports/254010休闲服务行业研究报告_20250825.html',
        classification: {
            industry: '可选消费',
            subIndustry: '消费者服务',
            thirdLevel: '休闲服务',
            fourthLevel: ''
        }
    },
    {
        id: 'education-services-2025-08-11',
        title: '教育服务行业研究报告',
        publishDate: '2025-08-11',
        tags: ['教育服务', '在线教育', '职业教育'],
        preview: '全面解析教育服务行业政策调整后的发展机遇，重点分析职业教育、成人教育等细分领域的投资价值。',
        viewCount: 3400,
        downloadCount: 750,
        rating: 4.8,
        filePath: 'industry-reports/254020教育服务行业研究报告_20250825.html',
        classification: {
            industry: '可选消费',
            subIndustry: '消费者服务',
            thirdLevel: '教育服务',
            fourthLevel: ''
        }
    },
    {
        id: 'general-retail-2025-08-12',
        title: '一般零售行业深度研究报告',
        publishDate: '2025-08-12',
        tags: ['零售行业', '新零售', '全渠道'],
        preview: '系统研究零售行业数字化转型趋势，分析新零售模式、全渠道融合对传统零售业态的重塑作用。',
        viewCount: 3600,
        downloadCount: 820,
        rating: 4.9,
        filePath: 'industry-reports/255010一般零售行业研究报告_20250825.html',
        classification: {
            industry: '可选消费',
            subIndustry: '零售业',
            thirdLevel: '一般零售',
            fourthLevel: ''
        }
    },
    {
        id: 'specialty-retail-2025-08-13',
        title: '专营零售行业研究报告',
        publishDate: '2025-08-13',
        tags: ['专营零售', '细分市场', '专业化'],
        preview: '深入分析专营零售行业专业化发展模式，探讨细分市场深耕、专业服务升级的竞争优势构建。',
        viewCount: 2500,
        downloadCount: 530,
        rating: 4.4,
        filePath: 'industry-reports/255020专营零售行业研究报告_20250825.html',
        classification: {
            industry: '可选消费',
            subIndustry: '零售业',
            thirdLevel: '专营零售',
            fourthLevel: ''
        }
    },
    {
        id: 'tourism-retail-2025-08-14',
        title: '旅游零售行业研究报告',
        publishDate: '2025-08-14',
        tags: ['旅游零售', '免税购物', '跨境消费'],
        preview: '全面研究旅游零售行业复苏前景，重点分析免税购物、跨境消费等高增长细分领域的投资机遇。',
        viewCount: 2900,
        downloadCount: 640,
        rating: 4.6,
        filePath: 'industry-reports/255030旅游零售行业研究报告_20250825.html',
        classification: {
            industry: '可选消费',
            subIndustry: '零售业',
            thirdLevel: '旅游零售',
            fourthLevel: ''
        }
    },
    {
        id: 'internet-retail-2025-08-15',
        title: '互联网零售行业深度研究报告',
        publishDate: '2025-08-15',
        tags: ['电商零售', '直播带货', '社交电商'],
        preview: '深度解析互联网零售行业创新发展趋势，重点关注直播带货、社交电商等新兴模式的盈利能力与成长空间。',
        viewCount: 4200,
        downloadCount: 980,
        rating: 4.9,
        filePath: 'industry-reports/255040互联网零售行业研究报告_20250825.html',
        classification: {
            industry: '可选消费',
            subIndustry: '零售业',
            thirdLevel: '互联网零售',
            fourthLevel: ''
        }
    },
    {
        id: 'alcoholic-beverages-2025-08-16',
        title: '酒类行业深度研究报告',
        publishDate: '2025-08-16',
        tags: ['酒类行业', '高端白酒', '消费升级'],
        preview: '系统分析酒类行业高端化发展趋势，深入研究白酒、啤酒、葡萄酒等细分品类的市场格局与投资价值。',
        viewCount: 3800,
        downloadCount: 860,
        rating: 4.8,
        filePath: 'industry-reports/301010酒行业研究报告_20250825.html',
        classification: {
            industry: '主要消费',
            subIndustry: '食品、饮料与烟草',
            thirdLevel: '酒',
            fourthLevel: ''
        }
    },
    {
        id: 'soft-drinks-2025-08-17',
        title: '软饮料行业研究报告',
        publishDate: '2025-08-17',
        tags: ['软饮料', '功能饮料', '健康饮品'],
        preview: '全面研究软饮料行业健康化转型趋势，分析功能饮料、低糖饮品等细分市场的增长潜力与竞争格局。',
        viewCount: 3300,
        downloadCount: 740,
        rating: 4.7,
        filePath: 'industry-reports/301020软饮料行业研究报告_20250825.html',
        classification: {
            industry: '主要消费',
            subIndustry: '食品、饮料与烟草',
            thirdLevel: '软饮料',
            fourthLevel: ''
        }
    },
    {
        id: 'food-industry-2025-08-18',
        title: '食品行业深度研究报告',
        publishDate: '2025-08-18',
        tags: ['食品行业', '休闲食品', '预制菜'],
        preview: '深入分析食品行业消费升级与便利化趋势，重点关注休闲食品、预制菜等新兴品类的市场机遇。',
        viewCount: 3700,
        downloadCount: 830,
        rating: 4.8,
        filePath: 'industry-reports/301030食品行业研究报告_20250825.html',
        classification: {
            industry: '主要消费',
            subIndustry: '食品、饮料与烟草',
            thirdLevel: '食品',
            fourthLevel: ''
        }
    },
    {
        id: 'tobacco-industry-2025-08-19',
        title: '烟草行业研究报告',
        publishDate: '2025-08-19',
        tags: ['烟草行业', '新型烟草', '电子烟'],
        preview: '系统研究烟草行业结构性变革，分析传统烟草与新型烟草制品的市场竞争格局与监管政策影响。',
        viewCount: 2800,
        downloadCount: 620,
        rating: 4.5,
        filePath: 'industry-reports/301040烟草行业研究报告_20250825.html',
        classification: {
            industry: '主要消费',
            subIndustry: '食品、饮料与烟草',
            thirdLevel: '烟草',
            fourthLevel: ''
        }
    },
    {
        id: 'planting-industry-2025-08-20',
        title: '种植行业深度研究报告',
        publishDate: '2025-08-20',
        tags: ['种植行业', '现代农业', '种业创新'],
        preview: '全面解析种植行业现代化升级趋势，重点关注种业科技创新、精准农业等新兴技术的产业化前景。',
        viewCount: 3200,
        downloadCount: 710,
        rating: 4.7,
        filePath: 'industry-reports/302010种植行业研究报告_20250825.html',
        classification: {
            industry: '主要消费',
            subIndustry: '农牧渔',
            thirdLevel: '种植',
            fourthLevel: ''
        }
    },
    {
        id: 'breeding-industry-2025-08-21',
        title: '养殖行业研究报告',
        publishDate: '2025-08-21',
        tags: ['养殖行业', '规模化养殖', '生物技术'],
        preview: '深度分析养殖行业规模化、标准化发展模式，探讨生物技术在养殖效率提升中的应用价值。',
        viewCount: 3400,
        downloadCount: 760,
        rating: 4.8,
        filePath: 'industry-reports/302020养殖行业研究报告_20250825.html',
        classification: {
            industry: '主要消费',
            subIndustry: '农牧渔',
            thirdLevel: '养殖',
            fourthLevel: ''
        }
    },
    {
        id: 'household-products-2025-08-22',
        title: '家庭用品行业深度研究报告',
        publishDate: '2025-08-22',
        tags: ['家庭用品', '日用消费', '品牌升级'],
        preview: '系统研究家庭用品行业品牌化、高端化发展趋势，分析消费者需求变化对产品创新的推动作用。',
        viewCount: 2900,
        downloadCount: 650,
        rating: 4.6,
        filePath: 'industry-reports/303010家庭用品行业研究报告_20250825.html',
        classification: {
            industry: '主要消费',
            subIndustry: '家庭与个人用品',
            thirdLevel: '家庭用品',
            fourthLevel: ''
        }
    },
    {
        id: 'beauty-personal-care-2025-08-23',
        title: '美容护理行业研究报告',
        publishDate: '2025-08-23',
        tags: ['美容护理', '护肤品', '新消费品牌'],
        preview: '全面分析美容护理行业消费升级与品牌分化趋势，重点关注功效性护肤、新兴品牌的市场突破路径。',
        viewCount: 3600,
        downloadCount: 800,
        rating: 4.8,
        filePath: 'industry-reports/303020美容护理行业研究报告_20250825.html',
        classification: {
            industry: '主要消费',
            subIndustry: '家庭与个人用品',
            thirdLevel: '美容护理',
            fourthLevel: ''
        }
    },
    {
        id: 'medical-devices-2025-08-24',
        title: '医疗器械行业深度研究报告',
        publishDate: '2025-08-24',
        tags: ['医疗器械', '创新医疗', '智能诊断'],
        preview: '深度解析医疗器械行业创新发展趋势，重点分析高值耗材、智能诊断设备等高增长细分领域的投资价值。',
        viewCount: 4000,
        downloadCount: 920,
        rating: 4.9,
        filePath: 'industry-reports/351010医疗器械行业研究报告_20250825.html',
        classification: {
            industry: '医药卫生',
            subIndustry: '医疗',
            thirdLevel: '医疗器械',
            fourthLevel: ''
        }
    },
    {
        id: 'medical-commerce-services-2025-08-25',
        title: '医疗商业与服务行业研究报告',
        publishDate: '2025-08-25',
        tags: ['医疗服务', '医药流通', '数字医疗'],
        preview: '系统研究医疗商业与服务行业数字化转型，分析医药流通、互联网医疗等新兴模式的盈利前景。',
        viewCount: 3500,
        downloadCount: 780,
        rating: 4.8,
        filePath: 'industry-reports/351020医疗商业与服务行业研究报告_20250825.html',
        classification: {
            industry: '医药卫生',
            subIndustry: '医疗',
            thirdLevel: '医疗商业与服务',
            fourthLevel: ''
        }
    },
    {
        id: 'chemical-pharmaceuticals-2025-08-26',
        title: '化学药行业深度研究报告',
        publishDate: '2025-08-26',
        tags: ['化学药', '创新药', '集采政策'],
        preview: '全面分析化学药行业在集采政策下的结构性机遇，重点关注创新药研发、高端仿制药等细分领域的投资价值。',
        viewCount: 3800,
        downloadCount: 850,
        rating: 4.8,
        filePath: 'industry-reports/352020化学药行业研究报告_20250825.html',
        classification: {
            industry: '医药卫生',
            subIndustry: '医药',
            thirdLevel: '化学药',
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
 * 报告排序函数
 */
function sortReports(reports, sortBy = 'date', order = 'desc') {
    const sortedReports = [...reports];
    
    sortedReports.sort((a, b) => {
        let valueA, valueB;
        
        switch (sortBy) {
            case 'date':
                valueA = new Date(a.publishDate);
                valueB = new Date(b.publishDate);
                break;
            case 'title':
                valueA = a.title.toLowerCase();
                valueB = b.title.toLowerCase();
                break;
            case 'views':
                valueA = a.viewCount || 0;
                valueB = b.viewCount || 0;
                break;
            case 'downloads':
                valueA = a.downloadCount || 0;
                valueB = b.downloadCount || 0;
                break;
            case 'rating':
                valueA = a.rating || 0;
                valueB = b.rating || 0;
                break;
            default:
                valueA = new Date(a.publishDate);
                valueB = new Date(b.publishDate);
        }
        
        if (order === 'desc') {
            return valueB > valueA ? 1 : valueB < valueA ? -1 : 0;
        } else {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        }
    });
    
    return sortedReports;
}

/**
 * 渲染所有报告到指定容器
 */
function renderReports(containerId = 'reports-container', sortBy = 'date', order = 'desc') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id '${containerId}' not found`);
        return;
    }
    
    // 按日期倒序排序报告
    const sortedReports = sortReports(reportsDatabase, sortBy, order);
    const reportsHTML = sortedReports.map(report => generateReportCard(report)).join('');
    container.innerHTML = reportsHTML;
}

/**
 * 根据分类筛选报告
 */
function filterReports(industry, subIndustry = '', thirdLevel = '', fourthLevel = '') {
    return reportsDatabase.filter(report => {
        if (industry === '全部' || !industry) return true;
        
        const { classification } = report;
        
        // 使用通用匹配逻辑
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
 * 通用分类匹配函数：检查报告是否匹配选择的分类路径
 */
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

/**
 * 渲染筛选后的报告
 */
function renderFilteredReports(containerId, industry, subIndustry = '', thirdLevel = '', fourthLevel = '', sortBy = 'date', order = 'desc') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const filteredReports = filterReports(industry, subIndustry, thirdLevel, fourthLevel);
    
    // 按指定方式排序
    const sortedReports = sortReports(filteredReports, sortBy, order);
    const reportsHTML = sortedReports.map(report => generateReportCard(report)).join('');
    
    if (sortedReports.length === 0) {
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
    
    return sortedReports.length;
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

/**
 * 获取按日期分组的报告
 */
function getReportsByDateRange(startDate, endDate) {
    return reportsDatabase.filter(report => {
        const reportDate = new Date(report.publishDate);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return reportDate >= start && reportDate <= end;
    });
}

/**
 * 获取8月新增报告
 */
function getAugustReports() {
    return getReportsByDateRange('2025-08-01', '2025-08-31');
}

// 导出函数供全局使用
if (typeof window !== 'undefined') {
    window.ReportsManager = {
        renderReports,
        renderFilteredReports,
        filterReports,
        sortReports,
        addReport,
        getAllReports,
        getReportById,
        generateReportCard,
        formatPublishDate,
        formatNumber,
        getReportsByDateRange,
        getAugustReports
    };
    
    // 暴露报告数据库供认证系统使用
    window.reportsDatabase = reportsDatabase;
} 