import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import Joystick from './components/Joystick'
import Timeline from './components/Timeline'

import './style.less'

function App() {
  const [angle, setAngle] = useState(0.0)
  const [distance, setDistance] = useState(0.0)
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
        <Timeline
          duration={20.0}
          visibleRangeStartTime={0.0}
          visibleRangeEndTime={10.0}
          playbackTime={5.0}
        />
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('main'));
