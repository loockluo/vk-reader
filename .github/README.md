# GitHub Actions 工作流说明

本项目包含多个 GitHub Actions 工作流，用于自动化构建、测试和发布 VK-Reader 应用。

## 工作流概览

### 1. CI/CD Pipeline (`.github/workflows/ci.yml`)

主要的持续集成和持续部署工作流，包含：

- **测试阶段**：代码检查、类型检查
- **构建阶段**：Windows 和 Linux 平台构建
- **发布阶段**：自动创建 Release

**触发条件**：
- 推送到 `main` 或 `develop` 分支
- 创建 Pull Request 到 `main` 分支
- 手动触发

### 2. 构建 NSIS 安装包 (`.github/workflows/build-installer.yml`)

专门用于构建 Windows NSIS 安装包的工作流。

**触发条件**：
- 推送到 `main` 分支
- 创建 Release
- 手动触发

**输出**：
- `Setup.exe` - Windows 安装包
- 构建产物上传到 GitHub Actions Artifacts

### 3. 开发环境构建 (`.github/workflows/dev-build.yml`)

用于开发分支的快速构建，不包含完整测试。

**触发条件**：
- 推送到 `develop` 或 `feature/*` 分支
- 创建 Pull Request 到 `develop` 分支

### 4. 简单构建 (`.github/workflows/build.yml`)

基础的构建工作流，用于快速验证构建过程。

## 构建产物

### Windows 构建
- `VK-Reader-*.zip` - 包含所有运行文件的 ZIP 包
- `Setup.exe` - NSIS 安装包（仅主分支）

### Linux 构建
- `VK-Reader-Linux-*.tar.gz` - Linux 平台的 TAR 包

## 使用方法

### 1. 自动构建
推送代码到相应分支即可自动触发构建：

```bash
# 开发分支 - 触发开发构建
git push origin develop

# 主分支 - 触发完整构建和安装包
git push origin main
```

### 2. 手动触发
在 GitHub 仓库的 Actions 页面可以手动触发工作流。

### 3. 创建 Release
创建 GitHub Release 会自动触发安装包构建：

```bash
# 创建标签
git tag v1.0.0
git push origin v1.0.0

# 在 GitHub 上创建 Release
```

## 构建脚本说明

项目根目录的 `package.json` 包含以下构建脚本：

- `pnpm run ci:build` - CI 环境完整构建
- `pnpm run build:web` - 构建前端
- `pnpm run build:js` - 构建后端
- `pnpm run build:install` - 构建安装脚本
- `pnpm run build:all` - 构建所有后端组件

## 环境要求

- Node.js 18+
- pnpm 8+
- Windows 环境（用于 NSIS 安装包构建）

## 故障排除

### 构建失败
1. 检查 Node.js 版本是否匹配
2. 确认所有依赖已正确安装
3. 查看构建日志中的具体错误信息

### 安装包构建失败
1. 确认 NSIS 已正确安装
2. 检查 `VK-reader-build.nsi` 文件路径
3. 验证所有必需文件是否存在

### 前端构建失败
1. 检查 `web` 目录下的依赖
2. 确认 `ice build` 命令可正常执行
3. 查看前端构建日志

## 自定义配置

如需修改构建配置，可以编辑相应的工作流文件：

- 修改 Node.js 版本：更改 `NODE_VERSION` 环境变量
- 修改 pnpm 版本：更改 `PNPM_VERSION` 环境变量
- 添加新的构建步骤：在相应 job 中添加新的 step
