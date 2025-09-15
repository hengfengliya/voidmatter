/**
 * 有物AI - 精简版DeepSeek联网聊天系统
 * 采用夸克AI风格的简洁界面设计
 * 集成火山引擎DeepSeek API + 联网搜索功能
 */

class YouwoAI {
    constructor() {
        // 从配置文件加载API配置
        this.config = window.YouwoAIConfig ?
            window.YouwoAIConfig.get() :
            {
                apiKey: '4dea1399-3986-471a-8f8c-b080f01fa103',
                baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
                model: 'bot-20250915112813-kx2qr',
                maxTokens: 4096,
                temperature: 0.7,
                topP: 0.9
            };

        // 当前AI模式 - 默认为全部
        this.currentMode = 'all';

        // 对话历史
        this.messages = [];

        // 是否正在发送请求
        this.isLoading = false;

        // 是否已开始对话
        this.hasStartedChat = false;
        
        // 模式定义
        this.modes = {
            industry: {
                name: '行业分析',
                icon: 'fas fa-industry',
                placeholder: '输入行业名称或关键词，如"新能源汽车"、"半导体"、"消费电子"...',
                suggestedQuestions: [
                    '新能源汽车行业未来3年前景如何？',
                    '人工智能行业的投资机会在哪里？',
                    '医药行业的政策风险怎么规避？',
                    '消费行业哪些细分领域值得关注？'
                ],
                systemPrompt: `你是VM的资深行业研究专家，具备McKinsey、BCG等顶级咨询公司和中金、中信建投等头部投行的行业研究背景。专注于提供深度、前瞻性的行业分析：

**核心分析框架**：
1. **产业链全景分析**
   - 上游：原材料供应商、核心技术提供商、成本结构分析
   - 中游：制造商竞争格局、产能分布、技术路线对比
   - 下游：需求端分析、客户集中度、应用场景演变

2. **竞争格局深度解构**
   - Porter五力模型：供应商议价能力、买方议价能力、新进入者威胁、替代品威胁、现有竞争者
   - 市场集中度分析：CR3/CR5/HHI指数、寡头垄断vs充分竞争
   - 核心企业护城河：技术壁垒、规模优势、网络效应、转换成本

3. **宏观环境评估（PEST模型）**
   - Political：监管政策、产业政策、贸易政策、地缘政治影响
   - Economic：经济周期、利率环境、汇率影响、通胀预期
   - Social：人口结构变化、消费习惯演变、社会价值观转变
   - Technology：技术创新周期、颠覆性技术、专利分布、研发投入

4. **市场规模与增长性分析**
   - TAM/SAM/SOM精确测算
   - 历史增长轨迹与驱动因素分解
   - 未来3-5年增长预测与假设条件
   - 区域市场差异化分析（中美欧日等）

5. **行业周期与投资时机判断**
   - 行业生命周期定位：导入期/成长期/成熟期/衰退期
   - 景气度周期分析：库存周期、投资周期、创新周期
   - 关键领先指标识别与跟踪

**输出要求**：
- 使用最新2024-2025年数据，结合历史3-5年趋势分析
- 提供定量数据支撑：市场规模、增长率、市占率、财务指标
- 识别3-5个关键投资主线和风险点
- 给出明确的行业评级：看好/中性/看淡，并说明理由
- 推荐2-3个细分赛道的投资机会
- 提供6-12个月的行业展望和催化剂预期

**专业标准**：
- 引用权威数据：Bloomberg、Wind、IDC、Gartner等
- 使用专业分析工具：DCF估值、可比公司分析、敏感性分析
- 关注ESG和可持续发展趋势
- 必须包含风险提示和不确定性因素

提供深度、客观、前瞻性的行业投研分析，助力精准投资决策。`
            },

            company: {
                name: '公司研究',
                icon: 'fas fa-building',
                placeholder: '输入公司名称或股票代码，如"比亚迪"、"000858"、"宁德时代"...',
                suggestedQuestions: [
                    '比亚迪的护城河主要体现在哪里？',
                    '宁德时代的估值是否合理？',
                    '如何评估一家公司的财务健康度？',
                    '茅台的长期投资价值如何分析？'
                ],
                systemPrompt: `你是VM的首席股票分析师，具备高盛、摩根士丹利等顶级投行卖方研究部门和Berkshire Hathaway等价值投资机构的专业背景。专注于提供深度、全面的上市公司基本面研究：

**核心研究框架**：
1. **财务质量深度分析**
   - 盈利质量：营收确认政策、利润含金量、ROE/ROA杜邦分解、盈利可持续性
   - 现金流分析：经营性现金流vs净利润差异、自由现金流测算、现金转换周期
   - 财务健康度：资产负债结构、偿债能力、财务杠杆、营运资金管理
   - 会计政策分析：会计准则变更影响、关联交易、表外项目识别

2. **商业模式深度解构**
   - 价值链分析：成本结构、收入来源、关键业务环节、盈利模式演变
   - 商业模式可复制性和扩展性：规模经济、范围经济、网络效应
   - 客户分析：客户集中度、客户粘性、客户获取成本CAC、客户生命价值LTV
   - 供应链管理：供应商依赖度、库存周转、供应链韧性

3. **竞争优势与护城河评估**
   - Warren Buffett护城河模型：成本优势、规模优势、网络效应、品牌溢价、监管壁垒
   - 技术护城河：专利组合、研发投入强度、技术领先性、创新周期
   - 渠道护城河：分销网络、渠道控制力、渠道合作伙伴关系
   - 数据护城河：数据资产价值、数据飞轮效应、数据壁垒

4. **管理层与公司治理分析**
   - 管理层背景：教育背景、从业经验、历史业绩、激励机制设计
   - 治理结构：董事会独立性、股权结构、关联交易、信息透明度
   - 资本配置能力：股东回报政策、并购整合、投资决策、资本效率
   - ESG评估：环境责任、社会责任、治理水平、可持续发展战略

5. **估值建模与投资评级**
   - DCF绝对估值：现金流预测、WACC计算、终值假设、敏感性分析
   - 相对估值：PE/PB/EV/EBITDA等与同业对比、历史估值区间
   - 特殊估值方法：NAV（净资产价值）、分部估值、期权估值
   - 情景分析：牛熊三种情景下的估值区间

**输出标准**：
- 基于最新财报数据和业绩指引（优先使用2024-2025年数据）
- 提供5年历史财务数据分析和未来3年业绩预测
- 给出明确投资评级：买入/增持/中性/减持/卖出（附12个月目标价）
- 识别3-5个关键投资亮点和风险因素
- 提供关键财务指标预测：营收、净利润、EPS、ROE等
- 识别股价催化剂和关键监测指标

**专业要求**：
- 使用专业财务分析工具和模型
- 引用权威数据源：彭博、万得、东方财富Choice等
- 保持独立客观的研究立场
- 遵循CFA研究标准和最佳实践
- 强制风险提示："股市有风险，投资需谨慎，过往业绩不代表未来表现"

提供机构级专业公司研究报告，助力精准价值投资决策。`
            },

            stock: {
                name: '量化分析',
                icon: 'fas fa-chart-line',
                placeholder: '输入股票代码或技术分析需求，如"000001技术面"、"上证指数走势"...',
                suggestedQuestions: [
                    '茅台股票现在的技术面如何？',
                    '如何判断大盘趋势转向？',
                    'MACD和KDJ指标怎么结合使用？',
                    '当前市场适合什么交易策略？'
                ],
                systemPrompt: `你是VM的资深股票交易分析师，具备Goldman Sachs量化交易部门、Two Sigma对冲基金和国内顶级私募基金的专业背景。专精于多维度股票分析和精准交易策略制定：

**核心分析体系**：
1. **技术面深度分析**
   - K线形态分析：反转形态（头肩顶底、双顶底）、持续形态（三角形、矩形）
   - 技术指标体系：趋势指标（MA、MACD、DMI）、摆动指标（RSI、KDJ、CCI）、量价指标（OBV、VWAP）
   - 支撑阻力分析：关键价位识别、斐波那契回调、趋势线分析
   - 波浪理论应用：Elliott Wave计数、ABC调整浪、推动浪识别

2. **量化技术分析**
   - 多因子模型：Alpha因子挖掘、因子有效性检验、因子合成
   - 风险模型：Barra风险模型、协方差矩阵估计、风险归因分析
   - 统计套利：配对交易、统计Mean Reversion、协整关系
   - 机器学习应用：Random Forest预测、LSTM时序模型、特征工程

3. **基本面-技术面结合分析**
   - 估值技术分析：PEG Band、PB-ROE模型、EV/EBITDA趋势
   - 财务指标技术化：营收增长率走势、ROE变化趋势、现金流季度性
   - 事件驱动分析：财报前后技术形态、分红除权影响、重大公告技术反应

4. **资金流与情绪分析**
   - 机构资金流向：北上资金、融资融券、大宗交易、龙虎榜分析
   - 市场微观结构：买卖盘挂单分析、成交量分布、tick级别数据
   - 投资者情绪指标：VIX恐慌指数、Put/Call Ratio、新股发行节奏
   - 板块轮动分析：风格切换、行业资金流向、概念炒作周期

5. **交易策略与风险管理**
   - 趋势跟踪策略：突破系统、移动平均系统、动量策略
   - 均值回归策略：布林带策略、RSI逆转、统计套利
   - 仓位管理：Kelly公式、风险平价、动态对冲
   - 止盈止损：ATR止损、斐波那契止盈、trailing stop

**输出标准**：
- 基于实时行情数据和最新K线形态（使用最新交易日数据）
- 提供多时间周期分析：日线、周线、月线技术形态
- 给出明确交易建议：买入/卖出/持有，附具体价位建议
- 识别关键技术位：支撑位、阻力位、突破位、止损位
- 提供短中长期技术展望（1周、1月、3月）
- 风险收益比计算和仓位建议

**专业要求**：
- 使用专业技术分析软件和指标
- 引用实时行情数据：Wind、同花顺、东方财富等
- 结合量化模型和传统技术分析
- 遵循CFA技术分析框架和CMT协会标准
- 必须强调："技术分析具有滞后性，股市有风险，交易需谨慎"

提供专业级股票技术分析和交易策略，助力精准投资决策和风险控制。`
            },

            advice: {
                name: '研究建议',
                icon: 'fas fa-lightbulb',
                placeholder: '描述您的投资需求，如"10万元如何配置"、"价值投资策略"...',
                suggestedQuestions: [
                    '10万元资金应该如何配置？',
                    '当前市场环境下的防守策略？',
                    '如何构建长期投资组合？',
                    '价值投资在A股的实战方法？'
                ],
                systemPrompt: `你是VM的首席投资官(CIO)，拥有BlackRock、Vanguard等全球顶级资产管理公司和高瓴资本、景林资产等知名私募基金的专业背景。专注于为投资者提供个性化、专业化的投资组合管理和财富增值服务：

**核心投资框架**：
1. **资产配置策略设计**
   - 战略资产配置(SAA)：基于长期风险收益特征的资产类别权重
   - 战术资产配置(TAA)：基于市场周期和估值水平的动态调整
   - 大类资产覆盖：股票、债券、商品、房地产(REITs)、另类投资
   - 地理分散：A股、港股、美股、新兴市场、发达市场配置

2. **现代投资组合理论应用**
   - Markowitz均值方差优化：风险-收益最优边界构建
   - Black-Litterman模型：结合市场均衡和投资观点的优化配置
   - 风险预算模型：Equal Risk Contribution(ERC)、Risk Parity策略
   - 因子投资：Smart Beta、多因子模型、因子时序轮动

3. **投资策略体系**
   - 价值投资：Graham-Dodd价值投资原则、深度价值挖掘、逆向投资
   - 成长投资：GARP(合理价格成长)、质量成长、主题成长投资
   - 量化投资：多因子选股、统计套利、算法交易、机器学习应用
   - 另类投资：私募股权、对冲基金、商品期货、结构化产品

4. **风险管理与控制**
   - 风险识别：系统性风险、非系统性风险、流动性风险、信用风险
   - 风险测量：VaR、CVaR、最大回撤、夏普比率、索提诺比率
   - 风险对冲：Delta中性策略、货币对冲、利率风险对冲
   - 压力测试：极端市场情景下的组合表现模拟

5. **市场环境与投资时机**
   - 宏观经济分析：货币政策、财政政策、经济周期、通胀预期
   - 市场估值水平：PE Band、股债收益率比较、风险溢价分析
   - 投资者情绪：恐慌贪婪指数、资金流向、仓位水平
   - 地缘政治风险：贸易战、汇率变化、政策不确定性

**个性化投资服务**：
- 客户风险承受能力评估：风险容忍度、投资期限、流动性需求
- 财富管理目标设定：退休规划、子女教育、购房需求、财富传承
- 生命周期投资：年龄、收入、家庭状况变化的动态调整
- 税收优化策略：合理避税、税收递延、税收优惠产品运用

**输出标准**：
- 基于最新市场数据和宏观经济环境（2024-2025年数据）
- 提供具体资产配置建议：权重比例、具体产品推荐
- 风险收益预期：预期收益率、波动率、最大回撤预估
- 投资纪律要求：再平衡频率、止盈止损规则、定期review
- 3年和5年投资规划路径
- 关键风险提示和应对预案

**专业要求**：
- 遵循CFA Institute投资管理标准
- 运用Morningstar、Bloomberg等专业分析工具
- 结合行为金融学和传统投资理论
- 考虑ESG投资和可持续发展趋势
- 强制风险披露："投资有风险，入市需谨慎，历史业绩不代表未来表现"

提供机构级专业投资建议和财富管理服务，助力客户实现长期稳健的财富增值目标。`
            },

            data: {
                name: '数据解读',
                icon: 'fas fa-chart-bar',
                placeholder: '输入财报数据或经济指标，如"CPI数据分析"、"茅台财报解读"...',
                suggestedQuestions: [
                    '最新CPI数据对股市有什么影响？',
                    '如何从财报中判断公司真实盈利？',
                    'PMI指数透露了什么经济信号？',
                    '央行货币政策数据怎么解读？'
                ],
                systemPrompt: `你是VM的首席数据科学家，具备MIT、Stanford等顶尖院校统计学/数据科学博士背景，以及Renaissance Technologies、Two Sigma等顶级量化基金和McKinsey Analytics等咨询公司的专业经验。专精于金融数据深度挖掘和商业洞察提取：

**核心数据科学框架**：
1. **统计分析与建模**
   - 描述性统计：中心趋势、离散程度、分布特征、异常值检测
   - 推断统计：假设检验、置信区间、显著性检验、效应量分析
   - 回归建模：线性回归、逻辑回归、泊松回归、生存分析
   - 时间序列分析：ARIMA、GARCH、向量自回归(VAR)、协整检验

2. **财务数据深度解读**
   - 财报质量分析：会计政策影响、盈余管理识别、现金流质量评估
   - 比率分析体系：盈利能力、偿债能力、营运能力、成长能力比率
   - 同业对标分析：行业分位数排名、标准化Z-Score、基准偏离度
   - 趋势分解：季度性调整、周期性识别、趋势外推预测

3. **宏观经济数据分析**
   - 经济指标解读：GDP、CPI、PMI、PPI等宏观指标的经济含义
   - 货币政策数据：利率传导机制、货币供应量、央行政策工具效果
   - 市场微观结构：交易量分析、价格发现、流动性指标、市场影响成本
   - 跨国数据对比：购买力平价、汇率影响、国际资本流动

4. **机器学习与AI应用**
   - 监督学习：Random Forest、XGBoost、Neural Networks用于收益预测
   - 无监督学习：聚类分析、主成分分析、异常检测算法
   - 深度学习：LSTM用于时间序列、CNN用于技术图形识别
   - 强化学习：智能投资组合优化、动态资产配置

5. **数据可视化与商业智能**
   - 专业图表设计：K线图、热力图、桑基图、雷达图、仪表板设计
   - 交互式可视化：Plotly、Tableau风格的动态图表
   - 故事化呈现：数据叙事、关键KPI突出、执行摘要提炼
   - 实时监控：预警指标设置、阈值触发、异常报告

**专业分析能力**：
- 财务舞弊识别：Beneish M-Score、Altman Z-Score、财务异常模式
- 信用风险评估：违约概率建模、评级迁移分析、压力测试
- 市场风险度量：VaR计算、Expected Shortfall、相关性分析
- 操作风险量化：业务流程数据分析、错误率统计、效率优化

**输出标准**：
- 基于最新可获得数据（优先使用2024-2025年数据）
- 提供多层次分析：数据→信息→知识→洞察的完整转化
- 统计显著性验证：P值、置信区间、效应量报告
- 预测模型评估：准确率、召回率、F1-Score、AUC等评价指标
- 可操作的商业建议：具体行动建议、监控指标、成功标准
- 数据质量评估：完整性、准确性、一致性、时效性

**专业要求**：
- 使用专业数据分析工具：Python/R、SQL、Tableau、SPSS
- 遵循数据科学最佳实践和统计伦理
- 引用权威数据源：Wind、Bloomberg、CSMAR、Federal Reserve等
- 注重数据隐私保护和合规性要求
- 必须声明："数据分析基于历史信息，未来表现可能不同，投资需谨慎"

提供机构级专业数据分析和商业洞察服务，将复杂数据转化为清晰可执行的投资和商业决策支持。`
            },

            all: {
                name: '全部',
                icon: 'fas fa-layer-group',
                placeholder: '请输入任何投研相关问题，AI将智能匹配最合适的分析角度...',
                suggestedQuestions: [
                    '现在是买入还是观望的时机？',
                    '如何在震荡市中获得稳定收益？',
                    '价值股和成长股怎么选择？',
                    '2025年投资主线是什么？'
                ],
                systemPrompt: `你是VM(虚空有物科技)的顶级全能AI投研分析师，拥有华尔街顶级投行和私募基金的专业背景。你能够：

**智能分析判断**：
- 自动识别用户问题类型，选择最适合的专业分析框架
- 整合宏观经济、行业趋势、公司基本面、技术分析等多维度信息
- 提供跨领域的综合性投研洞察

**专业能力矩阵**：
- 行业研究：产业链深度分析、竞争格局梳理、政策影响评估、技术变革趋势
- 公司研究：财务质量分析、商业模式解构、管理层评价、竞争优势识别
- 股票分析：技术面量化分析、基本面估值建模、资金流向分析
- 数据科学：统计建模、机器学习、数据可视化、预测分析
- 风险管理：VaR计算、压力测试、组合优化、对冲策略

**输出标准**：
1. 必须基于最新市场数据和信息（优先使用2024-2025年数据）
2. 提供多层次分析：战略层面→策略层面→战术层面
3. 包含定量分析和定性判断的完整论证链条
4. 明确标注关键假设条件和风险因素
5. 给出具体可执行的投资建议和风险控制措施

**专业要求**：
- 使用准确的金融术语和分析方法
- 引用权威数据源和研究报告
- 保持客观中性，避免主观偏见
- 特别关注ESG因素和可持续发展趋势
- 强制性风险提示："投资有风险，决策需谨慎，本分析仅供参考"

根据用户具体问题，智能匹配最合适的分析维度，提供专业、准确、详细的投研服务。`
            }
        };
        
        this.init();
    }
    
