import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'
import assert from 'node:assert/strict'
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
} from '../src/board.js'
import { TOOL_SPECS } from '../src/catalog.js'
import { createStore } from '../src/store.js'

const tmpDirs = []

after(() => {
  for (const dir of tmpDirs) rmSync(dir, { recursive: true, force: true })
})

test('adds numbered stories into the backlog', () => {
  const board = createBoard()
  const first = addStory(board, { title: '邮箱密码登录', priority: 'P0', points: 5 })
  const second = addStory(board, { title: '第三方 OAuth', priority: 'P1', points: 3 })
  assert.equal(first.id, 'AGL-1')
  assert.equal(second.id, 'AGL-2')
  assert.equal(board.stories[0].status, 'backlog')
})

test('rejects empty titles and unknown statuses', () => {
  const board = createBoard()
  assert.throws(() => addStory(board, { title: '  ' }), /title is required/)
  addStory(board, { title: 'ok' })
  assert.throws(() => moveStory(board, 'AGL-1', 'blocked'), /unknown status/)
  assert.throws(() => moveStory(board, 'AGL-9', 'todo'), /story not found/)
})

test('plans a sprint by pulling P0 stories when ids are omitted', () => {
  const board = createBoard()
  addStory(board, { title: '邮箱密码登录', priority: 'P0', points: 5 })
  addStory(board, { title: '第三方 OAuth', priority: 'P1', points: 3 })
  const result = planSprint(board, { goal: '登录闭环可演示' })
  assert.equal(result.sprint.status, 'active')
  assert.deepEqual(result.moved, ['AGL-1'])
  assert.equal(board.stories[0].status, 'todo')
  assert.equal(board.stories[1].status, 'backlog')
})

test('standup and DoD follow story movement', () => {
  const board = createBoard({ goal: '登录闭环可演示' })
  addStory(board, { title: '邮箱密码登录', priority: 'P0', points: 5 })
  planSprint(board, { goal: '登录闭环可演示', storyIds: ['AGL-1'] })
  moveStory(board, 'AGL-1', 'doing')
  setBlocker(board, 'AGL-1', 'OAuth 回调域名未配')

  const daily = standup(board)
  assert.equal(daily.wip, 1)
  assert.equal(daily.blockers[0].id, 'AGL-1')
  assert.equal(dodCheck(board).ready, false)

  setBlocker(board, 'AGL-1', '')
  moveStory(board, 'AGL-1', 'done')
  assert.equal(dodCheck(board).ready, true)
})

test('hydrate round-trips a snapshot and continues the id sequence', () => {
  const board = createBoard()
  addStory(board, { title: '邮箱密码登录', priority: 'P0' })
  const restored = hydrate(snapshot(board))
  addStory(restored, { title: '登录审计日志' })
  assert.equal(restored.stories[1].id, 'AGL-2')
})

test('store persists board.json under the given directory', () => {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-agile-'))
  tmpDirs.push(dir)
  const prev = process.cwd()
  process.chdir(dir)
  try {
    const store = createStore('board-data', 7)
    store.addStory({ title: '邮箱密码登录', priority: 'P0', points: 5 })
    const saved = JSON.parse(readFileSync(join(dir, 'board-data', 'board.json'), 'utf8'))
    assert.equal(saved.stories[0].id, 'AGL-1')
    assert.equal(store.snapshot().stories.length, 1)
  } finally {
    process.chdir(prev)
  }
})

test('catalog exposes the seven agile tools used by the Host plugin', () => {
  const names = TOOL_SPECS.map((spec) => spec.name)
  assert.deepEqual(names, [
    'agile_story_add',
    'agile_sprint_plan',
    'agile_status',
    'agile_blocker',
    'agile_standup',
    'agile_board',
    'agile_dod_check',
  ])
})
