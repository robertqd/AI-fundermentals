/**
 * Pure Scrum board. No Cordis / DSH imports — this is the Host data owner.
 * Persistence and tool registration live in index.js so unit tests stay key-free.
 */

export const STATUSES = Object.freeze(['backlog', 'todo', 'doing', 'review', 'done'])
export const PRIORITIES = Object.freeze(['P0', 'P1', 'P2'])

export function createBoard(init = {}) {
  return {
    sprint: {
      id: init.sprintId ?? 'S1',
      goal: init.goal ?? '',
      status: 'planning',
      lengthDays: init.sprintLengthDays ?? 7,
    },
    stories: [],
    seq: 0,
  }
}

export function addStory(board, input = {}) {
  const title = String(input.title ?? '').trim()
  if (!title) throw new Error('title is required')
  const status = input.status ?? 'backlog'
  assertStatus(status)
  board.seq += 1
  const story = {
    id: `AGL-${board.seq}`,
    title,
    priority: PRIORITIES.includes(input.priority) ? input.priority : 'P1',
    points: finitePoints(input.points),
    status,
    blocker: String(input.blocker ?? ''),
    updatedAt: Date.now(),
  }
  board.stories.push(story)
  return story
}

export function planSprint(board, input = {}) {
  if (input.goal) board.sprint.goal = String(input.goal)
  board.sprint.status = 'active'
  const selected = Array.isArray(input.storyIds) && input.storyIds.length > 0
    ? input.storyIds
    : board.stories.filter((story) => story.status === 'backlog' && story.priority === 'P0').map((story) => story.id)

  const moved = []
  for (const id of selected) {
    const story = findStory(board, id)
    if (story && story.status === 'backlog') {
      story.status = 'todo'
      story.updatedAt = Date.now()
      moved.push(story.id)
    }
  }
  return { sprint: { ...board.sprint }, moved }
}

export function moveStory(board, id, status) {
  const story = requireStory(board, id)
  assertStatus(status)
  story.status = status
  story.updatedAt = Date.now()
  return story
}

export function setBlocker(board, id, blocker) {
  const story = requireStory(board, id)
  story.blocker = String(blocker ?? '')
  story.updatedAt = Date.now()
  return story
}

export function standup(board) {
  const by = (status) => board.stories.filter((story) => story.status === status)
  return {
    sprint: { ...board.sprint },
    yesterday: [...by('review'), ...by('done')].map(brief),
    today: [...by('doing'), ...by('todo')].map(brief),
    blockers: board.stories.filter((story) => story.blocker).map((story) => ({
      id: story.id,
      title: story.title,
      blocker: story.blocker,
    })),
    wip: by('doing').length,
  }
}

export function dodCheck(board) {
  const inSprint = board.stories.filter((story) => story.status !== 'backlog')
  const undone = inSprint.filter((story) => story.status !== 'done')
  const blocked = inSprint.filter((story) => story.blocker)
  return {
    ready: inSprint.length > 0 && undone.length === 0 && blocked.length === 0,
    goal: board.sprint.goal,
    inSprint: inSprint.length,
    done: inSprint.length - undone.length,
    undone: undone.map((story) => story.id),
    blocked: blocked.map((story) => story.id),
  }
}

export function snapshot(board) {
  return {
    sprint: { ...board.sprint },
    stories: board.stories.map((story) => ({ ...story })),
    seq: board.seq,
  }
}

export function hydrate(data) {
  const board = createBoard()
  if (data?.sprint) Object.assign(board.sprint, data.sprint)
  if (Array.isArray(data?.stories)) {
    board.stories = data.stories.map((story) => ({ ...story }))
    board.seq = board.stories.reduce((max, story) => {
      const n = Number(String(story.id).replace(/^AGL-/, ''))
      return Number.isFinite(n) ? Math.max(max, n) : max
    }, 0)
  }
  if (Number.isFinite(data?.seq)) board.seq = Math.max(board.seq, data.seq)
  return board
}

function findStory(board, id) {
  return board.stories.find((story) => story.id === id)
}

function requireStory(board, id) {
  const story = findStory(board, id)
  if (!story) throw new Error(`story not found: ${id}`)
  return story
}

function assertStatus(status) {
  if (!STATUSES.includes(status)) throw new Error(`unknown status: ${status}`)
}

function finitePoints(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 1
  return Math.max(0, Math.round(n))
}

function brief(story) {
  return { id: story.id, title: story.title, status: story.status, points: story.points }
}
