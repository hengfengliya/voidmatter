# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是VM（上海虚空有物科技有限公司）的多业务项目，包含：

1. **主官网** - 公司品牌展示网站（根目录）
2. **行业研究报告系统** - 专业投研内容管理（行业投研报告/目录）
3. **智库系统** - 思想领导力内容平台（think-tank.html及相关文件）
4. **更新日志系统** - Linear风格的时间线展示系统（updates.html及相关文件）
5. **有物AI系统** - 智能投研助手平台（youwo-ai.html及相关文件）- **🆕 2025年新增**

## 技术架构

### 主网站架构
- **前端技术栈**: HTML5 + TailwindCSS + Anime.js + ECharts
- **设计系统**: Dark Matter Design（深邃黑金权力色系）
- **字体系统**: Poppins + Noto Sans SC + Playfair Display
- **动画引擎**: Anime.js实现流畅页面交互
- **数据可视化**: ECharts图表组件
- **分析工具**: Google Analytics 4 (G-PNS6CHMQZ3)
- **导航系统**: 全局统一导航组件（navigation.js）

### 报告系统架构
- **内容格式**: Markdown(.md) + HTML(.html) 双格式输出
- **命名规范**: `{行业编码}{行业名称}行业研究报告_YYYYMMDD.{md|html}`
- **分类系统**: 基于CSV数据的标准化行业分类
- **样式规范**: 深邃黑金UI设计，垂直进度条，响应式布局

### 更新日志系统架构
- **设计参考**: Linear.app/changelog 交互模式
- **布局结构**: 左侧固定时间导航 + 右侧时间线内容
- **排序规范**: 完全倒序时间线（月份和日期都倒序）
- **数据管理**: 基于reports-manager.js的数据自动聚合
- **统计算法**: 最小级行业分类统计（第三级/第四级分类）

### 有物AI系统架构 - **🆕 2025年新增**
- **前端技术栈**: HTML5 + TailwindCSS + JavaScript ES6+
- **设计风格**: 夸克AI风格简洁界面 + Dark Matter深邃黑金设计
- **AI模式系统**: 6大专业投研模式（全部、行业分析、公司研究、股票分析、投资建议、数据解读）
- **API集成**: 火山引擎DeepSeek API非流式调用
- **交互体验**: 精美思考中间态、打字机效果、实时计时器
- **配置管理**: 模块化API配置和参数管理
- **响应式设计**: 完整移动端适配，统一导航组件集成

## 核心文件结构

```
/
├── index.html              # 主网站首页
├── think-tank.html         # 智库页面
├── updates.html            # 更新日志页面
├── youwo-ai.html           # 有物AI智能投研助手页面 🆕
├── youwo-ai-config.html    # 有物AI配置管理页面 🆕
├── CLAUDE.md               # 项目开发指南文档
├── README.md               # 项目说明文档
├── package.json            # 项目配置文件
├── sw.js                   # Service Worker
├── sitemap.xml             # 网站地图
├── robots.txt              # 搜索引擎爬虫规则
├── CNAME                   # GitHub Pages域名配置
├── 行业分类四级.csv         # 行业分类数据
├── css/
│   ├── style.css          # 主网站补充样式
│   ├── think-tank.css     # 智库页面样式
│   ├── updates.css        # 更新日志页面样式
│   └── reports-style.css  # 报告样式
├── js/
│   ├── main.js            # 主网站功能逻辑
│   ├── think-tank.js      # 智库页面逻辑
│   ├── navigation.js      # 全局统一导航组件
│   ├── updates.js         # 更新日志页面逻辑
│   ├── updates-manager.js # 更新日志数据管理器
│   ├── reports-manager.js # 报告管理逻辑
│   ├── youwo-ai.js        # 有物AI核心功能实现 🆕
│   ├── youwo-ai-config.js # 有物AI配置管理 🆕
│   ├── auth.js            # 认证系统
│   ├── auth-credentials.js # 认证凭据
│   ├── performance.js     # 性能优化脚本
│   ├── resource-bundler.js # 资源打包器
│   └── sw-manager.js      # Service Worker管理器
├── industry-reports/       # 公开行业报告HTML文件
└── 行业投研报告/           # 完整报告系统（如存在）
    ├── doc/               # 文档和规范
    └── 已生成的报告/       # MD和HTML格式报告
```

