// @TODO : Refactor better error handling
// @TODO : Segregate the services. Currently they are somewhat coupled.
// @TODO : Write readme for the project
// @TODO : Stretch goal. Need to update the models to latest version
// @TODO : Write tests for controller and services


// Load Services
global.fetch = require('node-fetch')
const express = require('express')
const reddit = require('./services/reddit')
const tf = require('@tensorflow/tfjs')

// Load TensorFlow models
// This may take a while. Hang on!
const mobilenet = require('@tensorflow-models/mobilenet');
require('@tensorflow/tfjs-node')
let model = null

// Load Express. Set port to 3000
const app = express()
const port = 3000

// handling Errors
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

// Controllers

/*
* @param req.query.sub {String} SubReddit name
* @param req.query.limit {String} limit of post to analyze
* @param req.query.cat {String} Category of posts
*/
app.get('/', async(req, res) => {
    try {
        if (!model) {
            return res.send("Model is not loaded yet. Please try again later.")
        }
        /* Set basic options for download or set defaults if Get endpoint is called without parameters
        Default Values: 
            1- Limit : 5 
            2- Sub : pics
            3- Cat : hot
        */
        let options = {
            sub: (req.query.sub) ? req.query.sub : 'pics',
            cat: (req.query.cat) ? req.query.cat : 'hot',
            limit: (req.query.limit) ? req.query.limit : 5
        }
        let results = await reddit.fetchAllImages(options, model)
        res.json(results)
    } catch (err) {
        console.log(err)
    }
})

/* 2 things happening here !

    1- Load the mobile net library for object detection
    2- Start listening on port defined in PORT

*/
app.listen(port, async() => {
    // Loading Models Here
    const mn = new mobilenet.MobileNet(1, 1);
    mn.path = `https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json`
    await mn.load()
    model = mn
    console.log(`Example app listening on port ${port}!`)
})


