# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是VM（上海虚空有物科技有限公司）的多业务项目，包含：

1. **主官网** - 公司品牌展示网站（根目录）
2. **行业研究报告系统** - 专业投研内容管理（行业投研报告/目录）
3. **智库系统** - 思想领导力内容平台（think-tank.html及相关文件）

## 技术架构

### 主网站架构
- **前端技术栈**: HTML5 + TailwindCSS + Anime.js + ECharts
- **设计系统**: Dark Matter Design（深邃黑金权力色系）
- **字体系统**: Poppins + Noto Sans SC + Playfair Display
- **动画引擎**: Anime.js实现流畅页面交互
- **数据可视化**: ECharts图表组件
- **分析工具**: Google Analytics 4 (G-PNS6CHMQZ3)

### 报告系统架构
- **内容格式**: Markdown(.md) + HTML(.html) 双格式输出
- **命名规范**: `{行业编码}{行业名称}行业研究报告_YYYYMMDD.{md|html}`
- **分类系统**: 基于CSV数据的标准化行业分类
- **样式规范**: 深邃黑金UI设计，垂直进度条，响应式布局

## 核心文件结构

```
/
├── index.html              # 主网站首页
├── think-tank.html         # 智库页面
├── css/
│   ├── style.css          # 主网站补充样式
│   ├── think-tank.css     # 智库页面样式
│   └── reports-style.css  # 报告样式（如存在）
├── js/
│   ├── main.js            # 主网站功能逻辑
│   ├── think-tank.js      # 智库页面逻辑
│   ├── auth.js            # 认证系统
│   ├── auth-credentials.js # 认证凭据
│   └── reports-manager.js # 报告管理逻辑
├── industry-reports/       # 公开行业报告HTML文件
└── 行业投研报告/           # 完整报告系统
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

### 质量控制
- 每个HTML文件都需验证UI规范合规性
- 保持报告格式的统一性和专业性
- 确保认证系统的安全性和稳定性