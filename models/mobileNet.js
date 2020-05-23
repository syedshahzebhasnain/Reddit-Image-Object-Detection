// @TODO: This needs to be refactored
const mobilenet = require('@tensorflow-models/mobilenet')
require('@tensorflow/tfjs-node')
global.fetch = require('node-fetch')

// Vaiables
let mobileNetModel = null

module.exports = {
/**
 *
 * @return {JSON} LoadModel
 *
 */
  async loadModel () {
    // loading the model only once
    if (mobileNetModel !== null) {
      return mobileNetModel
    }
    mobileNetModel = await mobilenet.load()

    return mobileNetModel
  }
}
