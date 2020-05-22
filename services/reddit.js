const https = require('https')
const needle = require('needle');
const fs = require('fs-extra');
const Promise = require('bluebird');
const objectDetection = require('../services/objectDetection')
const utility = require('../services/utility')
module.exports = {
    fetchAllImages(options, model) {
        return new Promise(async(resolve, reject) => {
            // create URL
            let resultJSON = []
            const url = 'https://www.reddit.com/r/'
            let finalUrl = url + options.sub + '/' + options.cat + '.json'
            if (options.limit) {
                finalUrl += '?limit=' + options.limit
            }
            // Get all posts
            const receivedData = await needle("get", finalUrl).catch(err => { 
                console.log(err)
                reject('Failed: ' + err.message)
             });
              
            // Possible that search yielded nothing.
            if(receivedData.statusCode == 302) {
                return reject('Cannot find data using provided parameters')
            }
            // Create a promise list using bluebird for concurrency
            Promise.map(receivedData.body.data.children, objects => new Promise(async(resolve, reject) => {
                // Download image
                console.log('Downloading Image: ' + objects.data.id);
                const file = await needle("get", objects.data.url).catch(err => { console.log(err); next(err) })
                    // Write to file
                fs.outputFile('temp/' + objects.data.id, file.raw, async err => {
                    if (err) throw err;
                    console.log(`Saved! ${objects.data.id} from ${objects.data.url}`);
                    let result = await objectDetection.detect(objects.data.id, model)
                    resultJSON.push({ title: objects.data.title, imageURL: objects.data.url, result: result })
                    utility.clearFiles(objects.data.id)
                });
                resolve();
            }), {
                // Set Concurrency. Currently set for 4.
                concurrency: 4
            }).then(() => {
                console.log("======================All operations completed. Results have been put in the temp folder==============")
                resolve(resultJSON)
            }).catch(err => {
                console.error('Failed: ' + err.message);
                reject('Failed: ' + err.message)
            });
        })
    }
}