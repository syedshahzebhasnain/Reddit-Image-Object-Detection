const fs = require('fs-extra')
const download = require('image-downloader')

module.exports = {
  clearFiles (path) {
    fs.stat(`${path}`, function (err, stats) {
      if (err) {
        return console.error(err)
      }
      fs.unlink(`${path}`, function (err) {
        if (err) return console.log(err)
      })
    })
  },

  async downloadFile (url) {
    console.log(`Downloading Image: ${url}`)
    const options = {
      url: url,
      dest: 'temp'
    }

    var downloadDetails = await download.image(options)

    console.log(`Saved! ${downloadDetails.filename} from ${url}`)

    return downloadDetails
  }
}
