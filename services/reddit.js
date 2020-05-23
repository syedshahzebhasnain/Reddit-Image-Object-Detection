const needle = require('needle')
const url = 'https://www.reddit.com/r/'

module.exports = {
  async getImageLinks (options) {
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

    return receivedData.body.data.children
  }
}
