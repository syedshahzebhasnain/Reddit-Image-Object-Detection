const NUMBER_OF_CHANNELS = 3
const fs = require('fs-extra');
const jpeg = require('jpeg-js');
module.exports = {
    async detect(path, model) {
        const image = jpeg.decode(fs.readFileSync(path), true)
        const input = imageToInput(image, NUMBER_OF_CHANNELS)
        const results = await model.classify(input)
        console.log("=====================")
        console.log(results)
        console.log("=====================")
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