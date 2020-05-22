'use strict'
var express = require('express')
var router = express.Router()
const reddit = require('../services/reddit')

/*
* @param req.query.sub {String} SubReddit name
* @param req.query.limit {String} limit of post to analyze
* @param req.query.cat {String} Category of posts
*/
router.get('/', async (req, res, next) => {
  try {
    /* Set basic options for download or set defaults if Get endpoint is called without parameters
        Default Values:
            1- Limit : 5
            2- Sub : pics
            3- Cat : hot
        */
    const options = {
      sub: (req.query.sub) ? req.query.sub : 'pics',
      cat: (req.query.cat) ? req.query.cat : 'hot',
      limit: (req.query.limit) ? req.query.limit : 5
    }
    const results = await reddit.fetchAllImages(options)
    res.json(results)
  } catch (err) {
    console.log(err)
    return res.status(400).send(err.message)
  }
})

module.exports = router
