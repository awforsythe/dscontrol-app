import React from 'react'
import PropTypes from 'prop-types'

import PlaybackButtons from './PlaybackButtons'

import './style.less'

function TimelineControls(props) {
  return (
    <div className="timeline-controls">
      <div className="timeline-controls-top">
      </div>
      <div className="timeline-controls-middle">
      </div>
      <div className="timeline-controls-bottom">
        <PlaybackButtons />
      </div>
    </div>
  )
}
TimelineControls.propTypes = {
}

export default TimelineControls