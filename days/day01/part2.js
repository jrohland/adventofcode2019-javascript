const utils = require('../../utils')

module.exports = async () => {
  const lines = await utils.loadFile('01', parseInt)
  const totalMass = _.sum(lines.map(mass => calculateFuel(mass)))
  console.log(`Done: ${totalMass}`)
}

const calculateFuel = (mass) => {
  if (mass === 0) return 0
  const fuel = Math.max(Math.floor(mass / 3) - 2, 0)
  return fuel + calculateFuel(fuel)
}
