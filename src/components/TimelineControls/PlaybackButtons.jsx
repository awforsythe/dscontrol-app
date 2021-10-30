import React from 'react'
import PropTypes from 'prop-types'

function PlaybackButtons(props) {
  const { isPlaying, onClickPlay } = props
  return (
    <div className="playback-buttons">
      <button>&lt;&lt;</button>
      <button className="play" onClick={onClickPlay}>{isPlaying ? 'STOP' : 'PLAY'}</button>
      <button>&gt;&gt;</button>
    </div>
  )
}
PlaybackButtons.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onClickPlay: PropTypes.func.isRequired,
}

export default PlaybackButtons
