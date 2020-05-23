const Promise = require('bluebird')
const objectDetection = require('../services/objectDetection')
const utility = require('../services/utility')

const redditService = require('../services/reddit')
module.exports = {
  async getRedditImagesAndClassify (options) {
    const resultJSON = []

    var links = await redditService.getImageLinks(options)

    await Promise.map(links, async objects => {
      // Download image
      var fileDetails = await utility.downloadFile(objects.data.url)

      const result = await objectDetection.detect(fileDetails.filename)
      resultJSON.push({ title: objects.data.title, imageURL: objects.data.url, result: result })
      utility.clearFiles(fileDetails.filename)
    }, { concurrency: 100 })

    return resultJSON
  }
}
