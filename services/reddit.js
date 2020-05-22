const needle = require('needle')
const fs = require('fs-extra')
const Promise = require('bluebird')
const objectDetection = require('../services/objectDetection')
const utility = require('../services/utility')
module.exports = {
  async fetchAllImages (options) {
    // create URL
    const resultJSON = []
    const url = 'https://www.reddit.com/r/'
    let finalUrl = url + options.sub + '/' + options.cat + '.json'
    if (options.limit) {
      finalUrl += '?limit=' + options.limit
    }
    // Get all posts
    const receivedData = await needle('get', finalUrl).catch(err => {
      throw new Error('Failed: ' + err.message)
    })

    // Possible that search yielded nothing.
    if (receivedData.statusCode === 302) {
      throw new Error('Failed: ' + 'Cannot find data using provided parameters')
    }

    await Promise.map(receivedData.body.data.children, async objects => {
      // Download image
      console.log('Downloading Image: ' + objects.data.id)
      const file = await needle('get', objects.data.url).catch(err => { console.log(err); throw new Error('Failed: ' + err.message) })
      // Write to file
      await fs.outputFile('../temp/' + objects.data.id, file.raw, async err => {
        if (err) throw err
      })
      console.log(`Saved! ${objects.data.id} from ${objects.data.url}`)
      const result = await objectDetection.detect(objects.data.id)
      resultJSON.push({ title: objects.data.title, imageURL: objects.data.url, result: result })
      utility.clearFiles(objects.data.id)
    }, { concurrency: 100 })

    return resultJSON
  }
}
