import React from 'react'
import PropTypes from 'prop-types'

import PlaybackButtons from './PlaybackButtons'

import './style.less'

function TimelineControls(props) {
  const { isPlaying, onTogglePlayback } = props
  return (
    <div className="timeline-controls">
      <div className="timeline-controls-top">
      </div>
      <div className="timeline-controls-middle">
      </div>
      <div className="timeline-controls-bottom">
        <PlaybackButtons
          isPlaying={isPlaying}
          onClickPlay={onTogglePlayback}
        />
      </div>
    </div>
  )
}
TimelineControls.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onTogglePlayback: PropTypes.func.isRequired,
}

export default TimelineControls