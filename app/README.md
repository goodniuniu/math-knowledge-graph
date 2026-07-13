# 高中数学互动知识图谱 · Math Knowledge Graph

一个面向高考数学的**交互式知识图谱 Web 应用**：把散落的知识点连成网络，配合可拖拽的动态图形与专项练习，帮助系统性复习。

> 项目功能持续由 **WorkBuddy（混元 Hy3）** 辅助开发与增强。例如「错题本 / 历史最佳成绩」模块即由 WorkBuddy 在一轮对话中完成编码并验证。

## ✨ 功能特性

- 🌳 **知识树**：按教材分册 / 章节组织全部 57 个核心知识点
- 🕸️ **知识图谱**：可视化知识点之间的「先修 / 相关 / 应用」关联网络，可点选、可拖拽
- 📐 **动态图形**：函数、向量、三角恒等式、不等式、简谐运动等 10+ 交互可视化，拖动参数实时观察变化
- 📝 **公式速查 / 诱导公式**：右侧面板随时查阅
- 🧠 **练习模式**：基于公式、定义、要点自动生成选择题（公式匹配 / 定义辨识 / 判断正误 / 分类归类）
- 📕 **错题本**（WorkBuddy 新增）：答错的题自动收集，去重持久化，随时回看解析
- 🏅 **历史最佳成绩**（WorkBuddy 新增）：练习得分用 localStorage 记录，跨会话保留
- 🌗 **暗色模式**：内置主题切换

## 🛠 技术栈

- React 18 + TypeScript + Vite 7
- Tailwind CSS v3 + shadcn/ui 组件库
- KaTeX（公式渲染）、next-themes（主题）
- GitHub Pages 自动部署（`.github/workflows/deploy.yml`）

## 🚀 本地运行

```bash
cd app
npm install      # 或 npm ci
npm run dev      # 开发服务器
npm run build    # 生产构建，产物在 app/dist
```

## 📦 部署

推送到 `main` 分支即触发 GitHub Actions，自动构建并发布到 GitHub Pages。

## 📁 目录结构（节选）

```
app/
├─ src/
│  ├─ App.tsx                     # 根组件 / 视图切换
│  ├─ data/                       # 知识点数据、公式、定义
│  ├─ components/
│  │  ├─ panels/                  # 知识树 / 详情 / 公式面板 / 练习模式
│  │  └─ graph/                   # 各类交互可视化画布
│  └─ ...
└─ ...
```
