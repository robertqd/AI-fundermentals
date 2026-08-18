import { defineTool } from '@deepseek-ai/dsh-tools'
import { createStore } from './store.js'
import { TOOL_SPECS } from './catalog.js'

export const name = 'dsh-plugin-agile'
export const inject = ['tools']

/**
 * Host face of the agile board plugin.
 * `defineTool` comes from the running Harness; do not vendor `workspace:` ranges.
 */
export function apply(ctx, config = {}) {
  const persistDir = config.persistDir ?? '.dsh-agile'
  const sprintLengthDays = config.sprintLengthDays ?? 7
  const store = createStore(persistDir, sprintLengthDays)

  for (const spec of TOOL_SPECS) {
    ctx.tools.register(defineTool({
      name: spec.name,
      description: spec.description,
      parameters: spec.parameters,
      output: {
        schema: { type: 'object', additionalProperties: true },
        render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
      },
      async execute(args) {
        return spec.execute(store, args ?? {})
      },
    }))
  }

  ctx.effect(() => {
    console.log(`[dsh-plugin-agile] plugin loaded  persist=${store.path}`)
    return () => console.log('[dsh-plugin-agile] plugin unloaded')
  })
}
