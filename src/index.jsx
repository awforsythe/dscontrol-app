import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import Store from './state'

import { useRenderLoop } from './util'

import { useGlobalKeyDownHandler } from './components/common/util'
import PlaybackView from './components/PlaybackView'
import Joystick from './components/Joystick'
import TimelineControls from './components/TimelineControls'
import Timeline from './components/Timeline'

import './style.less'

const store = new Store()

function usePlaybackState() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackStartTime, setPlaybackStartTime] = useState(0.0)

  const prevTimestamp = useRef(null)
  const handle = useRef(null)
  function tick(timestamp) {
    if (prevTimestamp.current !== null) {
      const deltaSeconds = (timestamp - prevTimestamp.current) / 1000.0
      setPlaybackStartTime((prev) => prev + deltaSeconds)
    }
    prevTimestamp.current = timestamp
    handle.current = requestAnimationFrame(tick)
  }

  function onTogglePlayback() {
    if (isPlaying) {
      setIsPlaying(false)
      if (handle.current) {
        cancelAnimationFrame(handle.current)
        handle.current = null
      }
    } else {
      setIsPlaying(true)
      prevTimestamp.current = null
      handle.current = requestAnimationFrame(tick)
    }
  }

  function onJog(desiredPlaybackTime) {
    if (!isPlaying) {
      setPlaybackStartTime(desiredPlaybackTime)
    }
  }

  const playbackTime = playbackStartTime
  return [isPlaying, playbackTime, onTogglePlayback, onJog]
}

function App({ store }) {
  const [angle, setAngle] = useState(0.0)
  const [distance, setDistance] = useState(0.0)

  const [duration, setDuration] = useState(20.0)
  const [visibleRangeStartTime, setVisibleRangeStartTime] = useState(2.0)
  const [visibleRangeEndTime, setVisibleRangeEndTime] = useState(15.0)
  function onAdjustVisibleRange(newStartTime, newEndTime) {
    const needsSwap = newStartTime > newEndTime
    const actualNewStartTime = needsSwap ? newEndTime : newStartTime
    const actualNewEndTime = needsSwap ? newStartTime : newEndTime
    const clampedNewStartTime = Math.max(0.0, actualNewStartTime)
    const clampedNewEndTime = Math.min(duration, actualNewEndTime)
    setVisibleRangeStartTime(clampedNewStartTime)
    setVisibleRangeEndTime(clampedNewEndTime)
  }

  useRenderLoop((deltaSeconds) => {store.playback.tick(deltaSeconds)})

  const [isPlaying, playbackTime, onTogglePlayback, onJog] = usePlaybackState()

  useGlobalKeyDownHandler((event) => {
    if (event.key == ' ') {
      if (event.target.className !== 'play') {
        onTogglePlayback()
      }
    }
  })

  return (
    <>
      <div id="main-top">
        <h1>dscontrol</h1>
      </div>
      <div id="main-middle">
        <div id="main-left">
          <PlaybackView playback={store.playback} />
        </div>
        <div id="main-right">
          
        </div>
      </div>
      <div id="main-bottom">
        <div style={{ flex: '0 0 250px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <label>angle: </label>
          <input
            type="number"
            style={{ marginLeft: 10, width: 200 }}
            step={5}
            onChange={(event) => setAngle(event.target.value)}
            value={angle}
          />
          <label>distance: </label>
          <input
            type="number"
            style={{ marginLeft: 10, width: 200 }}
            step={0.1}
            onChange={(event) => setDistance(event.target.value)}
            value={distance}
          />
          <Joystick
            size={200}
            angle={angle / (180.0 / Math.PI)}
            distance={distance}
            onChange={(targetAngle, targetDistance) => {
              setAngle(targetAngle * (180.0 / Math.PI))
              setDistance(targetDistance)
            }}
          />
        </div>
        <TimelineControls
          isPlaying={isPlaying}
          onTogglePlayback={onTogglePlayback}
        />
        <Timeline
          isPlaying={isPlaying}
          duration={duration}
          visibleRangeStartTime={visibleRangeStartTime}
          visibleRangeEndTime={visibleRangeEndTime}
          playbackTime={playbackTime}
          onJog={onJog}
          onAdjustVisibleRange={onAdjustVisibleRange}
        >
          <div style={{ backgroundColor: 'rgba(128, 128, 255, 10%)'}} />
          <div style={{ backgroundColor: 'rgba(128, 128, 255, 10%)'}} />
          <div style={{ backgroundColor: 'rgba(128, 128, 255, 10%)'}} />
        </Timeline>
      </div>
    </>
  );
}

ReactDOM.render(<App store={store} />, document.getElementById('main'));
