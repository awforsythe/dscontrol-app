import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import ReactDOM from 'react-dom'

import Joystick from './components/Joystick'
import TimelineControls from './components/TimelineControls'
import Timeline from './components/Timeline'

import './style.less'

function usePlaybackState() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackStartTime, setPlaybackStartTime] = useState(0.0)

  function onTogglePlayback() {
    setIsPlaying((prev) => !prev)
  }

  function onJog(desiredPlaybackTime) {
    if (!isPlaying) {
      setPlaybackStartTime(desiredPlaybackTime)
    }
  }

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

  useEffect(() => {
    handle.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(handle.current)
    }
  }, [])

  const playbackTime = playbackStartTime
  return [isPlaying, playbackTime, onTogglePlayback, onJog]
}

function App() {
  const [angle, setAngle] = useState(0.0)
  const [distance, setDistance] = useState(0.0)

  const [duration, setDuration] = useState(20.0)
  const [isPlaying, playbackTime, onTogglePlayback, onJog] = usePlaybackState()

  return (
    <>
      <div id="main-top">
        <h1>dscontrol</h1>
      </div>
      <div id="main-middle">
        <div id="main-left">
          middle left
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
          visibleRangeStartTime={2.0}
          visibleRangeEndTime={15.0}
          playbackTime={playbackTime}
          onJog={onJog}
        />
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('main'));