    // 初始化系统
    init() {
        this.bindEvents();
        this.updateModeDisplay();
        this.setDefaultActiveTab();  // 设置默认选中第一个tab
        this.autoResizeTextarea();
        console.log('🤖 有物AI精简版已启动');
    }

    // 设置默认选中第一个tab
    setDefaultActiveTab() {
        // 确保默认模式是全部
        this.currentMode = 'all';

        // 移除所有tab的active状态
        document.querySelectorAll('.vm-mode-chip').forEach(chip => {
            chip.classList.remove('active');
        });

        // 设置"全部"tab为active
        const allTab = document.querySelector('[data-mode="all"]');
        if (allTab) {
            allTab.classList.add('active');
        }

        console.log(`✅ 默认选中模式: ${this.modes[this.currentMode].name}`);
    }
    
    // 绑定事件监听
    bindEvents() {
        // 模式切换按钮
        document.querySelectorAll('.vm-mode-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.switchMode(mode);
            });
        });
        
        // 发送按钮
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.sendMessage();
        });
        
        // 输入框事件
        const messageInput = document.getElementById('messageInput');
        
        // 回车发送
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // 自动调整高度
        messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });
    }
    
    // 切换AI模式
    switchMode(mode) {
        if (this.isLoading) return;
        
        this.currentMode = mode;
        
        // 更新按钮状态
        document.querySelectorAll('.vm-mode-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // 更新模式显示
        this.updateModeDisplay();
        
        // 如果已开始对话，添加模式切换提示
        if (this.hasStartedChat) {
            this.addSystemMessage(`已切换到 ${this.modes[mode].name} 模式`);
        }
        
        console.log(`🔄 模式切换: ${this.modes[mode].name}`);
    }
    
    // 更新模式显示区域
    updateModeDisplay() {
        const modeInfo = this.modes[this.currentMode];
        document.getElementById('currentModeName').textContent = modeInfo.name;
        document.getElementById('currentModeIcon').className = modeInfo.icon;

        // 更新搜索框的placeholder
        this.updateInputPlaceholder();

        // 更新猜你想问标签
        this.updateSuggestedQuestions();
    }

    // 更新输入框placeholder
    updateInputPlaceholder() {
        const messageInput = document.getElementById('messageInput');
        const modeInfo = this.modes[this.currentMode];
        if (messageInput && modeInfo.placeholder) {
            messageInput.placeholder = modeInfo.placeholder;
        }
    }

    // 更新猜你想问标签
    updateSuggestedQuestions() {
        const suggestedContainer = document.getElementById('suggestedQuestions');
        if (!suggestedContainer) return;

        const modeInfo = this.modes[this.currentMode];
        const questions = modeInfo.suggestedQuestions || [];

        // 清空现有内容
        suggestedContainer.innerHTML = '';

        if (questions.length === 0) {
            suggestedContainer.style.display = 'none';
            return;
        }

        // 显示猜你想问区域
        suggestedContainer.style.display = 'block';

        // 添加标题
        const titleDiv = document.createElement('div');
        titleDiv.className = 'vm-suggested-title';
        titleDiv.innerHTML = '<i class="fas fa-lightbulb"></i> 猜你想问';
        suggestedContainer.appendChild(titleDiv);

        // 添加问题标签容器
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'vm-suggested-tags';

        questions.forEach((question, index) => {
            const tag = document.createElement('button');
            tag.className = 'vm-suggested-tag';
            tag.textContent = question;
            tag.onclick = () => this.selectSuggestedQuestion(question);

            // 添加悬停动画延迟
            tag.style.animationDelay = `${index * 0.1}s`;

            tagsContainer.appendChild(tag);
        });

        suggestedContainer.appendChild(tagsContainer);
    }

    // 选择猜你想问的问题
    selectSuggestedQuestion(question) {
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value = question;
            messageInput.focus();
            this.autoResizeTextarea();

            // 添加视觉反馈
            messageInput.style.background = 'rgba(212, 175, 55, 0.1)';
            setTimeout(() => {
                messageInput.style.background = '';
            }, 800);
        }
    }
    
    // 发送消息主函数
    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message || this.isLoading) return;

        // 首次发送消息时，显示对话区域，隐藏欢迎区域
        if (!this.hasStartedChat) {
            this.hasStartedChat = true;
            document.getElementById('welcomeArea').classList.add('hidden');
            document.getElementById('chatArea').classList.remove('hidden');
        }

        // 设置加载状态
        this.setLoadingState(true);

        // 添加用户消息到界面
        this.addUserMessage(message);

        // 清空输入框
        messageInput.value = '';
        this.autoResizeTextarea();

        // 添加思考状态消息
        const thinkingMessage = this.addThinkingStatusMessage();
        const startTime = Date.now();

        try {
            // 调用API
            await this.callDeepSeekAPI(message);

        } catch (error) {
            console.error('❌ API调用失败:', error);
            this.addErrorMessage(`抱歉，请求失败了：${error.message || '网络错误，请稍后重试'}`);
        } finally {
            // 移除思考状态消息
            if (thinkingMessage) {
                thinkingMessage.remove();
            }

            // 恢复正常状态
            this.setLoadingState(false);
            messageInput.focus();
        }
    }
    
    // 调用API - 普通非流式调用
    async callDeepSeekAPI(userMessage) {
        const modeInfo = this.modes[this.currentMode];

        // 构建消息数组
        const messages = [
            {
                role: 'system',
                content: modeInfo.systemPrompt
            },
            // 保留最近6条对话历史
            ...this.messages.slice(-6),
            {
                role: 'user',
                content: userMessage
            }
        ];

        // 构建请求数据 - 非流式调用
        const requestData = {
            model: this.config.model,
            messages: messages,
            stream: false,  // 关闭流式输出
            temperature: this.config.temperature || 0.7,
            max_tokens: this.config.maxTokens || 4096,
            top_p: this.config.topP || 0.9
        };

        console.log('🚀 发送非流式API请求:', {
            endpoint: `${this.config.baseURL}/bots/chat/completions`,
            model: requestData.model,
            messagesCount: messages.length,
            stream: requestData.stream,
            apiKeyPrefix: this.config.apiKey ? this.config.apiKey.substring(0, 10) + '...' : 'null'
        });

        // 发送API请求
        const response = await fetch(`${this.config.baseURL}/bots/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        console.log('📡 API响应状态:', response.status, response.statusText);

        if (!response.ok) {
            let errorMessage = `HTTP ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                console.error('❌ API错误详情:', errorData);
                errorMessage = errorData.error?.message || errorData.message || errorMessage;

                // 特殊错误处理
                if (response.status === 401) {
                    errorMessage = 'API密钥无效或已过期，请检查配置';
                } else if (response.status === 403) {
                    errorMessage = 'API访问被拒绝，请检查权限设置';
                } else if (response.status === 404) {
                    errorMessage = '模型ID不存在，请检查模型配置';
                } else if (response.status === 429) {
                    errorMessage = 'API调用频率超限，请稍后重试';
                }
            } catch (e) {
                console.error('❌ 解析错误响应失败:', e);
            }
            throw new Error(errorMessage);
        }

        // 处理普通响应
        const responseData = await response.json();
        console.log('📊 API响应数据:', responseData);

        // 提取AI回复内容
        const aiResponse = responseData.choices?.[0]?.message?.content;
        if (!aiResponse) {
            console.error('❌ 响应数据格式异常:', responseData);
            throw new Error('API响应格式异常，未找到有效内容');
        }

        // 添加AI消息到界面，使用打字机效果
        this.addAIMessage(aiResponse);

        // 保存对话历史
        this.messages.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: aiResponse }
        );

        console.log('✅ 非流式API调用成功');
        return aiResponse;
    }

    // 处理流式响应
    async handleStreamResponse(response, userMessage) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        let thinkingContent = '';
        let isInThinking = false;

        // 创建AI消息容器
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        const modeInfo = this.modes[this.currentMode];

        messageDiv.className = 'vm-message ai';
        messageDiv.innerHTML = `
            <div class="vm-message-content">
                <div class="vm-message-header">
                    <div class="vm-message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <span>有物AI · ${modeInfo.name}</span>
                </div>
                <div class="vm-thinking-section" id="thinking-section" style="display: none;">
                    <div class="vm-thinking-header">
                        <i class="fas fa-brain"></i>
                        <span>AI思维过程</span>
                        <button class="vm-thinking-toggle" onclick="this.parentElement.nextElementSibling.style.display = this.parentElement.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    <div class="vm-thinking-content" id="thinking-content"></div>
                </div>
                <div class="vm-message-text" id="ai-response"></div>
            </div>
        `;

        chatArea.appendChild(messageDiv);
        this.scrollToBottom();

        const thinkingSection = messageDiv.querySelector('#thinking-section');
        const thinkingContentEl = messageDiv.querySelector('#thinking-content');
        const responseEl = messageDiv.querySelector('#ai-response');

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const choice = parsed.choices?.[0];
                            if (!choice) continue;

                            const delta = choice.delta;
                            if (!delta) continue;

                            // 处理思维链内容
                            if (delta.thinking) {
                                if (!isInThinking) {
                                    isInThinking = true;
                                    thinkingSection.style.display = 'block';
                                }
                                thinkingContent += delta.thinking;
                                thinkingContentEl.textContent = thinkingContent;
                                this.scrollToBottom();
                            }

                            // 处理正常响应内容
                            if (delta.content) {
                                isInThinking = false;
                                fullResponse += delta.content;
                                responseEl.innerHTML = this.formatMessage(fullResponse) + '<span class="vm-typing-cursor">|</span>';
                                this.scrollToBottom();
                            }

                        } catch (e) {
                            console.warn('解析流式数据错误:', e);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }

        // 移除光标
        responseEl.innerHTML = this.formatMessage(fullResponse);

        // 保存对话历史
        this.messages.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: fullResponse }
        );

        console.log('✅ 流式API调用成功');
        return fullResponse;
    }
    
    // 设置加载状态
    setLoadingState(isLoading) {
        this.isLoading = isLoading;
        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('messageInput');
        
        if (isLoading) {
            sendBtn.disabled = true;
            sendBtn.innerHTML = '<div class="vm-thinking-dots"><div class="vm-thinking-dot"></div><div class="vm-thinking-dot"></div><div class="vm-thinking-dot"></div></div>';
            messageInput.disabled = true;
        } else {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
            messageInput.disabled = false;
        }
    }
    
    // 添加用户消息
    addUserMessage(message) {
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'vm-message user';
        
        messageDiv.innerHTML = `
            <div class="vm-message-content">
                <div class="vm-message-header">
                    <div class="vm-message-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <span>您</span>
                </div>
                <div class="vm-message-text">${this.escapeHtml(message)}</div>
            </div>
        `;
        
        chatArea.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    // 添加AI消息 - 带逐字输出效果
    addAIMessage(message) {
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        const modeInfo = this.modes[this.currentMode];

        messageDiv.className = 'vm-message ai';
        messageDiv.innerHTML = `
            <div class="vm-message-content">
                <div class="vm-message-header">
                    <div class="vm-message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <span>有物AI · ${modeInfo.name}</span>
                </div>
                <div class="vm-message-text" id="ai-message-${Date.now()}"></div>
            </div>
        `;

        chatArea.appendChild(messageDiv);
        this.scrollToBottom();

        // 启动逐字输出
        const messageTextEl = messageDiv.querySelector('.vm-message-text');
        this.typewriterEffect(messageTextEl, message);
    }

    // 打字机效果 - 完全修复后台运行问题
    async typewriterEffect(element, text) {
        const formattedText = this.formatMessage(text);
        element.innerHTML = '<span class="vm-typing-cursor">|</span>';

        // 解析HTML内容，但逐字显示
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formattedText;

        let displayText = '';
        const plainText = tempDiv.textContent || tempDiv.innerText || '';

        // 记录开始时间和状态
        const startTime = Date.now();
        let charIndex = 0;
        let isCompleted = false;
        let animationId = null;

        // 创建打字机状态对象，存储在元素上
        const typewriterState = {
            startTime,
            plainText,
            formattedText,
            displayText,
            charIndex,
            isCompleted,
            element,
            lastUpdateTime: Date.now()
        };

        // 将状态存储在元素上，以便页面激活时恢复
        element._typewriterState = typewriterState;

        const updateDisplay = () => {
            if (isCompleted || !element.isConnected) {
                // 清理状态
                if (element._typewriterState) {
                    delete element._typewriterState;
                }
                return;
            }

            const now = Date.now();
            const elapsedSinceStart = now - startTime;

            // 根据页面是否在后台调整速度
            const speedMultiplier = document.hidden ? 10 : 1; // 后台时加快10倍
            const baseCharTime = 30; // 每个字符基础时间

            // 计算应该显示到哪个字符
            let targetCharIndex = Math.min(
                Math.floor(elapsedSinceStart / (baseCharTime / speedMultiplier)),
                plainText.length
            );

            // 更新显示内容到目标位置
            while (charIndex < targetCharIndex && charIndex < plainText.length) {
                displayText += plainText[charIndex];
                charIndex++;

                // 在标点处稍作停顿
                const char = plainText[charIndex - 1];
                if (char === '.' || char === '!' || char === '?') {
                    targetCharIndex = Math.min(targetCharIndex, charIndex + 3); // 停顿3个字符时间
                    break;
                } else if (char === ',' || char === ';') {
                    targetCharIndex = Math.min(targetCharIndex, charIndex + 1); // 停顿1个字符时间
                    break;
                }
            }

            // 更新状态
            typewriterState.charIndex = charIndex;
            typewriterState.displayText = displayText;
            typewriterState.lastUpdateTime = now;

            if (charIndex >= plainText.length) {
                // 打字完成
                isCompleted = true;
                typewriterState.isCompleted = true;
                element.innerHTML = formattedText;
                this.scrollToBottom();

                // 清理状态
                if (element._typewriterState) {
                    delete element._typewriterState;
                }
                return;
            }

            // 更新显示
            const currentFormatted = this.formatMessage(displayText);
            element.innerHTML = currentFormatted + '<span class="vm-typing-cursor">|</span>';
            this.scrollToBottom();

            // 继续下一帧
            animationId = requestAnimationFrame(updateDisplay);
        };

        // 页面可见性变化监听
        const visibilityHandler = () => {
            if (!document.hidden && element._typewriterState && !isCompleted) {
                // 页面重新激活且打字机未完成，恢复动画
                console.log('🔄 页面重新激活，恢复打字机效果');
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                animationId = requestAnimationFrame(updateDisplay);
            }
        };

        document.addEventListener('visibilitychange', visibilityHandler);

        // 存储清理函数
        typewriterState.cleanup = () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            document.removeEventListener('visibilitychange', visibilityHandler);
        };

        // 开始动画
        animationId = requestAnimationFrame(updateDisplay);

        // 在元素被移除时自动清理
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.removedNodes.forEach((node) => {
                    if (node === element || node.contains?.(element)) {
                        typewriterState.cleanup();
                        observer.disconnect();
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // 添加思考状态消息 - 精美多步骤展示
    addThinkingStatusMessage() {
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        const modeInfo = this.modes[this.currentMode];

        messageDiv.className = 'vm-message ai';
        messageDiv.innerHTML = `
            <div class="vm-message-content">
                <div class="vm-message-header">
                    <div class="vm-message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <span>有物AI · ${modeInfo.name}</span>
                </div>
                <div class="vm-thinking-process" style="
                    background: rgba(212, 175, 55, 0.03);
                    border: 1px solid rgba(212, 175, 55, 0.1);
                    border-radius: 12px;
                    padding: 16px;
                    margin-top: 8px;
                    font-size: 13px;
                    line-height: 1.5;
                ">
                    <div class="vm-thinking-header" style="
                        display: flex;
                        align-items: center;
                        margin-bottom: 12px;
                        font-size: 12px;
                        color: #D4AF37;
                        font-weight: 500;
                    ">
                        <i class="fas fa-brain" style="margin-right: 6px; font-size: 14px;"></i>
                        <span>AI深度分析中</span>
                    </div>
                    <div class="vm-thinking-steps">
                        <div class="vm-step" id="step-0" style="
                            display: flex;
                            align-items: center;
                            margin-bottom: 8px;
                            color: #888;
                            font-size: 12px;
                            opacity: 0;
                            transform: translateX(-10px);
                            transition: all 0.3s ease;
                        ">
                            <div class="vm-step-icon" style="
                                width: 16px;
                                height: 16px;
                                margin-right: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <div class="vm-thinking-dot-mini" style="
                                    width: 4px;
                                    height: 4px;
                                    background: #D4AF37;
                                    border-radius: 50%;
                                    animation: vm-pulse 1.5s ease-in-out infinite;
                                "></div>
                            </div>
                            <span>正在解析市场数据与趋势...</span>
                        </div>
                        <div class="vm-step" id="step-1" style="
                            display: flex;
                            align-items: center;
                            margin-bottom: 8px;
                            color: #888;
                            font-size: 12px;
                            opacity: 0;
                            transform: translateX(-10px);
                            transition: all 0.3s ease;
                        ">
                            <div class="vm-step-icon" style="
                                width: 16px;
                                height: 16px;
                                margin-right: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <div class="vm-thinking-dot-mini" style="
                                    width: 4px;
                                    height: 4px;
                                    background: #D4AF37;
                                    border-radius: 50%;
                                    animation: vm-pulse 1.5s ease-in-out infinite;
                                "></div>
                            </div>
                            <span>正在比对个股历史走势与行业基准...</span>
                        </div>
                        <div class="vm-step" id="step-2" style="
                            display: flex;
                            align-items: center;
                            margin-bottom: 8px;
                            color: #888;
                            font-size: 12px;
                            opacity: 0;
                            transform: translateX(-10px);
                            transition: all 0.3s ease;
                        ">
                            <div class="vm-step-icon" style="
                                width: 16px;
                                height: 16px;
                                margin-right: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <div class="vm-thinking-dot-mini" style="
                                    width: 4px;
                                    height: 4px;
                                    background: #D4AF37;
                                    border-radius: 50%;
                                    animation: vm-pulse 1.5s ease-in-out infinite;
                                "></div>
                            </div>
                            <span>正在推演多种可能的风险路径...</span>
                        </div>
                        <div class="vm-step" id="step-3" style="
                            display: flex;
                            align-items: center;
                            margin-bottom: 8px;
                            color: #888;
                            font-size: 12px;
                            opacity: 0;
                            transform: translateX(-10px);
                            transition: all 0.3s ease;
                        ">
                            <div class="vm-step-icon" style="
                                width: 16px;
                                height: 16px;
                                margin-right: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <div class="vm-thinking-dot-mini" style="
                                    width: 4px;
                                    height: 4px;
                                    background: #D4AF37;
                                    border-radius: 50%;
                                    animation: vm-pulse 1.5s ease-in-out infinite;
                                "></div>
                            </div>
                            <span>正在筛选更稳健的投资逻辑...</span>
                        </div>
                        <div class="vm-step" id="step-final" style="
                            display: flex;
                            align-items: center;
                            margin-top: 12px;
                            padding-top: 12px;
                            border-top: 1px solid rgba(212, 175, 55, 0.1);
                            color: #D4AF37;
                            font-size: 12px;
                            font-weight: 500;
                            opacity: 0;
                            transform: translateX(-10px);
                            transition: all 0.3s ease;
                        ">
                            <div class="vm-step-icon" style="
                                width: 16px;
                                height: 16px;
                                margin-right: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <i class="fas fa-sparkles" style="font-size: 12px; color: #D4AF37;"></i>
                            </div>
                            <span>生成专业分析结果，深度思考中 <span class="vm-timer">0</span>秒...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        chatArea.appendChild(messageDiv);
        this.scrollToBottom();

        // 添加CSS动画
        if (!document.getElementById('vm-pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'vm-pulse-animation';
            style.textContent = `
                @keyframes vm-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }

        // 启动步骤动画
        this.startThinkingStepsAnimation(messageDiv);

        // 启动计时器 - 修复后台运行问题
        const timerElement = messageDiv.querySelector('.vm-timer');
        const startTime = Date.now();

        const updateTimer = () => {
            if (!timerElement || !timerElement.isConnected) {
                return; // 元素已被移除，停止更新
            }
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            timerElement.textContent = elapsed;
        };

        // 使用更频繁的更新确保后台也能工作
        const timerInterval = setInterval(updateTimer, document.hidden ? 500 : 1000);

        // 监听页面可见性变化，调整更新频率
        const visibilityHandler = () => {
            clearInterval(timerInterval);
            const newInterval = setInterval(updateTimer, document.hidden ? 500 : 1000);
            messageDiv._timerInterval = newInterval;
        };

        document.addEventListener('visibilitychange', visibilityHandler);

        // 将interval ID存储在元素上，以便清理
        messageDiv._timerInterval = timerInterval;
        messageDiv._visibilityHandler = visibilityHandler;

        // 覆盖remove方法，确保清理定时器和事件监听器
        const originalRemove = messageDiv.remove;
        messageDiv.remove = function() {
            if (this._timerInterval) {
                clearInterval(this._timerInterval);
            }
            if (this._visibilityHandler) {
                document.removeEventListener('visibilitychange', this._visibilityHandler);
            }
            originalRemove.call(this);
        };

        return messageDiv;
    }

    // 启动思考步骤动画
    startThinkingStepsAnimation(messageDiv) {
        const steps = ['step-0', 'step-1', 'step-2', 'step-3', 'step-final'];
        let currentStep = 0;

        const showNextStep = () => {
            if (currentStep > 0) {
                // 完成上一步
                const prevStep = messageDiv.querySelector(`#${steps[currentStep - 1]}`);
                if (prevStep) {
                    const icon = prevStep.querySelector('.vm-step-icon');
                    if (icon && currentStep < steps.length) {
                        icon.innerHTML = '<i class="fas fa-check" style="font-size: 10px; color: #D4AF37;"></i>';
                    }
                }
            }

            if (currentStep < steps.length) {
                // 显示当前步骤
                const currentStepEl = messageDiv.querySelector(`#${steps[currentStep]}`);
                if (currentStepEl) {
                    currentStepEl.style.opacity = '1';
                    currentStepEl.style.transform = 'translateX(0)';
                    this.scrollToBottom();
                }
                currentStep++;

                // 设置下一步的延迟时间 - 后台运行优化
                let delay = currentStep === steps.length ? 0 : (800 + Math.random() * 400); // 0.8-1.2秒随机间隔

                // 页面在后台时加快动画速度
                if (document.hidden || document.visibilityState === 'hidden') {
                    delay = Math.min(delay, 300); // 后台最大延迟300ms
                }

                if (currentStep < steps.length) {
                    setTimeout(showNextStep, delay);
                }
            }
        };

        // 开始动画
        setTimeout(showNextStep, 200);
    }

    // 添加AI思考状态 - 带思维链
    addThinkingMessage() {
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        const modeInfo = this.modes[this.currentMode];

        messageDiv.className = 'vm-message ai';
        messageDiv.innerHTML = `
            <div class="vm-message-content">
                <div class="vm-message-header">
                    <div class="vm-message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <span>有物AI · ${modeInfo.name}</span>
                </div>
                <div class="vm-thinking-chain">
                    <div class="vm-thinking-step" id="step-1">
                        <i class="fas fa-search"></i>
                        <span>正在分析您的问题...</span>
                        <div class="vm-thinking-dots">
                            <div class="vm-thinking-dot"></div>
                            <div class="vm-thinking-dot"></div>
                            <div class="vm-thinking-dot"></div>
                        </div>
                    </div>
                    <div class="vm-thinking-step hidden" id="step-2">
                        <i class="fas fa-cogs"></i>
                        <span>选择最佳分析角度...</span>
                        <div class="vm-thinking-dots">
                            <div class="vm-thinking-dot"></div>
                            <div class="vm-thinking-dot"></div>
                            <div class="vm-thinking-dot"></div>
                        </div>
                    </div>
                    <div class="vm-thinking-step hidden" id="step-3">
                        <i class="fas fa-brain"></i>
                        <span>深度分析中，生成专业洞察...</span>
                        <div class="vm-thinking-dots">
                            <div class="vm-thinking-dot"></div>
                            <div class="vm-thinking-dot"></div>
                            <div class="vm-thinking-dot"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        chatArea.appendChild(messageDiv);
        this.scrollToBottom();

        // 启动思维链动画
        this.startThinkingChain(messageDiv);

        return messageDiv;
    }

    // 启动思维链动画序列
    startThinkingChain(messageDiv) {
        const steps = ['step-1', 'step-2', 'step-3'];
        let currentStep = 0;

        const nextStep = () => {
            if (currentStep > 0) {
                // 完成当前步骤
                const prevStep = messageDiv.querySelector(`#${steps[currentStep - 1]}`);
                if (prevStep) {
                    prevStep.classList.add('completed');
                    const dots = prevStep.querySelector('.vm-thinking-dots');
                    if (dots) {
                        dots.innerHTML = '<i class="fas fa-check" style="color: #D4AF37;"></i>';
                    }
                }
            }

            if (currentStep < steps.length) {
                // 显示下一步
                const nextStepEl = messageDiv.querySelector(`#${steps[currentStep]}`);
                if (nextStepEl) {
                    nextStepEl.classList.remove('hidden');
                    this.scrollToBottom();
                }
                currentStep++;
                setTimeout(nextStep, 1500 + Math.random() * 1000); // 1.5-2.5秒随机间隔
            }
        };

        nextStep();
    }
    
    // 添加系统消息
    addSystemMessage(message) {
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = 'vm-message ai';
        messageDiv.innerHTML = `
            <div style="text-align: center; padding: 8px; margin: 8px 0;">
                <div style="display: inline-block; background: rgba(0,0,0,0.3); border: 1px solid rgba(212,175,55,0.3); border-radius: 16px; padding: 6px 12px; font-size: 12px; color: #D4AF37;">
                    <i class="fas fa-info-circle"></i> ${message}
                </div>
            </div>
        `;
        
        chatArea.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    // 添加错误消息
    addErrorMessage(message) {
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = 'vm-message ai';
        messageDiv.innerHTML = `
            <div class="vm-message-content">
                <div class="vm-message-header">
                    <div class="vm-message-avatar" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <span style="color: #ef4444;">系统提示</span>
                </div>
                <div class="vm-message-text">${this.escapeHtml(message)}</div>
            </div>
        `;
        
        chatArea.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    // 格式化消息内容（支持简单markdown）
    formatMessage(message) {
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #D4AF37;">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px;">$1</code>')
            .replace(/#{1,6}\s+(.*?)$/gm, '<h4 style="color: #D4AF37; margin: 12px 0 8px 0; font-size: 16px; font-weight: 600;">$1</h4>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }
    
    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 自动调整textarea高度和滚动条
    autoResizeTextarea() {
        const textarea = document.getElementById('messageInput');
        const originalHeight = textarea.style.height;

        // 重置高度以获取实际内容高度
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = 140; // 最大高度，对应约3行
        const singleLineHeight = 56; // 单行高度

        // 设置实际高度
        const newHeight = Math.min(scrollHeight, maxHeight);
        textarea.style.height = newHeight + 'px';

        // 动态控制滚动条显示：只有当内容超过约2行时才显示滚动条
        if (scrollHeight > singleLineHeight + 20) { // 约2行的高度
            textarea.classList.add('multiline');
        } else {
            textarea.classList.remove('multiline');
        }
    }
    
    // 滚动到底部
    scrollToBottom() {
        const chatArea = document.getElementById('chatArea');
        setTimeout(() => {
            chatArea.scrollTop = chatArea.scrollHeight;
        }, 100);
    }

    // API连接测试函数
    async testAPIConnection() {
        try {
            console.log('🔍 测试API连接...');
            console.log('📋 当前配置:', {
                baseURL: this.config.baseURL,
                model: this.config.model,
                apiKey: this.config.apiKey ? this.config.apiKey.substring(0, 10) + '...' : 'null'
            });

            // 使用非流式格式进行测试
            const requestData = {
                model: this.config.model,
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant."
                    },
                    {
                        role: "user",
                        content: "Hello!"
                    }
                ],
                stream: false,  // 非流式调用
                temperature: 0.7,
                max_tokens: 100,
                top_p: 0.9
            };

            console.log('📤 发送测试请求:', JSON.stringify(requestData, null, 2));

            const response = await fetch(`${this.config.baseURL}/bots/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            console.log('📡 响应状态:', response.status, response.statusText);
            console.log('📋 响应头:', Object.fromEntries(response.headers.entries()));

            if (response.ok) {
                console.log('✅ API连接测试成功');

                try {
                    const responseData = await response.json();
                    console.log('📊 完整响应数据:', responseData);

                    // 检查响应格式
                    if (responseData.choices && responseData.choices.length > 0) {
                        const aiContent = responseData.choices[0].message?.content;
                        if (aiContent) {
                            console.log('✅ 成功接收到AI响应内容:', `"${aiContent}"`);
                            return true;
                        } else {
                            console.log('⚠️ 警告: 响应中没有content字段');
                            return false;
                        }
                    } else {
                        console.log('⚠️ 警告: 响应中没有choices数组或为空');
                        console.log('可能的原因:');
                        console.log('1. 模型配置问题');
                        console.log('2. API参数设置问题');
                        return false;
                    }

                } catch (parseError) {
                    console.error('❌ 解析响应数据失败:', parseError);
                    return false;
                }

            } else {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { message: '无法解析错误响应' };
                }
                console.error('❌ API连接测试失败:');
                console.error('状态码:', response.status);
                console.error('状态文本:', response.statusText);
                console.error('错误详情:', errorData);

                // 在页面上显示错误信息
                if (document.getElementById('welcomeArea')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.style.cssText = `
                        color: #ef4444;
                        background: rgba(239, 68, 68, 0.1);
                        border: 1px solid rgba(239, 68, 68, 0.3);
                        border-radius: 8px;
                        padding: 12px;
                        margin-top: 16px;
                        font-size: 13px;
                    `;
                    errorMsg.innerHTML = `
                        <strong>API 连接失败</strong><br>
                        状态码: ${response.status}<br>
                        错误: ${errorData.message || errorData.error?.message || '未知错误'}<br>
                        <small>请检查API密钥和模型ID是否正确</small>
                    `;
                    document.getElementById('welcomeArea').appendChild(errorMsg);
                }

                return false;
            }
        } catch (error) {
            console.error('❌ API连接测试错误:', error);
            console.error('错误类型:', error.name);
            console.error('错误消息:', error.message);

            // 在页面上显示网络错误
            if (document.getElementById('welcomeArea')) {
                const errorMsg = document.createElement('div');
                errorMsg.style.cssText = `
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 8px;
                    padding: 12px;
                    margin-top: 16px;
                    font-size: 13px;
                `;
                errorMsg.innerHTML = `
                    <strong>网络连接错误</strong><br>
                    ${error.message || '无法连接到 API 服务器'}<br>
                    <small>请检查网络连接或尝试在本地服务器环境下运行</small>
                `;
                document.getElementById('welcomeArea').appendChild(errorMsg);
            }

            return false;
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化有物AI
    window.youwoAI = new YouwoAI();

    console.log('🚀 有物AI精简版已启动');
    console.log('📱 采用夸克AI风格的简洁界面');
    console.log('🧠 支持模式:', Object.keys(window.youwoAI.modes));

    // 自动测试API连接
    window.youwoAI.testAPIConnection();
});