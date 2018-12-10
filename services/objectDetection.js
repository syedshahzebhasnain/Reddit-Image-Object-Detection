const NUMBER_OF_CHANNELS = 3
const fs = require('fs-extra');
const jpeg = require('jpeg-js');
const tf = require('@tensorflow/tfjs');
module.exports = {
    async detect(path, model) {
        try {
            const image = jpeg.decode(fs.readFileSync('temp/' + path), true)
            const input = await imageToInput(image, NUMBER_OF_CHANNELS)
            const results = await model.classify(input)
                // Write Results here
            outputResults(results, path)
        } catch (err) {
            console.log('Not an Acceptable Image for Analysis')
        }
    }
}

const imageByteArray = (image, numChannels) => {
    const pixels = image.data
    const numPixels = image.width * image.height;
    const values = new Int32Array(numPixels * numChannels);
    for (let i = 0; i < numPixels; i++) {
        for (let channel = 0; channel < numChannels; ++channel) {
            values[i * numChannels + channel] = pixels[i * 4 + channel];
        }
    }
    return values
}
const imageToInput = (image, numChannels) => {
    const values = imageByteArray(image, numChannels)
    const outShape = [image.height, image.width, numChannels];
    const input = tf.tensor3d(values, outShape, 'int32');
    return input
}

const outputResults = async(results, path) => {
    await fs.writeJson(`temp/'${path}.json`, { results })
}