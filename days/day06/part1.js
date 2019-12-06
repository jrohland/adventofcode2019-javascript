const { loadFile } = require('../../utils')

const calculateNodeLength = (node, orbitTree) => {
  console.log('calculating node', node)
  if (node.length !== null) return node.length
  if (!orbitTree[node.parent]) return 1

  node.length = calculateNodeLength(orbitTree[node.parent], orbitTree) + 1
  return node.length
}

module.exports = async () => {
  const input = await loadFile('06', line => line.split(')'))

  const orbitTree = {}
  input.forEach(node => {
    orbitTree[node[1]] = {
      parent: node[0],
      length: null
    }
  })

  const total = _.sum(_.values(_.mapValues(orbitTree, node => calculateNodeLength(node, orbitTree))))
  console.log(`Done: ${total}`)
}
