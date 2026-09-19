# 工具与验证指南

## 白皮书构建与验证

公开内容源为 `docs/whitepaper/Nexa公众白皮书_v0.1.md` 与 `docs/whitepaper/Nexa公众白皮书_v0.2.md`，不读取 `white_paper/` 私有资料。

```sh
/Users/fireparty/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/build_whitepaper.py
npm run build
/Users/fireparty/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/check_whitepaper.py
npx prettier --plugin=prettier-plugin-astro --check src/pages/whitepaper.astro 'src/pages/[slug].astro'
```

构建 PDF 使用 reportlab，校验使用 pypdf。字体默认 macOS STHeiti Light 与 Songti；其他机器通过 `NEXA_BODY_FONT` / `NEXA_TITLE_FONT` 指定已授权中文 TTF/TTC。输出是 `output/pdf/Nexa公众白皮书_v0.1.pdf` 与 `output/pdf/Nexa公众白皮书_v0.2.pdf`；两份文件随网页构建进入带指纹资产目录。

PDF 修改后须使用 Poppler 渲染两版全部页面，人工检查再交付。当前工具在 Codex runtime 的 `dependencies/native/poppler/poppler/bin/`。校验脚本分别检查两版 Markdown 与 PDF 正文覆盖，并检查专业版网页单 H1/七章、锚点、下载文件一致及基础敏感模式；不能替代人工保密审查或模型验证。

v0.3 已用 `.prettierrc.json` 加载 `prettier-plugin-astro`，可直接运行 `npm run format:check`。`node scripts/check_site.mjs` 检查八路由、站内资源/锚点、交接文档链接及基础发布边界。

若运行生产构建后仍保留旧 Astro 开发进程，曾观察到 Vite 开发缓存引用生产 JSX runtime，导致 `jsxDEV` 错误。使用 `npx astro dev stop` 后重启 `npm run dev` 可恢复；最终交互验收应针对最新构建的 preview/线上版本，避免把开发缓存错误当成生产缺陷。

## 计划技术栈

- Node.js 25（当前本机环境）
- Astro + TypeScript
- Tailwind CSS
- React Island（仅轻量测试）
- Node 原生测试工具
- Codex 浏览器（关键路径与桌面/手机视觉检查）
- Astro Check + Prettier

## 当前研究命令

```bash
rg --files
ffprobe <video>
ffmpeg -i <video> -vf "fps=1,scale=660:-2" frames/frame_%06d.jpg
ffmpeg -i <video> -vf "select='gt(scene,0.18)',scale=660:-2" -fps_mode vfr scene_%05d.jpg
```

## 前端命令

脚手架完成后统一使用 `package.json` 脚本：

```bash
npm install
npm run format:check
npm run typecheck
npm test
npm run build
npm run preview
```

## 最低验收

| 变更     | 检查                                                |
| -------- | --------------------------------------------------- |
| 研究文档 | 来源、日期、证据、事实与推断分离                    |
| 产品文档 | 页面目标、CTA、伦理边界与验收标准                   |
| 前端     | 格式、Astro 类型诊断、单测、构建、移动/桌面视觉检查 |
| 部署     | Caddy 配置检查、release 回滚、HTTPS 与页面烟雾测试  |
| 密钥相关 | `gitleaks detect --source . --redact --verbose`     |

不得因为工具缺失而伪造通过结果；必须记录 skipped 和原因。
