const fs = require('fs-extra')

module.exports = {
  clearFiles (path) {
    fs.stat(`temp/${path}`, function (err, stats) {
      if (err) {
        return console.error(err)
      }
      fs.unlink(`temp/${path}`, function (err) {
        if (err) return console.log(err)
      })
    })
  }
}
