const path = require('path')

const loadFile = (day, formatter) => {
  return new Promise((resolve, reject) => {
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(path.join(__dirname, 'days', `day${day}`, 'input'))
    })

    const lines = []
    lineReader.on('line', line => {
      if (line) {
        if (formatter) lines.push(formatter(line))
        else lines.push(line)
      }
    })

    lineReader.on('close', () => {
      resolve(lines)
    })
  })
}

const loadSingleLineFile = async (day, formatter) => {
  const file = await loadFile(day, formatter)
  return file[0]
}

const loadCommaSeparatedFile = async (day, formatter) => {
  const file = await loadSingleLineFile(day)
  const values = file.split(',')
  if (formatter) return values.map(value => formatter(value))
  return values
}

module.exports = {
  loadFile,
  loadSingleLineFile,
  loadCommaSeparatedFile
}
