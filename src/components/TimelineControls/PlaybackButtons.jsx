import React from 'react'
import PropTypes from 'prop-types'

function PlaybackButtons(props) {
  return (
    <div className="playback-buttons">
      <button>&lt;&lt;</button>
      <button className="play">PLAY</button>
      <button>&gt;&gt;</button>
    </div>
  )
}
PlaybackButtons.propTypes = {
}

export default PlaybackButtons
