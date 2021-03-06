const { loadMultilineCommaSeparatedFile } = require('../../utils')

const inputFormatter = (str) => {
  const direction = str.substring(0, 1)
  const distance = parseInt(str.substring(1))
  return {
    direction,
    distance
  }
}

const traceWire = (wire, wireGrid) => {
  const coords = {
    x: 0,
    y: 0
  }

  wire.instructions.forEach(instruction => {
    // console.log('New instruction', instruction)
    let distanceLeft = instruction.distance
    while (distanceLeft > 0) {
      switch (instruction.direction) {
        case 'U':
          coords.y++
          break
        case 'D':
          coords.y--
          break
        case 'R':
          coords.x++
          break
        case 'L':
          coords.x--
          break
      }

      if (!wireGrid[coords.x]) wireGrid[coords.x] = {}
      if (!wireGrid[coords.x][coords.y]) wireGrid[coords.x][coords.y] = new Set()

      // console.log(`Wire now at x: ${coords.x} y: ${coords.y}`)
      wireGrid[coords.x][coords.y].add(wire.index)

      distanceLeft--
    }
  })
}

const findIntersections = (wireGrid) => {
  const intersections = []
  _.keys(wireGrid).forEach(x => {
    _.keys(wireGrid[x]).forEach(y => {
      if (wireGrid[x][y].size >= 2) intersections.push({ x, y })
    })
  })
  return intersections
}

module.exports = async () => {
  const wires = await loadMultilineCommaSeparatedFile('03', inputFormatter)
  const wireGrid = {}

  wires.forEach((wireInstructions, wireIndex) => {
    console.log(`Tracing wire ${wireIndex}`)
    traceWire({
      index: wireIndex,
      instructions: wireInstructions
    }, wireGrid)
  })

  const intersections = findIntersections(wireGrid)
  const distances = intersections.map(coords => {
    return Math.abs(coords.x) + Math.abs(coords.y)
  })
  const minDistance = _.min(distances)

  console.log(`Done: ${minDistance}`)
}
