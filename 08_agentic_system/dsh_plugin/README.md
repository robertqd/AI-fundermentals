# DeepSeek Harness 插件（dsh-plugin）

DeepSeek Harness 把 Agent 运行时建成一套可组合、可卸载的插件树。本目录用 Scrum 短迭代演示如何从契约摸底做到可安装 Bundle，并给出每一步的效果图与一份 Host-first 示例插件。

- [DSH 插件敏捷开发实战：六步做出可安装的 Scrum 看板](./dsh-plugin-agile-development.md)
- [示例插件 dsh-plugin-agile](./examples/dsh-plugin-agile/)
- [Kanban 效果预览](./assets/demo-kanban.html)

## 六步对照

| Sprint | 增量 | 效果图 |
| --- | --- | --- |
| 0 契约摸底 | 锁定版本与 profile | [step0](./assets/step0-env.jpg) |
| 1 Hello 挂载 | `apply(ctx)` 进入组合树 | [step1](./assets/step1-hello.jpg) |
| 2 注册工具 | Agent 可写 Backlog | [step2](./assets/step2-tools.jpg) |
| 3 Host 数据源 | `.dsh-agile/board.json` | [step3](./assets/step3-service.jpg) |
| 4 看板演示 | 五列 + Standup | [step4](./assets/step4-kanban.jpg) |
| 5 Bundle 验收 | `dsh plugin add` | [step5](./assets/step5-publish.jpg) |
