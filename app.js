const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const checkToken = require('./middlewares/auth')
const adminRouter = require('./router/admin')
const bodyParser = require('body-parser')
const routes = require('./router')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(require('connect-history-api-fallback')())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkToken)
// app.use('/api/admin', adminRouter)
app.use('/api/admin', routes)
const handleListening = () => {
  console.log('👀 server is listening on 3000 port🚀')
}
app.listen(3000, handleListening)
module.exports = app
