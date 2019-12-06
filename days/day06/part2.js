const { loadFile } = require('../../utils')

const constructNodeHiarchy = (node, orbitTree) => {
  if (!orbitTree[node]) return [node]
  return [node, ...constructNodeHiarchy(orbitTree[node], orbitTree)]
}

module.exports = async () => {
  const input = await loadFile('06', line => line.split(')'))

  const orbitTree = {}
  input.forEach(node => {
    orbitTree[node[1]] = node[0]
  })

  const youOrbit = constructNodeHiarchy('YOU', orbitTree)
  const sanOrbit = constructNodeHiarchy('SAN', orbitTree)

  const commonNode = _.find(youOrbit, node => _.includes(sanOrbit, node))
  const truncatedYouOrbit = youOrbit.slice(1, youOrbit.indexOf(commonNode) + 1)
  const truncatedSanOrbit = sanOrbit.slice(2, sanOrbit.indexOf(commonNode))

  const length = truncatedYouOrbit.length + truncatedSanOrbit.length

  console.log(`Done: ${length}`)
}
