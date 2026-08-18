# dsh-plugin-agile

DeepSeek Harness 的 Host 侧 Scrum 看板插件：把 Backlog、Sprint、Standup 和 Definition of Done 注册成 Agent 可调用的工具，并把看板状态持久化到工作区 `.dsh-agile/board.json`。

完整的敏捷开发步骤与每一步效果图见上级文档：

- [DSH 插件敏捷开发实战](../../dsh-plugin-agile-development.md)

## 安装

```bash
dsh plugin --profile web add ./examples/dsh-plugin-agile
dsh --profile web --dump-config
dsh web --profile web
```

## 工具

| 工具 | 作用 |
| --- | --- |
| `agile_story_add` | 写入用户故事 |
| `agile_sprint_plan` | 激活迭代并拉取 P0（或指定 id） |
| `agile_status` | 移动故事状态 |
| `agile_blocker` | 登记 / 清除阻碍 |
| `agile_standup` | 生成昨日 / 今日 / 阻碍 |
| `agile_board` | 导出看板快照 |
| `agile_dod_check` | 检查本迭代是否满足 DoD |

## 本地验证（无需 DSH）

领域模型与持久化不依赖 Harness，可直接跑：

```bash
npm test
npm run check
```
