<div align="center">
  <sub>
    English |
    <a href="docs/i18n/README.es.md">Español</a> |
    <a href="docs/i18n/README.zh.md">简体中文</a>
  </sub>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Under%20Development-orange?style=for-the-badge" />
</p>

> [!WARNING]
> **Project Status: Under Active Development**
> Blu is currently in early development and is not yet ready for stable use. Features may change, and we do not recommend using it for production tasks quite yet.

<h1 align="center">
  Blu - Power up your tools with the one they've been missing.
</h1>

<p align="center">
  <img src="https://img.shields.io/github/stars/Get-Blu/blu?style=flat-square&logo=github" />
<img src="https://img.shields.io/github/issues/Get-blu/blu?style=flat-square&logo=github" />
<img src="https://img.shields.io/github/license/Get-Blu/blu?style=flat-square&color=blue" />
<img src="https://img.shields.io/visual-studio-marketplace/v/Garv.blu?style=flat-square&logo=visualstudiocode&color=007ACC" />
<img src="https://img.shields.io/visual-studio-marketplace/i/Garv.blu?style=flat-square&color=blueviolet" />
<img src="https://img.shields.io/visual-studio-marketplace/r/Garv.blu?style=flat-square&color=yellow" />

</p>

<div align="center">
  <table>
    <tbody>
      <td align="center">
        <a href="https://marketplace.visualstudio.com/items?itemName=Garv.blu" target="_blank"><strong>Download on VS Marketplace</strong></a>
      </td>
      <td align="center">
        <a href="https://github.com/Get-Blu/blu/discussions" target="_blank"><strong>Feature Requests</strong></a>
      </td>
    </tbody>
  </table>
</div>

---

<img src="logo/hero-banner.png" width="1000"/>


## What is Blu?

![Blu in action](logo/blu_main.gif)


**Blu** is an AI-powered VS Code extension that helps you work from **goals instead of prompts**. Describe what you want to achieve, and Blu will analyze your codebase, plan the necessary changes, and execute them step-by-step—always with your approval.

Built on the powerful foundation of Cline, Blu extends the concept with enhanced goal-oriented workflows and a focus on developer collaboration.

---

## Key Features

### Goal-Driven Development

**Work from intent, not implementation.** Simply describe your goal—"add user authentication," "refactor this component," or "fix the mobile layout"—and Blu will create a detailed plan before making any changes.

- **Intelligent task breakdown**: Blu analyzes your request and breaks it into logical steps
- **Context-aware planning**: Understands your project structure and dependencies
- **Approval workflow**: Review and approve each step before execution

> [!TIP]
> Open Blu in the sidebar (View → Command Palette → "Blu: Open Sidebar") to work side-by-side with your code. This gives you full visibility into Blu's planning and execution process.

<!-- Clear float -->
<div style="clear: both;"></div>

### Deep Codebase Understanding
Blu doesn't just read files—it understands your project. Through AST analysis, dependency mapping, and semantic search, Blu gets up to speed quickly, even in large, complex codebases.

- **AST parsing**: Understands code structure and relationships
- **Smart context management**: Only adds relevant files to context
- **Pattern recognition**: Identifies common patterns and best practices
- **Cross-file awareness**: Understands how changes affect the entire codebase

<!-- Clear float -->
<div style="clear: both;"></div>

### Human-in-the-Loop Execution

**You're always in control.** Blu presents a clear plan and shows diffs before making any changes. Approve, modify, or reject each step as Blu works through your task.

- **Interactive diff views**: See exactly what will change
- **Step-by-step approval**: Control the pace of execution
- **Real-time feedback**: Provide input as Blu works
- **Undo/Redo**: Full control over every modification

<!-- Clear float -->
<div style="clear: both;"></div>

### Powerful Tool Integration

#### File Creation & Editing
Blu can create new files, modify existing ones, and even refactor across multiple files while maintaining code quality and consistency.

#### Terminal Integration
Execute commands directly in your terminal with full output monitoring. Blu can:
- Install dependencies and run build scripts
- Start development servers
- Run tests and migrations
- Deploy applications

#### Browser Automation
For web development tasks, Blu can:
- Launch your application in a browser
- Interact with UI elements
- Capture screenshots and console logs
- Debug visual and runtime issues

### Multi-Model Support

Use your preferred AI provider:

<p align="left">
  <img src="https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Anthropic-000000?style=flat-square&logo=anthropic&logoColor=white" />
  <img src="https://img.shields.io/badge/Google%20Gemini-4285F4?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenRouter-7B3FE4?style=flat-square&logo=openauth&logoColor=white" />
<img src="https://img.shields.io/badge/Azure%20-0078D4?style=flat-square&logo=microsoftazure&logoColor=white" />
  
</p>

Cost tracking and token usage monitoring help you stay within budget.


<!-- Clear float -->
<div style="clear: both;"></div>

### Extensible via MCP

Extend Blu's capabilities with the **Model Context Protocol**. Create custom tools for your specific workflow:

- **"Add a tool that fetches Jira tickets"** – Work directly from requirements
- **"Add a tool that checks AWS status"** – Monitor infrastructure
- **"Add a tool that queries your database"** – Get real data insights
- **"Add a tool that integrates with your API"** – Connect to internal services

Blu can even help you create and install these tools automatically.

<!-- Clear float -->
<div style="clear: both;"></div>

### Context-Aware Assistance
Add relevant context with simple commands:

- **`@ Add Context`** – Include a specific file's contents

Type to search and quickly add what Blu needs to understand your task.

<!-- Clear float -->
<div style="clear: both;"></div>

### Checkpoints & Version Control

**Experiment safely.** Blu creates checkpoints as it works, allowing you to:
- **Compare** any checkpoint with current state
- **Restore** to previous points in time
- **Branch** different approaches
- **Merge** successful experiments

All changes are tracked in VS Code's Timeline for easy rollback.

<!-- Clear float -->
<div style="clear: both;"></div>

---

## Getting Started

### Quick Installation
1. **Install from VS Code Marketplace**: Search for "Blu" or use [this direct link](https://marketplace.visualstudio.com/items?itemName=Garv.blu)
2. **Open Blu**: Click the Blu icon in the Activity Bar or run `Blu: Open Sidebar` from the Command Palette
3. **Configure your AI provider**: Add your API key in settings (Ctrl+, → Extensions → Blu)
4. **Start your first task**: Type a goal and let Blu plan the execution

---

## Architecture & Philosophy

Blu is built on three core principles:

1. **Clarity First** – No hidden changes, no magic. Everything is transparent and explainable.
2. **Developer Control** – You approve every change. Blu suggests, you decide.
3. **Collaborative Intelligence** – Blu amplifies your abilities, doesn't replace your judgment.

### How Blu Works

<p align="center">
  <img src="logo/concept-mascot.png" width="1000"/>
</p>


1. **Goal Analysis** – Understands your intent and requirements
2. **Context Gathering** – Analyzes relevant parts of your codebase
3. **Plan Generation** – Creates a step-by-step execution plan
4. **Interactive Execution** – Executes each step with your approval
5. **Validation** – Tests and verifies the results

---

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository** and clone it locally
2. **Set up development environment**:
   ```bash
   npm install
   npm run compile
   ```