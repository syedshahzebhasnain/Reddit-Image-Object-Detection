const https = require('https')
const needle = require('needle');
const fs = require('fs-extra');
const Promise = require('bluebird');
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
                await downloadImagesImproved(response.body.data.children)
                resolve(true)
            }
        });
    })
}

function downloadImagesImproved(url) {
    Promise.map(url, objects => new Promise((resolve, reject) => {
        console.log('Downloading Image: ' + objects.data.id);
        needle.get(objects.data.url, (error, response) => {
            if (!error && response.statusCode === 200) {
                fs.outputFile('temp/' + objects.data.id, response.raw, err => {
                    if (err) throw err;
                    console.log(`Saved! ${objects.data.id} from ${objects.data.url}`);
                });
                resolve();
            }
        })
    }), {
        concurrency: 4
    }).then(() => {
        console.log('All Image Downloaded!');
        return true
    }).catch(err => {
        console.error('Failed: ' + err.message);
    });
}