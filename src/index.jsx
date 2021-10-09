import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import Joystick from './components/Joystick.jsx'

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
        <div style={{ width: 500, height: '100%' }}>
          <label>angle: </label>
          <input
            type="number"
            step={5}
            onChange={(event) => setAngle(event.target.value)}
            value={angle}
          />
          <label>distance: </label>
          <input
            type="number"
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
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('main'));
