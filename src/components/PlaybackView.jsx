import React from 'react'
import { observer } from 'mobx-react-lite'

const Button = ({ label, onClick }) => (
  <button style={{ fontSize: 16, minWidth: 100 }} onClick={(event) => { event.target.blur(); onClick() }}>
    {label}
  </button>
)

const PlaybackView = observer(({ sequence, playback }) => (
  <div>
    <h2>PlaybackView</h2>
    <ul style={{ margin: '8px 20px' }}>
      <li>sequence: {sequence.name}</li>
      <li>duration: {sequence.duration.toFixed(2)}</li>
      <li>position: {playback.position.toFixed(2)}</li>
      <li>visibleRange: {playback.visibleRange.start.toFixed(2)} .. {playback.visibleRange.end.toFixed(2)}</li>
      <li>isPlaying: {JSON.stringify(playback.isPlaying)}</li>
      <li>
        {playback.isPlaying ? (
          <Button label="stop" onClick={() => playback.stop()} />
        ) : (
          <Button label="play" onClick={() => playback.play()} />
        )}
      </li>
      <li>
        <Button label="load new" onClick={() => {
          const sequenceNum = Math.floor(Math.random() * 1000)
          const sequenceName = `seq_${String(sequenceNum).padStart(3, '0')}`
          const sequenceDuration = Math.random() * 29.0 + 1.0
          const stickEvents = {
            left: [{at: 1.0}],
            right: [],
          }
          const buttonEvents = {
            a: [{at: 1.5, type: 'press'}, {at: 3.0, type: 'hold', duration: 0.75}],
            b: [{at: 2.5, type: 'hold'}],
          }
          sequence.load(sequenceName, sequenceDuration, stickEvents, buttonEvents)
        }} />
      </li>
    </ul>
  </div>
))

export default PlaybackView
