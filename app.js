const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const checkToken = require('./middlewares/auth')
const adminRouter = require('./router/admin')
const { secretKey } = require('./config/secretKey')
const routes = require('./router')

const app = express()

const bodyParser = require('body-parser')
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
  console.log('👀 server is listening on 3000 port🚀')
}
app.listen(3000, handleListening)
module.exports = app