## 开发指南

### 无传统构建系统
此项目使用现代CDN和原生技术栈：
- **无package.json构建脚本** - 使用CDN资源
- **无测试框架** - 主要为内容管理项目
- **无编译步骤** - 直接可用的HTML/CSS/JS

### 本地开发
```bash
# 直接打开HTML文件或使用本地服务器
# 推荐使用Live Server扩展获得最佳体验
```

### 样式系统
**主色彩变量**:
```css
:root {
    --vm-black: #0f0f0f;          /* 主背景 */
    --vm-gold: #D4AF37;           /* 标准金色 */
    --vm-gold-bright: #FFD700;    /* 亮金色 */
    --vm-gold-dark: #B8860B;      /* 深金色 */
}
```

## 行业报告处理规范

### HTML生成严格要求
1. **禁止编号格式** - 绝不使用"第一章"、"1.1"等编号
2. **内容居中对齐** - 确保标题和内容正确居中显示
3. **金色设计系统** - 使用深邃黑金权力色系
4. **垂直进度条** - 包含右侧导航和交互功能
5. **响应式布局** - 支持多设备自适应

### 命名和编码规范
- **文件编码**: UTF-8处理中文字符
- **命名格式**: 严格按照`{6位行业编码}{行业名称}行业研究报告_YYYYMMDD`
- **日期格式**: YYYYMMDD（如20250715）
- **参考数据**: 使用`行业分类三级.csv`确保行业编码准确性

### 内容结构标准
- 执行摘要和核心投资论点
- 市场展望和量化预测
- 结构性转变分析
- 投资建议
- 详细行业分析和子版块

## 认证和权限系统

### 会员系统
- **认证文件**: `js/auth.js` + `js/auth-credentials.js`
- **权限控制**: 基于用户角色的内容访问控制
- **登录界面**: Glassmorphism高端设计风格

### 报告管理
- **管理器**: `js/reports-manager.js`处理报告显示和访问
- **权限级别**: 公开报告 vs 会员专享内容

## 全局导航系统

### 统一导航组件 (`js/navigation.js`)
- **自动页面检测**: 根据URL自动识别当前页面并设置激活状态
- **响应式设计**: 完整的桌面端和移动端适配
- **统一品牌**: 所有页面导航外观和交互完全一致
- **代码隔离**: 导航逻辑独立，易于维护和扩展

### 页面映射和激活状态
```javascript
// 页面自动检测映射
'index.html' → 'home' → "首页"激活
'think-tank.html' → 'think-tank' → "质点智库"激活  
'updates.html' → 'updates' → "更新日志"激活
其他页面 → 'home' → 默认"首页"激活
```

### 集成方式
```html
<!-- 1. 引入导航组件 -->
<script src="js/navigation.js"></script>

<!-- 2. 添加导航容器 -->
<div id="vm-navigation"></div>
```

### 导航功能特性
- **品牌标识**: VM logo + 公司名称
- **导航链接**: 首页、质点智库、更新日志、行业趋势
- **激活状态**: 金色高亮 + 下划线指示器
- **悬停效果**: 平滑过渡动画
- **滚动效果**: 导航栏透明度和位置动态变化
- **移动端菜单**: 汉堡菜单 + 全屏滑入面板

## 智库系统详解 (think-tank.html)

### 页面架构重构（2025-09-03）
- **核心理念**: 去冗余化，直接从搜索功能开始，消除视觉干扰
- **设计原则**: 简洁专业，避免过多渐变和装饰性元素
- **功能聚焦**: 搜索、分类浏览、高质感报告卡片展示

### 页面布局结构
```html
<section class="py-12 relative min-h-screen">
    <!-- 1. 深邃专业背景系统 -->
    <!-- 2. 简洁页面标题：质点智库 -->
    <!-- 3. 核心搜索区域 -->
    <!-- 4. 研究分类导航（三大领域）-->
    <!-- 5. 高质感报告卡片网格 -->
</section>
```

### 高质感报告卡片系统
```css
.report-card {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
    border: 1px solid rgba(212, 175, 55, 0.15);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    transition: all 0.4s ease;
}

.report-card:hover {
    transform: translateY(-4px);
    border-color: rgba(212, 175, 55, 0.3);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}
```

