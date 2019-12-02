// Add lodash to globals
global._ = require('lodash')

const argv = require('minimist')(process.argv.slice(2))

const padDate = (day) => {
  const dayStr = '' + day
  if (dayStr.length === 1) return '0' + dayStr
  return dayStr
}

if (!argv.day) {
  console.log('No day supplied')
  process.exit(1)
}

if (!argv.part) {
  console.log('No part supplied')
  process.exit(1)
}

const day = 'day' + padDate(argv.day)
const part = 'part' + argv.part

const days = require('./days')

if (!days[day] || !days[day][part]) {
  console.log(`No solution for ${day} ${part}`)
  process.exit(1)
}

console.log(`Running solution for ${day} ${part}`)
days[day][part]()
