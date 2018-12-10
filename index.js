const express = require('express')
const reddit = require('./services/reddit')
const app = express()
const port = 3000
    // Details Here
global.fetch = require('node-fetch')
const tf = require('@tensorflow/tfjs')
const mobilenet = require('@tensorflow-models/mobilenet');
require('@tensorflow/tfjs-node')
let model = null

app.get('/', async(req, res) => {
    try {
        // Set basic options for download or set defaults if Get called without parameters
        let options = {
            sub: (req.query.sub) ? req.query.sub : 'pics',
            cat: (req.query.cat) ? req.query.cat : 'hot',
            limit: (req.query.limit) ? req.query.limit : 10
        }
        let results = await reddit.fetchAllImages(options, model)
        res.json(results)
    } catch (err) {
        console.log(err)
    }
})
app.listen(port, async() => {
    // Loading Models Here
    const mn = new mobilenet.MobileNet(1, 1);
    mn.path = `https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json`
    await mn.load()
    model = mn
    console.log(`Example app listening on port ${port}!`)
})