'use strict'
var express = require('express')
var router = express.Router()
const reddit = require('../services/reddit')
const mobileNetModel = require('../models/mobileNet.js')

var model = mobileNetModel.loadModel()

/*
* @param req.query.sub {String} SubReddit name
* @param req.query.limit {String} limit of post to analyze
* @param req.query.cat {String} Category of posts
*/
router.get('/', async(req, res, next) => {

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
        return res.status(400).send(err.message)
    }
})

module.exports = router