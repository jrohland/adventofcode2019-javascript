const { loadCommaSeparatedFile } = require('../../utils')

const decodeInstruction = (instructionStr) => {
  let opCode = 0
  let is1stParamPositionMode = true
  let is2ndParamPositionMode = true
  let is3rdParamPositionMode = true

  if (instructionStr.length <= 2) {
    opCode = parseInt(instructionStr)
  } else if (instructionStr.length === 3) {
    opCode = parseInt(instructionStr.substring(1))
    is1stParamPositionMode = (instructionStr.substring(0, 1) === '0')
  } else if (instructionStr.length === 4) {
    opCode = parseInt(instructionStr.substring(2))
    is1stParamPositionMode = (instructionStr.substring(1, 2) === '0')
    is2ndParamPositionMode = (instructionStr.substring(0, 1) === '0')
  } else if (instructionStr.length === 5) {
    opCode = parseInt(instructionStr.substring(3))
    is1stParamPositionMode = (instructionStr.substring(2, 3) === '0')
    is2ndParamPositionMode = (instructionStr.substring(1, 2) === '0')
    is3rdParamPositionMode = (instructionStr.substring(0, 1) === '0')
  } else {
    console.log(`Couldn't decode instruction ${instructionStr}`)
  }

  return {
    opCode,
    is1stParamPositionMode,
    is2ndParamPositionMode,
    is3rdParamPositionMode
  }
}

const executeInstruction = (memory, index, input) => {
  const instructionStr = memory[index].toString()
  const instruction = decodeInstruction(instructionStr)
  // console.log(`instruction ${instructionStr} opcode: ${instruction.opCode}`)

  switch (instruction.opCode) {
    case 99:
      return false
    case 1:
    case 2: {
      const firstVal = (instruction.is1stParamPositionMode) ? memory[memory[index + 1]] : memory[index + 1]
      const secondVal = (instruction.is2ndParamPositionMode) ? memory[memory[index + 2]] : memory[index + 2]

      const result = (instruction.opCode === 1) ? firstVal + secondVal : firstVal * secondVal
      memory[memory[index + 3]] = result
      return 4
    }
    case 3:
      memory[memory[index + 1]] = input
      return 2
    case 4: {
      const value = (instruction.is1stParamPositionMode) ? memory[memory[index + 1]] : memory[index + 1]
      console.log(value)
      return 2
    }
    case 5: {
      const firstVal = (instruction.is1stParamPositionMode) ? memory[memory[index + 1]] : memory[index + 1]
      const secondVal = (instruction.is2ndParamPositionMode) ? memory[memory[index + 2]] : memory[index + 2]

      if (firstVal !== 0) return secondVal - index
      return 3
    }
    case 6: {
      const firstVal = (instruction.is1stParamPositionMode) ? memory[memory[index + 1]] : memory[index + 1]
      const secondVal = (instruction.is2ndParamPositionMode) ? memory[memory[index + 2]] : memory[index + 2]

      if (firstVal === 0) return secondVal - index
      return 3
    }
    case 7: {
      const firstVal = (instruction.is1stParamPositionMode) ? memory[memory[index + 1]] : memory[index + 1]
      const secondVal = (instruction.is2ndParamPositionMode) ? memory[memory[index + 2]] : memory[index + 2]
      memory[memory[index + 3]] = (firstVal < secondVal) ? 1 : 0
      return 4
    }
    case 8: {
      const firstVal = (instruction.is1stParamPositionMode) ? memory[memory[index + 1]] : memory[index + 1]
      const secondVal = (instruction.is2ndParamPositionMode) ? memory[memory[index + 2]] : memory[index + 2]
      memory[memory[index + 3]] = (firstVal === secondVal) ? 1 : 0
      return 4
    }
  }

  return false
}

module.exports = async () => {
  const memory = await loadCommaSeparatedFile('05', parseInt)

  const input = 5
  let instructionIndex = 0
  let result = false
  do {
    result = executeInstruction(memory, instructionIndex, input)
    if (result) instructionIndex += result
  } while (result)

  console.log('Done:')
}
