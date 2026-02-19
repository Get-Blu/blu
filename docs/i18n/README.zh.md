<div align="center">
  <sub>
    <a href="../../README.md">English</a> |
    <a href="docs/i18n/README.es.md">Español</a> |
    简体中文
  </sub>
</div>

<h1 align="center">
  Blu - 为你的工具增强缺失的功能。
</h1>

<p align="center">
  <img src="https://img.shields.io/github/stars/Get-Blu/blu?style=flat-square&logo=github" />
<img src="https://img.shields.io/github/issues/Get-Blu/blu?style=flat-square&logo=github" />
<img src="https://img.shields.io/github/license/Get-Blu/blu?style=flat-square&color=blue" />
<img src="https://img.shields.io/visual-studio-marketplace/v/Garv.blu?style=flat-square&logo=visualstudiocode&color=007ACC" />
<img src="https://img.shields.io/visual-studio-marketplace/i/Garv.blu?style=flat-square&color=blueviolet" />
<img src="https://img.shields.io/visual-studio-marketplace/r/Garv.blu?style=flat-square&color=yellow" />

</p>

<div align="center">
  <table>
    <tbody>
      <td align="center">
        <a href="https://marketplace.visualstudio.com/items?itemName=Garv.blu" target="_blank"><strong>在 VS Marketplace 下载</strong></a>
      </td>
      <td align="center">
        <a href="https://github.com/Get-Blu/blu/discussions" target="_blank"><strong>功能请求</strong></a>
      </td>
    </tbody>
  </table>
</div>

---

<p align="center">
  <img src="../../logo/hero-banner.png" width="1000"/>
</p>


## 什么是 Blu？

![Blu in action](../../logo/blu_main.gif)

**Blu** 是一个由 AI 驱动的 VS Code 扩展，帮助你从**目标而不是提示词**开始工作。描述你想实现的目标，Blu 将分析你的代码库、规划必要的更改，并逐步执行它们——始终获得你的批准。

Blu 建立在强大的 Cline 基础上，通过增强的目标导向工作流和对开发者协作的关注扩展了概念。

---

## 主要功能

### 目标驱动开发

**从意图而不是实现来工作。** 只需描述你的目标——"添加用户认证"、"重构此组件"或"修复移动端布局"——Blu 将在进行任何更改前创建详细的计划。

- **智能任务分解**：Blu 分析你的请求并将其分解为逻辑步骤
- **上下文感知规划**：理解你的项目结构和依赖关系
- **批准工作流**：在执行前审查和批准每个步骤

> [!TIP]
> 在侧边栏中打开 Blu（查看 → 命令调色板 → "Blu: Open Sidebar"）与代码并行工作。这让你可以完全看到 Blu 的规划和执行过程。

<!-- Clear float -->
<div style="clear: both;"></div>

### 深度代码库理解
Blu 不仅读取文件——它理解你的项目。通过 AST 分析、依赖映射和语义搜索，Blu 可以快速跟上进度，即使在大型复杂代码库中也是如此。

- **AST 解析**：理解代码结构和关系
- **智能上下文管理**：仅将相关文件添加到上下文中
- **模式识别**：识别常见模式和最佳实践
- **跨文件感知**：理解更改如何影响整个代码库

<!-- Clear float -->
<div style="clear: both;"></div>

### 人类在循环中的执行

**你始终掌控。** Blu 提供清晰的计划并在进行更改前显示差异。在 Blu 处理你的任务时审查、修改或拒绝每个步骤。

- **交互式差异视图**：准确看到将要改变的内容
- **逐步批准**：控制执行的节奏
- **实时反馈**：在 Blu 工作时提供输入
- **撤销/重做**：对每个修改的完全控制

<!-- Clear float -->
<div style="clear: both;"></div>

### 强大的工具集成

#### 文件创建和编辑
Blu 可以创建新文件、修改现有文件，甚至在多个文件间进行重构，同时保持代码质量和一致性。

#### 终端集成
直接在终端中执行命令并完全监控输出。Blu 可以：
- 安装依赖并运行构建脚本
- 启动开发服务器
- 运行测试和迁移
- 部署应用程序

#### 浏览器自动化
对于网络开发任务，Blu 可以：
- 在浏览器中启动你的应用程序
- 与 UI 元素交互
- 捕获屏幕截图和控制台日志
- 调试视觉和运行时问题

### 多模型支持

使用你喜欢的 AI 提供商：

<p align="left">
  <img src="https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Anthropic-000000?style=flat-square&logo=anthropic&logoColor=white" />
  <img src="https://img.shields.io/badge/Google%20Gemini-4285F4?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenRouter-7B3FE4?style=flat-square&logo=openauth&logoColor=white" />
<img src="https://img.shields.io/badge/Azure%20-0078D4?style=flat-square&logo=microsoftazure&logoColor=white" />
  
</p>

成本追踪和代币使用监控帮助你保持在预算范围内。


<!-- Clear float -->
<div style="clear: both;"></div>

### 通过 MCP 可扩展

使用**模型上下文协议**扩展 Blu 的功能。为你的特定工作流创建自定义工具：

- **"添加一个获取 Jira 工单的工具"** – 直接从需求工作
- **"添加一个检查 AWS 状态的工具"** – 监控基础设施
- **"添加一个查询数据库的工具"** – 获取真实数据洞察
- **"添加一个与 API 集成的工具"** – 连接到内部服务

Blu 甚至可以帮助你自动创建和安装这些工具。

<!-- Clear float -->
<div style="clear: both;"></div>

### 上下文感知帮助
使用简单命令添加相关上下文：

- **`@ 添加上下文`** – 包含特定文件的内容

输入以搜索并快速添加 Blu 理解你的任务所需的内容。

<!-- Clear float -->
<div style="clear: both;"></div>

### 检查点和版本控制

**安全地实验。** Blu 在工作时创建检查点，允许你：
- **比较**任何检查点与当前状态
- **恢复**到以前的时间点
- **分支**不同的方法
- **合并**成功的实验

所有更改都在 VS Code 的时间线中被追踪，便于轻松回滚。

<!-- Clear float -->
<div style="clear: both;"></div>

---

## 入门指南

### 快速安装
1. **从 VS Code Marketplace 安装**：搜索"Blu"或使用[此直接链接](https://marketplace.visualstudio.com/items?itemName=Garv.blu)
2. **打开 Blu**：点击活动栏中的 Blu 图标或从命令调色板运行 `Blu: Open Sidebar`
3. **配置你的 AI 提供商**：在设置中添加 API 密钥（Ctrl+, → 扩展 → Blu）
4. **开始你的第一个任务**：输入目标并让 Blu 规划执行

---

## 架构和理念

Blu 建立在三个核心原则上：

1. **清晰优先** – 没有隐藏的更改，没有魔法。一切都是透明和可解释的。
2. **开发者控制** – 你批准每个更改。Blu 建议，你决定。
3. **协作智能** – Blu 放大你的能力，不会替代你的判断。

### Blu 如何工作

<p align="center">
  <img src="../../logo/concept-mascot.png" width="1000"/>
</p>


1. **目标分析** – 理解你的意图和要求
2. **上下文收集** – 分析代码库的相关部分
3. **计划生成** – 创建逐步执行计划
4. **交互式执行** – 通过你的批准执行每个步骤
5. **验证** – 测试和验证结果

---

## 贡献

我们欢迎贡献！这是入门方式：

1. **Fork 存储库**并在本地克隆它
2. **设置开发环境**：
   ```bash
   npm install
   npm run compile
   ```