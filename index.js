// @TODO : Write readme for the project
// @TODO : Write tests for controller and services

'use strict'
// Load Services
global.fetch = require('node-fetch')
const express = require('express')
const createError = require('http-errors')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const mainController = require('./routes/mainController')
const mobileNetModel = require('./models/mobileNet')

var app = express()
const port = 3000

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', mainController)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = err
  // render the error page
  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, async () => {
  await mobileNetModel.loadModel()
  console.log(`Example app listening on port ${port}!`)
})

module.exports = app
