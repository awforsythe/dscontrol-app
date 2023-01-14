import Sequence, { SequenceParseError } from './sequence'

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
    sequence.load('bar', 14.0, [])
    expect(sequence.name).toBe('bar')
    expect(sequence.duration).toBe(14.0)
  })
  test('calls onLoad', () => {
    let called = false
    sequence.onLoad = () => { called = true }
    sequence.load('bar', 14.0, [])
    expect(called).toBe(true)
  })
})

describe('Sequence.tracks', () => {
  test('parses events', () => {
    sequence.load('foo', 10.0, [
      {at: 2.0, left_stick: {to: 'north', over: 0.2}},
      {at: 2.5, left_stick: {to: 'north', over: 0.2}, right_stick: {to: 'neutral'}},
    ])
    sequence.tracks
  })
  test('rejects event with no timestamp', () => {
    const events = [{left_stick: {to: 'north', over: 0.2}}]
    const load = () => sequence.load('foo', 10.0, events)
    expect(load).toThrow(SequenceParseError)
  })
  test('rejects event with no controls', () => {
    const events = [{at: 2.0}]
    const load = () => sequence.load('foo', 10.0, events)
    expect(load).toThrow(SequenceParseError)
  })
  test('accepts empty events array', () => {
    sequence.load('foo', 10.0, [])
    expect(sequence.tracks).toEqual([])
  })
})