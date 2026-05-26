# Vale Equipment Health & Event Management Prototype · MineCare-style PWA

这是一个可部署到 GitHub Pages 的 **Vite + React + Tailwind + 原生 Service Worker PWA** 原型系统，用于演示徐工 / 淡水河谷设备健康与事件管理业务方案。

## 本版更新

本版从原来的“通用设备健康平台原型”改为更接近 MineCare 页面构成的工作台式原型，按现场调研资料中的功能模块重构页面：

- **00 MineCare式工作台**：四大功能入口、业务闭环、多源监测输入。
- **M1 Event Handling / Tratamento de Eventos**：事件主列表、事件详情、诊断建议、相似事件、Nota/OM回填。
- **M2 Real-Time Monitoring**：设备清单、Ping/调度状态、参数选择、实时曲线验证。
- **M3 Trending Client / Reports / CMA Web**：趋势事件总览、趋势明细、遥测报警报表、报警明细、CMA Web资产选择与诊断填写。
- **M4 Time Tracking / Rastreamento de Tempo**：活动列表、活动详情、OM、子活动、责任人、设备释放。
- **X1 Integration**：MineCare、CMA Web、SAP PM、PCM、MCM、PowerBI 与 XGSS发布端的业务边界。

## 已包含能力

- PWA配置：`manifest.webmanifest`、应用图标、离线页、Service Worker缓存、PWA安装提示基础配置。
- GitHub Pages自动部署：`.github/workflows/deploy.yml`。
- 原型主界面：`src/App.jsx`，无需后端即可演示。
- 所有数据均为演示用 mock data，可后续替换成真实接口。

## 本地运行

```bash
npm install
npm run dev
```

打开终端输出的本地地址，例如：

```bash
http://localhost:5173
```

## 本地构建

```bash
npm run build
npm run preview
```

> PWA 的 Service Worker 在 `localhost` 或 HTTPS 环境下生效。GitHub Pages 默认是 HTTPS，因此可以直接测试安装和离线访问。

## 部署到 GitHub Pages

1. 在 GitHub 创建一个新仓库，例如：`vale-equipment-health-event-prototype`。
2. 将本项目文件夹里的全部内容上传到仓库根目录。
3. 进入仓库 `Settings → Pages`。
4. 在 `Build and deployment` 中选择 `Source: GitHub Actions`。
5. 推送到 `main` 分支后，GitHub Actions 会自动执行构建并发布。
6. 部署完成后，访问 Pages 地址即可。

## Workflow 文件

```text
.github/workflows/deploy.yml
```

该文件会在推送到 `main` 分支后自动执行：

```text
npm install → npm run build → deploy dist to GitHub Pages
```

## PWA测试方式

部署成功后，用 Chrome / Edge 打开 GitHub Pages 地址：

- 地址栏右侧如果出现“安装”图标，可以安装为桌面应用。
- 首次在线打开后，Service Worker 会缓存静态资源。
- 刷新一次后断网访问，已缓存页面仍可打开。
- Chrome DevTools → Application → Manifest / Service Workers 可以查看PWA状态。

## 目录结构

```text
.
├── .github/workflows/deploy.yml   # GitHub Pages自动部署
├── public/
│   ├── manifest.webmanifest       # PWA Manifest
│   ├── service-worker.js          # 原生Service Worker
│   ├── offline.html               # 离线兜底页
│   ├── pwa-192.png                # PWA图标
│   ├── pwa-512.png                # PWA图标
│   ├── pwa-maskable-512.png       # Maskable图标
│   ├── apple-touch-icon.png       # iOS图标
│   └── .nojekyll                  # 避免GitHub Pages忽略下划线资源
├── src/
│   ├── App.jsx                    # MineCare-style原型主界面
│   ├── main.jsx                   # React入口 + Service Worker注册
│   └── index.css                  # Tailwind入口样式
├── index.html                     # PWA元信息
├── vite.config.js                 # Vite配置
├── tailwind.config.js             # Tailwind配置
├── postcss.config.js
├── PWA_CHECKLIST.md
└── package.json
```

## 注意事项

- 当前为业务原型，不包含真实后端、登录鉴权和真实系统接口。
- 如果仓库不是部署在根域名，而是 GitHub Pages 的 `/仓库名/` 子路径下，当前 `base: './'` 配置可保持静态资源相对路径可用。
- 如后续需要生产级缓存策略，可改用 Workbox 或 `vite-plugin-pwa`。
