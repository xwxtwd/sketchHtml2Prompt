# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 常用命令

```bash
# 开发模式 (Chrome)
pnpm dev

# 开发模式 (Firefox)
pnpm dev:firefox

# 构建 (Chrome)
pnpm build

# 构建 (Firefox)
pnpm build:firefox

# 打包扩展
pnpm zip
pnpm zip:firefox

# 类型检查
pnpm compile
```

## 项目架构

这是一个基于 **WXT** (Web Extension Tools) 框架的浏览器扩展项目，使用 React 19 作为 UI 库。

### 入口点结构

所有入口点位于 `entrypoints/` 目录：

- `popup/` - 扩展弹出窗口 (React 应用)
  - `App.tsx` - 主组件
  - `main.tsx` - React 入口
  - `index.html` - HTML 模板
- `content.ts` - 内容脚本（注入到匹配的网页中）
- `background.ts` - 后台服务脚本

### WXT 配置

- `wxt.config.ts` - WXT 框架配置文件
- `.wxt/` - WXT 生成的类型定义和配置（自动生成，无需手动修改）

### UI 组件

使用 **shadcn/ui** + **Tailwind CSS v4** 构建 UI：

- `components/ui/` - shadcn UI 组件
- `lib/utils.ts` - `cn()` 工具函数
- `entrypoints/popup/globals.css` - Tailwind CSS 和主题变量

添加新组件：
```bash
pnpm dlx shadcn@latest add [组件名]
# 例如: pnpm dlx shadcn@latest add dialog
```

### 关键技术点

- WXT 提供 `defineContentScript`、`defineBackground` 等全局函数（自动导入）
- 使用 `browser.*` API 访问浏览器扩展功能（WXT 提供跨浏览器兼容）
- 路径别名 `@/` 指向项目根目录
