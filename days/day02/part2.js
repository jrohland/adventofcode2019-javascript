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

  let noun = 0
  let verb = 0
  let resultFound = false

  for (noun = 0; noun <= 99; noun++) {
    for (verb = 0; verb <= 99; verb++) {
      const memory = values.slice(0)
      memory[1] = noun
      memory[2] = verb
      console.log(`Testing noun: ${noun} verb: ${verb}`)

      let instructionIndex = 0
      let result = false
      do {
        const actualIndex = instructionIndex * 4
        result = executeInstruction(values.slice(actualIndex, actualIndex + 4), memory)
        instructionIndex++
      } while (result)

      console.log(`Result: ${memory[0]}`)

      if (memory[0] === 19690720) {
        resultFound = true
        break
      }
    }

    if (resultFound) break
  }

  console.log(`Done: noun ${noun} verb ${verb}`)
}
