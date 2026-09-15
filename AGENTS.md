# Nexa 主站协作指南

完整执行契约见 `AI_DIRECTIVES.md`。

## 启动顺序

1. 阅读 `AI_DIRECTIVES.md`。
2. 阅读 `PROJECT_CONTEXT.md`、`GOALS.md`、`CURRENT_TASKS.md`。
3. 阅读 `WORKLOG.md`、`DECISIONS.md`、`RESEARCH.md`、`HANDOFF.md`。
4. 按任务阅读 `API_CONTRACT.md`、`DEPLOYMENT.md`、`SECRETS_POLICY.md`、`TOOLING_GUIDE.md`。
5. 运行 `git status --short --branch`，用 `rg` 检查本地内容。

## 项目原则

- 所有产品、研究、设计和交接文档使用中文。
- 用户是主角，Nexa 是解释者和向导，不是命运裁判。
- 不通过恐吓、虚假倒计时、隐藏订阅或焦虑依赖推动转化。
- 区分计算正确性、传统来源一致性、解释质量与现实预测有效性。
- 不公开白皮书目录中的核心公式、权重、阈值或实现细节。
- 竞品资料只用于研究，不复制受版权保护的视觉或文案。
- 每次最多手工修改 3 个代码文件，随后验证并记录检查点。
- 不自动提交、推送或部署。生产部署必须有明确授权和回滚方案。

## 完成标准

每个阶段必须留下研究或决策记录，并完成与风险相称的构建、测试、视觉检查与秘密扫描。停止工作前更新 `HANDOFF.md`。
