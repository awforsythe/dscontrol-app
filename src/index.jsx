import React, { useState, useEffect } from 'react'
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

  useRenderLoop((deltaSeconds) => store.playback.tick(deltaSeconds))
  useGlobalKeyDownHandler((event) => {
    if (event.key == ' ') {
      store.playback.toggle()
    }
  })

  return (
    <>
      <div id="main-top">
        <h1>dscontrol</h1>
      </div>
      <div id="main-middle">
        <div id="main-left">
          <PlaybackView
            sequence={store.sequence}
            playback={store.playback}
          />
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
          onSeekToStart={() => store.playback.seekToStart()}
          onSeekToEnd={() => store.playback.seekToEnd()}
        />
        <Timeline
          isPlaying={store.playback.isPlaying}
          duration={store.sequence.duration}
          visibleRangeStartTime={store.playback.visibleRange.start}
          visibleRangeEndTime={store.playback.visibleRange.end}
          playbackTime={store.playback.position}
          onJog={(newPosition) => store.playback.scrubTo(newPosition)}
          onAdjustVisibleRange={(newStart, newEnd) => store.playback.adjustVisibleRange(newStart, newEnd)}
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