### 三大研究领域
1. **行业研究** - 基于reports-manager.js的报告数据，支持四级分类筛选
2. **公司研究** - 预留功能模块，显示"即将推出"状态
3. **市场洞察** - 预留功能模块，显示"即将推出"状态

### 搜索体验升级
- **专业提示文字**: "搜索行业报告、投资洞察、市场分析..."
- **清空按钮**: 动态显示/隐藏，ESC键快捷清空
- **实时筛选**: 支持标题、描述、标签全文搜索
- **搜索统计**: 动态显示搜索结果数量

### 技术实现细节
- **统一导航**: 移除独立导航栏，使用全局navigation.js组件
- **响应式设计**: 网格布局自适应，移动端单列显示
- **性能优化**: 事件委托处理动态报告卡片交互
- **状态管理**: URL hash支持分类状态保存和恢复

## 更新日志系统

### Linear风格时间线
- **设计参考**: 完全参照Linear.app/changelog的交互模式
- **布局结构**: 左侧固定时间导航 + 右侧滚动内容区域
- **倒序排列**: 月份和日期都按照倒序显示（最新在前）

### 数据管理和统计
- **数据源**: 基于`js/reports-manager.js`的报告数据
- **自动聚合**: 按月份和日期自动组织时间线数据
- **统计算法**: 使用最小级行业分类（第三级/第四级）进行统计
- **实时更新**: 页面加载时自动计算最新统计信息

### 交互功能
- **时间导航**: 左侧导航项点击自动滚动到对应内容
- **滚动监听**: 内容滚动时自动高亮对应导航项
- **响应式适配**: 移动端隐藏左侧导航，保持内容可读性

## 部署配置

### 域名和SEO
- **主域名**: voidmatter.cn
- **CNAME配置**: 已配置GitHub Pages部署
- **SEO优化**: 完整meta标签、sitemap.xml、robots.txt
- **分析追踪**: Google Analytics 4集成

### 性能优化
- **CDN资源**: TailwindCSS、Font Awesome、Google Fonts
- **图片优化**: 懒加载和压缩策略
- **缓存策略**: 静态资源缓存配置

## 品牌资产和设计规范

### 核心理念
- **虚空 (Void)**: 潜能的策源地，市场非有效性
- **有物 (Substance)**: 价值的最终形态，长期确定性载体
- **认知套利**: 系统性转化"认知价差"为"认知Alpha"

### 视觉标识
- **Dark Matter Design**: 深邃黑背景配金色点缀
- **动画节奏**: 金融呼吸感，缓慢优雅
- **交互体验**: 视差滚动、微交互、悬停效果

## 特别注意事项

### 文件编码和中文支持
- 所有文件使用UTF-8编码
- 优先使用中文进行交互和文档
- 保持中英文术语对照的准确性

### 内容更新工作流
1. **品牌信息**: 修改HTML内容区域
2. **投资数据**: 更新main.js中的图表配置
3. **样式调整**: 在CSS文件中添加新规则
4. **报告生成**: 遵循严格的HTML生成规范
5. **导航维护**: 新页面需在navigation.js中添加页面映射
6. **更新日志**: 新报告会自动显示在updates.html时间线中
7. **有物AI维护**: 模型配置更新、系统提示词优化、API参数调整 🆕

### 新页面集成导航指南
```html
<!-- 新页面只需两步集成统一导航 -->
<!-- 步骤1: 引入组件 -->
<script src="js/navigation.js"></script>

<!-- 步骤2: 添加容器 -->
<div id="vm-navigation"></div>

<!-- 可选: 手动设置激活状态（如自动检测不准确）-->
<script>
document.addEventListener('DOMContentLoaded', function() {
    if (window.vmNavigation) {
        window.vmNavigation.setCurrentPage('custom-page-id');
    }
});
</script>
```

### 质量控制
- 每个HTML文件都需验证UI规范合规性
- 保持报告格式的统一性和专业性
- 确保认证系统的安全性和稳定性
- 验证统一导航在所有页面正确显示和激活
- 更新日志时间线必须保持完全倒序排列
- 统计数据计算准确性（使用最小级行业分类）
- 有物AI系统提示词专业性和准确性验证 🆕
- API调用稳定性和错误处理完整性测试 🆕

