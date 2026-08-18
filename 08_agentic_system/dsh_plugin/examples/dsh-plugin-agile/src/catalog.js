/** Tool specs consumed by the Host plugin. Keep this file free of DSH imports. */

export const TOOL_SPECS = [
  {
    name: 'agile_story_add',
    description: 'Add a user story to the Scrum backlog.',
    parameters: {
      title: { type: 'string', required: true, description: 'Story title' },
      priority: { type: 'string', description: 'P0, P1, or P2' },
      points: { type: 'number', description: 'Story points' },
      status: { type: 'string', description: 'backlog | todo | doing | review | done' },
      blocker: { type: 'string', description: 'Optional blocker note' },
    },
    execute: (store, args) => store.addStory(args),
  },
  {
    name: 'agile_sprint_plan',
    description: 'Activate the sprint and pull selected (or all P0) backlog stories into Todo.',
    parameters: {
      goal: { type: 'string', description: 'Sprint goal' },
      storyIds: { type: 'array', description: 'Story ids to pull, e.g. ["AGL-1"]' },
    },
    execute: (store, args) => store.planSprint(args),
  },
  {
    name: 'agile_status',
    description: 'Move a story between backlog, todo, doing, review, and done.',
    parameters: {
      id: { type: 'string', required: true, description: 'Story id such as AGL-1' },
      status: { type: 'string', required: true, description: 'Target status' },
    },
    execute: (store, args) => store.moveStory(args.id, args.status),
  },
  {
    name: 'agile_blocker',
    description: 'Set or clear a story blocker. Empty string clears it.',
    parameters: {
      id: { type: 'string', required: true, description: 'Story id' },
      blocker: { type: 'string', description: 'Blocker text' },
    },
    execute: (store, args) => store.setBlocker(args.id, args.blocker ?? ''),
  },
  {
    name: 'agile_standup',
    description: 'Produce a daily standup from the current board: yesterday, today, blockers.',
    parameters: {},
    execute: (store) => store.standup(),
  },
  {
    name: 'agile_board',
    description: 'Dump the current sprint board snapshot.',
    parameters: {},
    execute: (store) => store.snapshot(),
  },
  {
    name: 'agile_dod_check',
    description: 'Check whether the sprint meets the Definition of Done.',
    parameters: {},
    execute: (store) => store.dodCheck(),
  },
]
