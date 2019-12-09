const { loadSingleLineFile } = require('../../utils')

module.exports = async () => {
  const input = (await loadSingleLineFile('08')).split('').map(char => parseInt(char))

  const layers = []
  let index = 0
  do {
    const rows = []
    for (let y = 0; y < 6; y++) {
      rows.push(input.slice(index, index + 25))
      index += 25
    }
    layers.push(rows)
  } while (index < input.length)

  const finalImage = []
  for (let y = 0; y < 6; y++) {
    finalImage[y] = []
    for (let x = 0; x < 25; x++) {
      finalImage[y][x] = 2
    }
  }

  layers.forEach(layer => {
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 25; x++) {
        if (finalImage[y][x] === 2) finalImage[y][x] = layer[y][x]
      }
    }
  })

  for (let y = 0; y < 6; y++) {
    let row = ''
    for (let x = 0; x < 25; x++) {
      row += ((finalImage[y][x] === 0) ? 'X' : ' ')
    }
    console.log(row)
  }
}
