/**
 * Browser-face template. Slot names are a typed runtime contract — confirm them
 * against the installed Harness version before shipping a real Web UI plugin.
 *
 * Pattern (do not copy a slot id blindly):
 *
 *   export const inject = ['slots']
 *   export function apply(ctx) {
 *     ctx.slots.inject('<verified-slot>', () =>
 *       ctx.slots.register({ name: '<verified-slot>', id: 'agile-board-panel' }, AgileBoardPanel),
 *     )
 *   }
 *
 * This teaching plugin is Host-first: the Agent drives the board through tools.
 * Open ../../assets/demo-kanban.html for the intended Kanban surface.
 */
export const name = 'dsh-plugin-agile-client'

export function apply() {
  // Intentionally empty until a verified slot is bound in the target DSH version.
}
