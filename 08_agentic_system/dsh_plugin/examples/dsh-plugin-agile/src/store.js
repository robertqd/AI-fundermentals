import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import {
  addStory,
  createBoard,
  dodCheck,
  hydrate,
  moveStory,
  planSprint,
  setBlocker,
  snapshot,
  standup,
} from './board.js'

export function createStore(persistDir = '.dsh-agile', sprintLengthDays = 7) {
  const file = join(process.cwd(), persistDir, 'board.json')
  let board = load(file, sprintLengthDays)

  const persist = (value) => {
    save(file, board)
    return value
  }

  return {
    addStory: (input) => persist(addStory(board, input)),
    planSprint: (input) => persist(planSprint(board, input)),
    moveStory: (id, status) => persist(moveStory(board, id, status)),
    setBlocker: (id, blocker) => persist(setBlocker(board, id, blocker)),
    standup: () => standup(board),
    dodCheck: () => dodCheck(board),
    snapshot: () => snapshot(board),
    path: file,
  }
}

function load(file, sprintLengthDays) {
  if (!existsSync(file)) return createBoard({ sprintLengthDays })
  try {
    return hydrate(JSON.parse(readFileSync(file, 'utf8')))
  } catch {
    return createBoard({ sprintLengthDays })
  }
}

function save(file, board) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, `${JSON.stringify(snapshot(board), null, 2)}\n`)
}
