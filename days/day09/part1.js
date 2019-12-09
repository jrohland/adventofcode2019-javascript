const { loadCommaSeparatedFile } = require('../../utils')

const decodeInstruction = (instruction) => {
  const opCode = instruction % 100
  const firstParamPositionMode = ((instruction % 1000) - opCode) / 100
  const secondParamPositionMode = ((instruction % 10000) - (instruction % 1000)) / 1000
  const thirdParamPositionMode = ((instruction % 100000) - (instruction % 10000)) / 10000

  return {
    opCode,
    modes: [
      firstParamPositionMode,
      secondParamPositionMode,
      thirdParamPositionMode
    ]
  }
}

const calculateValue = (memory, index, mode, relativeBase) => {
  try {
    switch (mode) {
      case 0:
        return memory[memory[index]]
      case 1:
        return memory[index]
      case 2:
        return memory[memory[index] + relativeBase]
    }
  } catch (error) {
    return 0
  }
}

const executeInstruction = (memory, index, input, relativeBase) => {
  const instruction = decodeInstruction(memory[index])
  console.log(`instruction: ${memory[index]}`, instruction)

  const values = []
  for (let i = 0; i < 3; i++) {
    values[i] = calculateValue(memory, index + i + 1, instruction.modes[i], relativeBase)
  }
  // console.log(`values ${values}`)

  const retVal = {
    output: false,
    skipOps: 0,
    relativeBase
  }

  switch (instruction.opCode) {
    case 99:
      break
    case 1:
    case 2: {
      const result = (instruction.opCode === 1) ? values[0] + values[1] : values[0] * values[1]
      memory[memory[index + 3]] = result

      retVal.output = true
      retVal.skipOps = 4
      break
    }
    case 3: {
      if (input.length === 0) {
        retVal.output = true
        retVal.skipOps = 0
      } else {
        const [nextInput] = input.splice(0, 1)
        memory[memory[index + 1]] = nextInput

        retVal.output = true
        retVal.skipOps = 2
      }
      break
    }
    case 4: {
      retVal.output = values[0]
      retVal.skipOps = 2
      break
    }
    case 5: {
      if (values[0] !== 0) {
        retVal.output = true
        retVal.skipOps = values[1] - index
      } else {
        retVal.output = true
        retVal.skipOps = 3
      }
      break
    }
    case 6: {
      if (values[0] === 0) {
        retVal.output = true
        retVal.skipOps = values[1] - index
      } else {
        retVal.output = true
        retVal.skipOps = 3
      }
      break
    }
    case 7: {
      memory[memory[index + 3]] = (values[0] < values[1]) ? 1 : 0
      retVal.output = true
      retVal.skipOps = 4
      break
    }
    case 8: {
      memory[memory[index + 3]] = (values[0] === values[1]) ? 1 : 0
      retVal.output = true
      retVal.skipOps = 4
      break
    }
    case 9: {
      retVal.output = true
      retVal.skipOps = 2
      retVal.relativeBase = relativeBase + values[0]
      break
    }
  }

  return retVal
}

const sleep = (time) => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

module.exports = async () => {
  const memory = await loadCommaSeparatedFile('09', parseInt)

  const inputs = [1]
  let relativeBase = 0
  let instructionIndex = 0
  let programRunning = true
  do {
    const result = executeInstruction(memory, instructionIndex, inputs, relativeBase)
    console.log(result)
    if (result.output !== false && result.output !== true) console.log(result.output)
    else if (result.output === false) programRunning = false
    instructionIndex += result.skipOps
    relativeBase = result.relativeBase
    await sleep(100)
  } while (programRunning)

  console.log('Done:')
}

// 203 too low
