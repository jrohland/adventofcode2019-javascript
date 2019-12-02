const utils = require('../../utils')

module.exports = async () => {
  const lines = await utils.loadFile('01', parseInt)
  const totalMass = _.sum(lines.map(mass => Math.floor(mass / 3) - 2))
  console.log(`Done: ${totalMass}`)
}
