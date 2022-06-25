import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { observer } from 'mobx-react-lite'

import Store from './state'

import { useRenderLoop } from './util'

import { useGlobalKeyDownHandler } from './components/common/util'
import PlaybackView from './components/PlaybackView'
import Joystick from './components/Joystick'
import TimelineControls from './components/TimelineControls'
import Timeline from './components/Timeline'

import './style.less'

const store = new Store()

const App = observer(({ store }) => {
  const [angle, setAngle] = useState(0.0)
  const [distance, setDistance] = useState(0.0)

  const [visibleRangeStartTime, setVisibleRangeStartTime] = useState(2.0)
  const [visibleRangeEndTime, setVisibleRangeEndTime] = useState(15.0)
  function onAdjustVisibleRange(newStartTime, newEndTime) {
    const needsSwap = newStartTime > newEndTime
    const actualNewStartTime = needsSwap ? newEndTime : newStartTime
    const actualNewEndTime = needsSwap ? newStartTime : newEndTime
    const clampedNewStartTime = Math.max(0.0, actualNewStartTime)
    const clampedNewEndTime = Math.min(store.playback.duration, actualNewEndTime)
    setVisibleRangeStartTime(clampedNewStartTime)
    setVisibleRangeEndTime(clampedNewEndTime)
  }

  useRenderLoop((deltaSeconds) => store.playback.tick(deltaSeconds))
  useGlobalKeyDownHandler((event) => {
    if (event.key == ' ') {
      if (event.target.className !== 'play') {
        store.playback.toggle()
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
          isPlaying={store.playback.isPlaying}
          onTogglePlayback={() => store.playback.toggle()}
        />
        <Timeline
          isPlaying={store.playback.isPlaying}
          duration={store.playback.duration}
          visibleRangeStartTime={visibleRangeStartTime}
          visibleRangeEndTime={visibleRangeEndTime}
          playbackTime={store.playback.position}
          onJog={(newPosition) => store.playback.scrubTo(newPosition)}
          onAdjustVisibleRange={onAdjustVisibleRange}
        >
          <div style={{ backgroundColor: 'rgba(128, 128, 255, 10%)'}} />
          <div style={{ backgroundColor: 'rgba(128, 128, 255, 10%)'}} />
          <div style={{ backgroundColor: 'rgba(128, 128, 255, 10%)'}} />
        </Timeline>
      </div>
    </>
  );
})

ReactDOM.render(<App store={store} />, document.getElementById('main'));
