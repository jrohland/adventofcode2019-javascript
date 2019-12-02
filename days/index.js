const path = require('path')

const days = require('require-all')({
  dirname: path.join(__dirname),
  excludeDirs: /^\.(git|svn)$/,
  recursive: true,
  filter: (fileName) => {
    const parts = fileName.split('.')
    if (parts[parts.length - 1] === 'js' && parts[0] !== 'index') return parts[0]
  }
})

module.exports = days
