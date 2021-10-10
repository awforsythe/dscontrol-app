function getChildRegions(children) {
  if (!children) {
    return []
  }
  const childArray = Array.isArray(children) ? children : [children]
  return childArray.filter((x) => x.type.name === 'CanvasRegion')
}

function getDesiredRegionSize(regionProps) {
  if (regionProps.fixed !== undefined) {
    return { fixed: true, sizeOrRatio: Math.round(regionProps.fixed) }
  }
  const ratio = regionProps.ratio !== undefined ? regionProps.ratio : 1.0
  return { fixed: false, sizeOrRatio: ratio }
}

function computeRegionSize(ratio, totalRatio, totalFlexSize, remainingFlexSize, numRemainingRatioRegions) {
  if (numRemainingRatioRegions === 1) {
    return remainingFlexSize
  }
  const percentageOfFlexSize = ratio / totalRatio
  const actualSize = Math.max(remainingFlexSize, Math.round(percentageOfFlexSize * totalFlexSize))
  return actualSize
}

function computeRegionRects(orientation, parentRect, childRegions) {
  // Run an initial loop to figure out how much size is occupied by fixed regions, and how much is
  // left over to be split proportionally based on the other regions' ratio properties
  let totalFixedSize = 0
  let totalRatio = 0.0
  let numRemainingRatioRegions = 0
  for (const region of childRegions) {
    const { fixed, sizeOrRatio } = getDesiredRegionSize(region.props)
    if (fixed) {
      const size = sizeOrRatio
      totalFixedSize += size
    } else {
      const ratio = sizeOrRatio
      totalRatio += ratio
      numRemainingRatioRegions++
    }
  }

  // Compute a final size in pixels for each region, using up exactly the amount of space
  // available: some regions may be 0-sized if there's not enough space for them
  const isHorizontal = orientation === 'horizontal'
  const availableSize = orientation === isHorizontal ? parentRect.width : parentRect.height
  const totalFlexSize = availableSize - totalFixedSize
  let coord = orientation === isHorizontal ? parentRect.x : parentRect.y
  let remainingFlexSize = Math.max(0, totalFlexSize)
  let regionRects = []
  for (const region of childRegions) {
    let size = 0
    const { fixed, sizeOrRatio } = getDesiredRegionSize(region.props)
    if (fixed) {
      size = sizeOrRatio
    } else {
      const ratio = sizeOrRatio
      size = computeRegionSize(ratio, totalRatio, totalFlexSize, remainingFlexSize, numRemainingRatioRegions)
      remainingFlexSize -= size
      numRemainingRatioRegions--
    }
    const rect = {
      x: isHorizontal ? coord : parentRect.x,
      y: isHorizontal ? parentRect.y : coord,
      width: isHorizontal ? size : parentRect.width,
      height: isHorizontal ? parentRect.height : size,
    }
    coord += size
    regionRects.push(rect)
  }
  return regionRects
}

export { getChildRegions, computeRegionRects }
