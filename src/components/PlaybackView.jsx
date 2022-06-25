import React from 'react'
import { observer } from 'mobx-react-lite'

const PlaybackView = observer(({ sequence, playback }) => (
  <div>
    <h2>PlaybackView</h2>
    <ul>
      <li>sequence: {sequence.name}</li>
      <li>duration: {sequence.duration.toFixed(2)}</li>
      <li>position: {playback.position.toFixed(2)}</li>
      <li>isPlaying: {JSON.stringify(playback.isPlaying)}</li>
      <li>
        {playback.isPlaying ? (
          <a href="#" onClick={() => playback.stop()}>stop</a>
        ) : (
          <a href="#" onClick={() => playback.play()}>play</a>
        )}
      </li>
    </ul>
  </div>
))

export default PlaybackView
