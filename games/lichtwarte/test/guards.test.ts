import { join } from 'node:path'
import { describeSaveGuards } from '@engine/testing'
import { extraIds, game } from '../src/game'

describeSaveGuards({
  def: game,
  fixturesDir: join(__dirname, 'fixtures'),
  idLockFile: join(__dirname, '..', 'ids.lock.json'),
  extraIds,
})