## 有物AI智能投研助手系统详解 - **🆕 2025年新增**

### 系统概述
有物AI是VM公司推出的专业智能投研助手系统，采用夸克AI风格的简洁界面设计，集成火山引擎DeepSeek API，为用户提供机构级专业投研分析服务。

### 核心功能特性

#### 1. **6大专业投研模式**
- **全部模式**: 顶级全能投研分析师，华尔街顶级投行+私募基金专业背景
- **行业分析**: 资深行业研究专家，McKinsey、BCG咨询+投行背景
- **公司研究**: 首席股票分析师，高盛、摩根士丹利+Berkshire Hathaway背景
- **股票分析**: 资深交易分析师，Goldman Sachs量化+Two Sigma对冲基金背景
- **投资建议**: 首席投资官(CIO)，BlackRock、Vanguard+高瓴资本背景
- **数据解读**: 首席数据科学家，MIT/Stanford+Renaissance Technologies背景

#### 2. **精美交互体验**
- **思考中间态**: 多步骤分析展示，实时计时器，动态动画效果
- **打字机效果**: 逐字输出AI回复，支持后台运行，自然停顿节奏
- **响应式设计**: 完美适配桌面端和移动端，统一导航集成
- **专业提示**: 针对不同模式的个性化输入建议和示例

#### 3. **技术架构优势**
- **非流式API**: 稳定可靠的火山引擎DeepSeek API集成
- **模块化设计**: 配置文件独立管理，易于维护和扩展
- **错误处理**: 完整的API错误处理和用户友好反馈
- **性能优化**: 后台运行优化，页面可见性检测

### 系统提示词设计理念

#### **机构级专业背景**
每个模式都配备顶级金融机构的专业背景：
- 投行：Goldman Sachs、Morgan Stanley、中金、中信建投
- 咨询：McKinsey、BCG、Bain
- 资管：BlackRock、Vanguard、高瓴资本、景林资产
- 量化：Renaissance Technologies、Two Sigma、DE Shaw
- 学术：MIT、Stanford、Harvard商学院

#### **系统化分析框架**
- **行业分析**: Porter五力模型、PEST分析、产业链分析、TAM/SAM/SOM
- **公司研究**: DCF估值、杜邦分析、护城河评估、财务质量分析
- **股票分析**: 技术分析、量化建模、资金流分析、风险管理
- **投资建议**: 现代投资组合理论、资产配置、风险预算模型
- **数据解读**: 统计建模、机器学习、时间序列分析、数据可视化

#### **输出质量标准**
- 基于最新2024-2025年数据和市场信息
- 提供定量分析和定性判断的完整论证链条
- 明确标注关键假设条件和风险因素
- 给出具体可执行的投资建议和风险控制措施
- 强制性专业风险提示和合规声明

### 配置和维护指南

#### **API配置管理** (`js/youwo-ai-config.js`)
```javascript
window.YOUWO_AI_CONFIG = {
    volcano: {
        apiKey: 'your-api-key',
        baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
        model: 'bot-20250915112813-kx2qr',
        maxTokens: 4096,
        temperature: 0.7,
        topP: 0.9
    }
};
```

#### **模式配置更新**
在`js/youwo-ai.js`中的`this.modes`对象中：
- 更新`placeholder`字段修改搜索框提示
- 更新`systemPrompt`字段优化系统提示词
- 保持专业背景和分析框架的完整性

#### **性能优化要点**
- 打字机效果在后台运行时自动加速
- 思考计时器支持页面可见性检测
- API请求失败时提供详细错误信息和解决建议
- 所有定时器和事件监听器都有完整的清理机制

### 访问和部署
- **生产环境**: https://voidmatter.cn/youwo-ai.html
- **配置管理**: https://voidmatter.cn/youwo-ai-config.html
- **GitHub仓库**: 已集成到主项目仓库，自动部署到GitHub Pages
- **CDN资源**: 使用TailwindCSS、Font Awesome等外部CDN资源

### 未来扩展计划
- **联网搜索**: 集成实时市场数据和新闻资讯
- **文档上传**: 支持财报、研究报告等文档分析
- **图表生成**: 自动生成专业投研图表和可视化
- **语音交互**: 语音输入和语音播报功能
- **多语言支持**: 英文等多语言界面和分析