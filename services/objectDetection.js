
const fs = require('fs-extra')
const tfnode = require('@tensorflow/tfjs-node')
const mobileNetModel = require('../models/mobileNet.js')
module.exports = {
  async detect (filepath) {
    try {
      if (!filepath.endsWith('.jpg')) {
        return 'Cannot Evaluate File/ Results not available'
      }

      // Load the images in the temp path
      const input = imageToInput(filepath)

      // Load Modal
      var model = await mobileNetModel.loadModel()
      // Classify the image.
      const results = await model.classify(input)
      return results
    } catch (err) {
      console.log(err)
      return 'Cannot Evaluate File/ Results not available'
    }
  }
}

const imageToInput = (path) => {
  const imageContent = fs.readFileSync(path)
  const tfimage = tfnode.node.decodeImage(imageContent)
  return tfimage
}
