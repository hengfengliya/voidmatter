# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是VM（上海虚空有物科技有限公司）的多业务项目，包含：

1. **主官网** - 公司品牌展示网站（根目录）
2. **行业研究报告系统** - 专业投研内容管理（行业投研报告/目录）
3. **智库系统** - 思想领导力内容平台（think-tank.html及相关文件）
4. **更新日志系统** - Linear风格的时间线展示系统（updates.html及相关文件）

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

## 核心文件结构

```
/
├── index.html              # 主网站首页
├── think-tank.html         # 智库页面
├── updates.html            # 更新日志页面
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