import { describe, expect, it, vi } from 'vitest'
import { createInitialState } from '../data/mock-data'
import { readDemoState, saveDemoState, STORAGE_KEY } from '../lib/storage'
import { csvCell } from '../lib/downloads'

describe('local demo persistence', () => {
  it('restores a valid saved state', () => {
    const state = createInitialState()
    state.role = 'admin'
    expect(saveDemoState(state)).toBe(true)
    expect(readDemoState().role).toBe('admin')
  })
  it('recovers from malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{broken')
    expect(readDemoState().profile.name).toBe('Maya Patel')
  })
  it('recovers from invalid state shape', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, role: 'invalid' }))
    expect(readDemoState().doctors.length).toBe(8)
  })
  it('recovers from dangling doctor references', () => {
    const state = createInitialState()
    state.appointments[0].doctorId = 'missing'
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    expect(readDemoState().appointments[0].doctorId).toBe('sarah-johnson')
  })
  it('handles storage denial without crashing', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded')
    })
    expect(saveDemoState(createInitialState())).toBe(false)
  })
  it('escapes CSV quotes and formula cells', () => {
    expect(csvCell('A "quote"')).toBe('"A ""quote"""')
    expect(csvCell('=1+1')).toBe('"\'=1+1"')
  })
})
