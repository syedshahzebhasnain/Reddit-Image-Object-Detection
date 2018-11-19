const express = require('express')
const reddit = require('./services/reddit')
const app = express()
const port = 3000

app.get('/', async(req, res) => {
    try {
        let options = {
            sub: (req.query.sub) ? req.query.sub : 'pics',
            cat: (req.query.cat) ? req.query.cat : 'hot',
            limit: (req.query.limit) ? req.query.limit : 10
        }
        let results = await reddit.fetchAllImages(options)
        res.json(results)
    } catch (err) {
        console.log(err)
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))