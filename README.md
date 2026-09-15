# Nexa 主站

Nexa 主站是面向中文用户的品牌、产品与信任入口。项目目标是把社交广告带来的好奇心，转换为一次克制、可信、能立即提供价值的体验，并向用户说明 Nexa 如何结合八字、易经、结构化计算和 AI。

## 当前阶段

- 阶段：v0.5 Dev 产品视觉对齐、官方品牌素材本地化与团队交付
- 在线地址：`https://main.zfis.net`
- 团队仓库：`https://github.com/zfusx/nexa`（Private）
- 产品语言：简体中文
- 当前重点：设计/程序团队将独立引流页、正式 CTA 与核心服务产品化
- 白皮书：v0.2 专业版审阅稿，公开数学框架、验证逻辑与证据边界

## 团队从这里开始

[团队交付入口](docs/handoff/README.md) 包含阅读顺序、源码映射和运行方式。

- [页面与流程规格](docs/product/页面与用户流程规格.md)
- [设计系统与组件](docs/design/设计系统与组件规格.md)
- [SVG 图标系统与复用清单](docs/design/SVG图标系统与复用清单.md)
- [服务接入说明](docs/engineering/实现与服务接入说明.md)
- [实施任务与验收](docs/handoff/验收与实施任务清单.md)
- [待确认决策](docs/handoff/待确认决策清单.md)

在线：[主站](https://main.zfis.net) · [30 题独立测试](https://main.zfis.net/quiz) · [设计参考](https://main.zfis.net/design-system) · [白皮书](https://main.zfis.net/whitepaper)。这是设计演示；真实账户、支付、广告归因与核心计算未接入。

## 目录

| 路径                | 用途                                         |
| ------------------- | -------------------------------------------- |
| `othersite/`        | 用户提供的竞品截图与录屏，原始素材不进入 Git |
| `white_paper/`      | 内部技术资料与本机审查，绝不发布或打包       |
| `docs/research/`    | 竞品、视频与用户路径研究                     |
| `docs/product/`     | 品牌、转化漏斗、PRD 与信息架构               |
| `docs/design/`      | UI 规范和团队交付说明                        |
| `src/`              | 演示站源码                                   |
| `docs/handoff/`     | 团队阅读入口、验收与决策                     |
| `docs/engineering/` | 代码分层及真实服务接入边界                   |
| `output/handoff/`   | 可移交压缩包与清单，不上传公开站点           |

## 项目控制文档

从 `AGENTS.md` 开始阅读。长期目标、任务、研究、决策、部署与交接分别记录在根目录对应文档中。

## 运行方式

以 `TOOLING_GUIDE.md` 中的命令为准。本轮已经完成本地构建、视觉检查、链接检查、基础秘密扫描和远端部署验收；生产发布与回滚记录见 `DEPLOYMENT.md`。
