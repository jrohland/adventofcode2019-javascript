const { loadCommaSeparatedFile } = require('../../utils')

const executeInstruction = (instructionSet, memory) => {
  const opCode = instructionSet[0]
  if (opCode === 99) return false

  const firstVal = memory[instructionSet[1]]
  const secondVal = memory[instructionSet[2]]

  const result = (opCode === 1) ? firstVal + secondVal : firstVal * secondVal
  memory[instructionSet[3]] = result
  return true
}

module.exports = async () => {
  const values = await loadCommaSeparatedFile('02', parseInt)
  values[1] = 12
  values[2] = 2

  let instructionIndex = 0
  let result = false
  do {
    const actualIndex = instructionIndex * 4
    result = executeInstruction(values.slice(actualIndex, actualIndex + 4), values)
    instructionIndex++
  } while (result)

  console.log(`Done: ${values[0]}`)
}
