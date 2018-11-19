const https = require('https')
const needle = require('needle');
const fs = require('fs-extra');
module.exports = {
    async fetchAllImages(options) {
        const url = 'https://www.reddit.com/r/'
        let finalUrl = url + options.sub + '/' + options.cat + '.json'
        if (options.limit) {
            finalUrl += '?limit=' + options.limit
        }
        await fetchdata(finalUrl)
        console.log("Completed :-)")
        return true
    }
}

function fetchdata(finalUrl) {
    return new Promise(function(resolve, reject) {
        needle.get(finalUrl, async(error, response) => {
            if (!error && response.statusCode == 200) {
                let promises = []
                console.log(`Fetched a total of ${response.body.data.children.length} posts`)
                for (let objects of response.body.data.children) {
                    if (objects.data.thumbnail && objects.data.thubnail !== 'self' && objects.data.url) {
                        promises.push(downloadImages(objects.data.url, objects.data.id))
                    }
                }
                console.log(`Looking for ${promises.length} images`)
                await Promise.all(promises)
                resolve(true)
            }
        });
    })
}

function downloadImages(url, name) {
    return new Promise(function(resolve, reject) {
        needle.get(url, (error, response) => {
            if (!error && response.statusCode === 200) {
                fs.outputFile('temp/' + name, response.raw, err => {
                    if (err) throw err;
                    console.log(`Saved! ${name} from ${url}`);
                });
                resolve(true);
            }
        })

    })
}