# 客户细分(Segments)功能项目

这是一个基于React + TypeScript + Vite开发的客户细分管理系统，支持基于属性和行为的动态/静态客户分组。

## 技术栈
- React 19
- TypeScript
- Vite 4.5.0
- Material-UI (MUI) 7.3.6 - UI组件库
- React Router v6 - 路由管理

## 环境要求
- Node.js 18.x 或更高版本
- npm 或 yarn 包管理器

## 安装步骤

### 1. 安装Node.js
如果您的计算机上还没有安装Node.js，请按照以下步骤安装：

#### Windows系统
1. 访问[Node.js官网](https://nodejs.org/zh-cn/)
2. 下载LTS（长期支持）版本的安装包
3. 运行安装包，按照向导完成安装
4. 安装完成后，打开命令提示符（CMD）并输入以下命令验证安装：
   ```bash
   node -v
   npm -v
   ```
   如果显示版本号，则安装成功。

#### macOS系统
1. 推荐使用Homebrew安装，首先确保已安装Homebrew
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. 安装Node.js
   ```bash
   brew install node@18
   ```
3. 验证安装
   ```bash
   node -v
   npm -v
   ```

#### Linux系统
1. 使用apt安装（以Ubuntu为例）
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```
2. 验证安装
   ```bash
   node -v
   npm -v
   ```

### 2. 克隆项目（如果尚未克隆）
如果您还没有克隆这个项目，请先克隆：
```bash
git clone <项目仓库地址>
cd segments
```

### 3. 安装项目依赖
在项目根目录下运行以下命令安装依赖：
```bash
npm install
```

## 启动项目

安装依赖完成后，运行以下命令启动开发服务器：
```bash
npm run dev
```

服务器启动后，您可以在浏览器中访问以下地址：
```
http://localhost:5173
```

## 项目结构

```
segments/
├── src/
│   ├── components/          # React组件
│   │   ├── SegmentBuilder.tsx    # 细分构建器（核心功能）
│   │   ├── SegmentsOverview.tsx  # 细分概览页
│   │   └── NewSegmentDialog.tsx  # 新建细分弹窗
│   ├── mock/                # 模拟数据
│   │   └── customerFields.ts     # 客户字段模拟数据
│   ├── App.tsx              # 应用入口组件
│   ├── main.tsx             # 应用启动文件
│   └── vite-env.d.ts        # Vite环境类型定义
├── public/                  # 静态资源
├── .gitignore               # Git忽略文件
├── index.html               # HTML模板
├── package.json             # 项目配置和依赖
├── tsconfig.json            # TypeScript配置
├── tsconfig.node.json       # Node环境TypeScript配置
└── vite.config.ts           # Vite配置
```

## 核心功能

1. **细分概览页**：展示所有已创建的客户细分
2. **新建细分弹窗**：创建新的客户细分
3. **细分构建器**：
   - 支持添加/删除组和子组
   - 基于客户属性创建条件
   - 支持AND/OR逻辑运算符
   - 动态右侧属性面板

## 开发指南

### 运行ESLint检查
```bash
npm run lint
```

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 常见问题

### 端口被占用
如果默认端口5173被占用，Vite会自动尝试使用其他端口，如5174、5175等。

### 依赖安装失败
- 确保网络连接正常
- 尝试清理npm缓存：
  ```bash
  npm cache clean --force
  ```
- 然后重新安装依赖：
  ```bash
  npm install
  ```

### Node.js版本问题
- 确保使用Node.js 18.x或更高版本
- 可以使用nvm（Node Version Manager）管理多个Node.js版本

## License
MIT