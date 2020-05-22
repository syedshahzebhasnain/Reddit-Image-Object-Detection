const NUMBER_OF_CHANNELS = 3
const fs = require('fs-extra')
const jpeg = require('jpeg-js')
const tf = require('@tensorflow/tfjs')
const mobileNetModel = require('../models/mobileNet.js')
var model = mobileNetModel.loadModel()
module.exports = {
  async detect (fileName) {
    try {
      // Load the images in the temp path
      const image = await jpeg.decode(fs.readFileSync('../temp/' + fileName), true)

      // Configure the input image to be put into classifier
      const input = await imageToInput(image, NUMBER_OF_CHANNELS)

      // Classify the image.
      const results = await model.classify(input)
      return results
    } catch (err) {
      console.log(err)
      return 'Cannot Evaluate File/ Results not available'
    }
  }
}

const imageByteArray = (image, numChannels) => {
  const pixels = image.data
  const numPixels = image.width * image.height
  const values = new Int32Array(numPixels * numChannels)
  for (let i = 0; i < numPixels; i++) {
    for (let channel = 0; channel < numChannels; ++channel) {
      values[i * numChannels + channel] = pixels[i * 4 + channel]
    }
  }
  return values
}

const imageToInput = (image, numChannels) => {
  const values = imageByteArray(image, numChannels)
  const outShape = [image.height, image.width, numChannels]
  const input = tf.tensor3d(values, outShape, 'int32')
  return input
}
