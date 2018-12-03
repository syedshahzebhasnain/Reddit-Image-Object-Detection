const express = require('express')
const reddit = require('./services/reddit')
const app = express()
const port = 3000
    // Tensor Flow libraries
const tf = require('@tensorflow/tfjs')
const mobilenet = require('@tensorflow-models/mobilenet');
require('@tensorflow/tfjs-node')
    // Load Models
const path = "mobilenet/model.json"
const mn = new mobilenet.MobileNet(1, 1);
mn.path = `file://${path}`
const model = mn.load()

app.get('/', async(req, res) => {
    try {
        // Set basic options for download or set defaults if Get called without parameters
        let options = {
            sub: (req.query.sub) ? req.query.sub : 'pics',
            cat: (req.query.cat) ? req.query.cat : 'hot',
            limit: (req.query.limit) ? req.query.limit : 30
        }
        let results = await reddit.fetchAllImages(options, model)
        res.json(results)
    } catch (err) {
        console.log(err)
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))