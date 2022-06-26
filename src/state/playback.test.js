import Playback from './playback'

class MockSequence {
    duration = 15.0
}

var sequence = null
var playback = null

beforeEach(() => {
  sequence = new MockSequence()
  playback = new Playback(sequence)
})

describe('Playback.constructor', () => {
  test('initializes defaults from sequence', () => {
    expect(playback._sequence).toBe(sequence)
    expect(playback.isPlaying).toBe(false)
    expect(playback.position).toBe(0.0)
    expect(playback.visibleRange.start).toBe(0.0)
    expect(playback.visibleRange.end).toBe(sequence.duration)
  })
  test('defines sequence onLoad callback', () => {
    expect(typeof playback._sequence.onLoad).toBe('function')
  })
})

describe('Playback.play, Playback.stop, Playback.toggle', () => {
  test('changes playback state', () => {
    expect(playback.isPlaying).toBe(false)
    playback.play()
    expect(playback.isPlaying).toBe(true)
    playback.play()
    expect(playback.isPlaying).toBe(true)
    playback.stop()
    expect(playback.isPlaying).toBe(false)
    playback.stop()
    expect(playback.isPlaying).toBe(false)
    playback.toggle()
    expect(playback.isPlaying).toBe(true)
    playback.toggle()
    expect(playback.isPlaying).toBe(false)
  })
  test('when stopped at end, play resets from start', () => {
    playback.scrubTo(sequence.duration)
    expect(playback.isPlaying).toBe(false)
    playback.play()
    expect(playback.isPlaying).toBe(true)
    expect(playback.position).toBe(0.0)
  })
})

describe('Playback.seekToStart', () => {
  test('resets position to start', () => {
    playback.scrubTo(5.0)
    playback.seekToStart()
    expect(playback.position).toBe(0.0)
    expect(playback.isPlaying).toBe(false)
  })
  test('stops playback if playing', () => {
    playback.scrubTo(5.0)
    playback.play()
    playback.seekToStart()
    expect(playback.position).toBe(0.0)
    expect(playback.isPlaying).toBe(false)
  })
  test('shifts visible range to keep playhead in view', () => {
    playback.scrubTo(11.0)
    playback.adjustVisibleRange(10.0, 15.0)
    playback.seekToStart()
    expect(playback.visibleRange.start).toBe(0.0)
    expect(playback.visibleRange.end).toBe(5.0)
  })
})

describe('Playback.seekToEnd', () => {
  test('resets position to end', () => {
    playback.scrubTo(5.0)
    playback.seekToEnd()
    expect(playback.position).toBe(sequence.duration)
    expect(playback.isPlaying).toBe(false)
  })
  test('stops playback if playing', () => {
    playback.scrubTo(5.0)
    playback.play()
    playback.seekToEnd()
    expect(playback.position).toBe(sequence.duration)
    expect(playback.isPlaying).toBe(false)
  })
  test('shifts visible range to keep playhead in view', () => {
    playback.scrubTo(6.0)
    playback.adjustVisibleRange(5.0, 10.0)
    playback.seekToEnd()
    expect(playback.visibleRange.start).toBe(10.0)
    expect(playback.visibleRange.end).toBe(15.0)
  })
})

describe('Playback.scrubTo', () => {
  test('moves to the desired position', () => {
    playback.scrubTo(2.0)
    expect(playback.position).toBe(2.0)
  })
  test('clamps position to sequence playback range', () => {
    playback.scrubTo(200.0)
    expect(playback.position).toBe(sequence.duration)
    playback.scrubTo(-200.0)
    expect(playback.position).toBe(0.0)
  })
})

describe('Playback.adjustVisibleRange', () => {
  test('changes visible range', () => {
    playback.adjustVisibleRange(5.0, 10.0)
    expect(playback.visibleRange.start).toBe(5.0)
    expect(playback.visibleRange.end).toBe(10.0)
  })
  test('swaps inputs values if start > end', () => {
    playback.adjustVisibleRange(10.0, 5.0)
    expect(playback.visibleRange.start).toBe(5.0)
    expect(playback.visibleRange.end).toBe(10.0)
  })
  test('clamps to sequence duration', () => {
    playback.adjustVisibleRange(-200.0, 200.0)
    expect(playback.visibleRange.start).toBe(0.0)
    expect(playback.visibleRange.end).toBe(sequence.duration)
  })
})

describe('Playback.zoomExtents', () => {
  test('resets visible range to maximum', () => {
    playback.adjustVisibleRange(5.0, 10.0)
    playback.zoomExtents()
    expect(playback.visibleRange.start).toBe(0.0)
    expect(playback.visibleRange.end).toBe(sequence.duration)
  })
})

describe('Playback.tick', () => {
  test('does nothing if not playing', () => {
    playback.tick(0.16)
    expect(playback.isPlaying).toBe(false)
    expect(playback.position).toBe(0.0)
  })
  test('advances playback position if playing', () => {
    playback.play()
    playback.tick(0.016)
    expect(playback.isPlaying).toBe(true)
    expect(playback.position).toBe(0.016)
  })
  test('clamps position and stops at end of sequence', () => {
    playback.scrubTo(sequence.duration - 0.01)
    playback.play()
    playback.tick(0.016)
    expect(playback.isPlaying).toBe(false)
    expect(playback.position).toBe(sequence.duration)
  })
  test('shifts visible range if playhead goes out of view', () => {
    playback.adjustVisibleRange(2.0, 7.0)
    playback.scrubTo(6.999)
    playback.play()
    playback.tick(0.016)
    expect(playback.position).toBeGreaterThan(7.0)
    expect(playback.position).toBeCloseTo(7.015)
    expect(playback.visibleRange.start).toBe(7.0)
    expect(playback.visibleRange.end).toBe(12.0)
  })
  test('limits range bar shift at end of sequence', () => {
    playback.adjustVisibleRange(10.0, 14.0)
    playback.scrubTo(13.999)
    playback.play()
    playback.tick(0.016)
    expect(playback.position).toBeGreaterThan(14.0)
    expect(playback.position).toBeCloseTo(14.015)
    expect(playback.visibleRange.start).toBe(11.0)
    expect(playback.visibleRange.end).toBe(15.0)
  })
})
