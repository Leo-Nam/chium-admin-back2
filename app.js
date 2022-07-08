require('dotenv').config()
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const checkToken = require('./middlewares/auth')
const adminRouter = require('./router/admin')
const routes = require('./router')
const listener = require('./modules/listener')

const app = express()
const bodyParser = require('body-parser')

let isDisableKeepAlive = false
app.use(function (req, res, next) {
  if (isDisableKeepAlive) {
    res.set('Connection', 'close')
  }
  next()
})

app.use(require('connect-history-api-fallback')())
app.use(express.static('dist'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())
app.use(checkToken)
app.use('/api/admin', routes)
// app.use('/api/admin', adminRouter)

const handleListening = () => {
  if (process.send) {
    process.send('ready')
  }
  console.log('👀 server is listening on 3000 port🚀 111')
}
const serverListener = app.listen(3000, handleListening)
process.on('SIGINT', function () {
  isDisableKeepAlive = true
  serverListener.close(function (err) {
    console.log('server closed')
    process.exit(err ? 1 : 0)
  })
})
module.exports = app
