const https = require('https')
const needle = require('needle');
const fs = require('fs-extra');
const Promise = require('bluebird');
module.exports = {
    fetchAllImages(options) {
        return new Promise(async(resolve, reject) => {
            // create URL
            const url = 'https://www.reddit.com/r/'
            let finalUrl = url + options.sub + '/' + options.cat + '.json'
            if (options.limit) {
                finalUrl += '?limit=' + options.limit
            }
            // Get all posts
            const receivedData = await needle("get", finalUrl).catch(err => { console.log(err) });
            // Create a promise list using bluebird for concurrency
            Promise.map(receivedData.body.data.children, objects => new Promise(async(resolve, reject) => {
                // Download image
                console.log('Downloading Image: ' + objects.data.id);
                const file = await needle("get", objects.data.url).catch(err => { console.log(err); return true })
                    // Write to file
                fs.outputFile('temp/' + objects.data.id, file.raw, err => {
                    if (err) throw err;
                    console.log(`Saved! ${objects.data.id} from ${objects.data.url}`);
                });
                resolve();
            }), {
                // Set Concurrency.
                concurrency: 4
            }).then(() => {
                console.log('Whew! All images downloaded');
                resolve('Whew! All images downloaded')
            }).catch(err => {
                console.error('Failed: ' + err.message);
                reject('Failed: ' + err.message)
            });
        })
    }
}