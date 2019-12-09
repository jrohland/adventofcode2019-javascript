const { loadCommaSeparatedFile } = require('../../utils')

const decodeInstruction = (instruction) => {
  const opCode = instruction % 100
  const is1stParamPositionMode = ((instruction % 1000) - opCode) === 0
  const is2ndParamPositionMode = ((instruction % 10000) - (instruction % 1000)) === 0
  const is3rdParamPositionMode = ((instruction % 100000) - (instruction % 10000)) === 0

  return {
    opCode,
    is1stParamPositionMode,
    is2ndParamPositionMode,
    is3rdParamPositionMode
  }
}

const executeInstruction = (memory, index, input) => {
  const instruction = decodeInstruction(memory[index])
  // console.log(`instruction ${instructionStr} opcode: ${instruction.opCode}`)

  switch (instruction.opCode) {
    case 99:
      return {
        output: false,
        skipOps: 0
      }
    case 1:
    case 2: {
      const firstVal = (instruction.is1stParamPositionMode) ? memory[memory[index + 1]] : memory[index + 1]
      const secondVal = (instruction.is2ndParamPositionMode) ? memory[memory[index + 2]] : memory[index + 2]

      const result = (instruction.opCode === 1) ? firstVal + secondVal : firstVal * secondVal
      memory[memory[index + 3]] = result
      return {
        output: true,
        skipOps: 4
      }
    }
    case 3:
      memory[memory[index + 1]] = input.pop()
      return {
        output: true,
        skipOps: 2
      }
    case 4: {
      const value = (instruction.is1stParamPositionMode) ? memory[memory[index + 1]] : memory[index + 1]
      return {
        output: value,
        skipOps: 2
      }
    }
    case 5: {
      const firstVal = (instruction.is1stParamPositionMode) ? memory[memory[index + 1]] : memory[index + 1]
      const secondVal = (instruction.is2ndParamPositionMode) ? memory[memory[index + 2]] : memory[index + 2]

      if (firstVal !== 0) {
        return {
          output: true,
          skipOps: secondVal - index
        }
      }
      return {
        output: true,
        skipOps: 3
      }
    }
    case 6: {
      const firstVal = (instruction.is1stParamPositionMode) ? memory[memory[index + 1]] : memory[index + 1]
      const secondVal = (instruction.is2ndParamPositionMode) ? memory[memory[index + 2]] : memory[index + 2]

      if (firstVal === 0) return secondVal - index
      return {
        output: true,
        skipOps: 3
      }
    }
    case 7: {
      const firstVal = (instruction.is1stParamPositionMode) ? memory[memory[index + 1]] : memory[index + 1]
      const secondVal = (instruction.is2ndParamPositionMode) ? memory[memory[index + 2]] : memory[index + 2]
      memory[memory[index + 3]] = (firstVal < secondVal) ? 1 : 0
      return {
        output: true,
        skipOps: 4
      }
    }
    case 8: {
      const firstVal = (instruction.is1stParamPositionMode) ? memory[memory[index + 1]] : memory[index + 1]
      const secondVal = (instruction.is2ndParamPositionMode) ? memory[memory[index + 2]] : memory[index + 2]
      memory[memory[index + 3]] = (firstVal === secondVal) ? 1 : 0
      return {
        output: true,
        skipOps: 4
      }
    }
  }

  return {
    output: false,
    skipOps: 0
  }
}

const permutator = (inputArr) => {
  const result = []

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice()
        const next = curr.splice(i, 1)
        permute(curr.slice(), m.concat(next))
      }
    }
  }

  permute(inputArr)
  return result
}

module.exports = async () => {
  const instructions = await loadCommaSeparatedFile('07', parseInt)

  const phaseSettings = permutator([5, 6, 7, 8, 9])

  let maxVal = null
  let maxValPhases = null

  phaseSettings.forEach(currentPhaseSettings => {
    const ampMemories = currentPhaseSettings.map(phase => instructions.slice(0))
    const ampIndexes = [0, 0, 0, 0, 0]

    let currentInput = 0
    currentPhaseSettings.forEach((phase, ampIndex) => {
      const memory = ampMemories[ampIndex]
      currentInput.push(phase)
      let instructionIndex = 0
      let result = false
      const outputs = []
      do {
        result = executeInstruction(memory, instructionIndex, currentInput)
        if (result.output !== false && result.output !== true) outputs.push(result.output)
        else {
          currentInput = outputs
        }
        instructionIndex += result.skipOps
      } while (result.output !== false)
    })

    if (!maxVal || lastOutput > maxVal) {
      maxVal = lastOutput
      maxValPhases = currentPhaseSettings
    }
  })

  console.log(`Done: max val: ${maxVal}, phases: ${maxValPhases}`)
}
