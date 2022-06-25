import React, { useEffect } from 'react'

function useRenderLoop(callback) {
  // Establish some state that's internal to the hook
  let mounted = false
  let requestId = null
  let prevTimestamp = null

  // Establish a callback that the browser will call once per screen refresh
  function animationFrameCallback(timestamp) {
    // Compute the time elapsed since the last repaint
    if (prevTimestamp === null) {
      prevTimestamp = timestamp
    }
    const deltaSeconds = (timestamp - prevTimestamp) / 1000.0
    prevTimestamp = timestamp

    // The update function supplied to the hook should take deltaTime as a parameter
    if (deltaSeconds !== 0.0) {
      callback(deltaSeconds)
    }
    
    // Unless the calling component has been unmounted, schedule the next update
    if (mounted) {
      requestId = window.requestAnimationFrame(animationFrameCallback)
    }
  }

  // On mount, begin firing the supplied callback on each repaint, until unmounted
  useEffect(() => {
    mounted = true
    requestId = window.requestAnimationFrame(animationFrameCallback)
    return () => {
      mounted = false
      if (requestId !== null) {
        window.cancelAnimationFrame(requestId)
        requestId = null
      }
    }
  })
}

export { useRenderLoop }
