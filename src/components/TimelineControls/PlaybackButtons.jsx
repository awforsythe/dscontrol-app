import React from 'react'
import PropTypes from 'prop-types'

const Button = ({ className, label, onClick }) => (
  <button className={className} onClick={(event) => { event.target.blur(); onClick() }}>
    {label}
  </button>
)

function PlaybackButtons(props) {
  const { isPlaying, onClickPlay, onClickRewind, onClickFastForward } = props
  return (
    <div className="playback-buttons">
      <Button className="rewind" label="<<" onClick={onClickRewind} />
      <Button className="play" label={isPlaying ? 'STOP' : 'PLAY'} onClick={onClickPlay} />
      <Button className="ffwd" label=">>" onClick={onClickFastForward} />
    </div>
  )
}
PlaybackButtons.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onClickPlay: PropTypes.func.isRequired,
  onClickRewind: PropTypes.func.isRequired,
  onClickFastForward: PropTypes.func.isRequired,
}

export default PlaybackButtons
