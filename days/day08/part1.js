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

  console.log(layers)

  const zeroCounts = layers.map(layer => {
    return _.countBy(_.flatten(layer), num => num === 0)
  }).map(result => result.true)
  const minZero = _.min(zeroCounts)
  const minZeroIndex = _.indexOf(zeroCounts, minZero)

  const oneCount = _.countBy(_.flatten(layers[minZeroIndex]), num => num === 1).true
  const twoCount = _.countBy(_.flatten(layers[minZeroIndex]), num => num === 2).true

  console.log(`Done: oneCount: ${oneCount} twoCount: ${twoCount} multiplied: ${oneCount * twoCount}`)
}
