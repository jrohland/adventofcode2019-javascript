const { loadSingleLineFile } = require('../../utils')

const validateNumber = (num) => {
  const numStr = num.toString()

  let numsAreIncreasing = true
  let hasAdjacentMatch = false
  for (let i = 0; i < numStr.length - 1; i++) {
    if (numStr[i + 1] < numStr[i]) numsAreIncreasing = false
    if (numStr[i] === numStr[i + 1]) {
      if (i + 2 < numStr.length && numStr[i + 2] === numStr[i]) {
        let newIndex = i + 3
        while (newIndex < numStr.length && numStr[newIndex] === numStr[i]) {
          newIndex++
        }

        i = newIndex - 2
      } else {
        hasAdjacentMatch = true
      }
    }
  }

  return hasAdjacentMatch && numsAreIncreasing
}

module.exports = async () => {
  const range = (await loadSingleLineFile('04')).split('-').map(num => parseInt(num))

  let matchCount = 0
  for (let testNum = range[0]; testNum <= range[1]; testNum++) {
    if (validateNumber(testNum)) matchCount++
  }

  console.log(`Done: ${matchCount}`)
}
