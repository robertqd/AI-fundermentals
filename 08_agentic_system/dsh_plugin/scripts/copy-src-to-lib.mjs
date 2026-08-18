import { cpSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../examples/dsh-plugin-agile')
mkdirSync(join(root, 'lib'), { recursive: true })
cpSync(join(root, 'src'), join(root, 'lib'), { recursive: true })
console.log('copied src/ -> lib/')
