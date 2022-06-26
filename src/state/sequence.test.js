import Sequence from './sequence'

var sequence = null

beforeEach(() => {
  sequence = new Sequence()
})

describe('Sequence.constructor', () => {
  test('initializes defaults', () => {
    expect(sequence.name).toBe('seq_001')
    expect(sequence.duration).toBe(20.0)
  })
})

describe('Sequence.load', () => {
  test('updates state', () => {
    sequence.load('bar', 14.0)
    expect(sequence.name).toBe('bar')
    expect(sequence.duration).toBe(14.0)
  })
  test('calls onLoad', () => {
    let called = false
    sequence.onLoad = () => { called = true }
    sequence.load('bar', 14.0)
    expect(called).toBe(true)
  })
})
