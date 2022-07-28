require('dotenv').config()
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const checkToken = require('./middlewares/auth')
const adminRouter = require('./router/admin')
const routes = require('./router')
const mysql = require('mysql')
const axios = require('axios')
const MySQLEvents = require('@rodrigogs/mysql-events')
const { postApi } = require('./api.js')
const http = require('http')

const app = express()
const bodyParser = require('body-parser')
const { send } = require('process')

// // const BASE_URL = 'http://192.168.0.46:3000'
// let dbChanged = false
let timeStamp = null

// // const axiosPrivate = axios.create({
// //   baseURL: BASE_URL,
// //   headers: { 'Content-Type': 'text/event-stream' },
// //   withCredentials: true,
// // })

const program = async () => {
  const connection = mysql.createConnection({
    host: 'aaf2aamu92cvf4.cthuqtxb1hrh.ap-northeast-2.rds.amazonaws.com',
    user: 'chiumdb',
    password: 'cldna2021!',
    database: 'chium',
  })

  const instance = new MySQLEvents(connection, {
    startAtEnd: true,
    excludedSchemas: {
      mysql: true,
    },
  })

  await instance.start()

  instance.addTrigger({
    name: 'JOB_LOG_AFTER_INSERT',
    expression: '*',
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: async (event) => {
      console.log('res2>>>>>', event.table)
      dbChanged = true
      timeStamp = Math.floor(Date.now())
      //   console.log('dbChanged in addTrigger>>>>>>', dbChanged)
    },
  })

  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error)
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error)
}

const listener = async () => {
  await program()
    .then(() => {
      console.log('Waiting for database events...')
    })
    .catch(console.error)
}
listener()

const sendResponse = (res) => {
  setTimeout(() => {
    sendResponse(res)
    // if (dbChanged) {
    //   res.write('data: ' + dbChanged + `\n\n`)
    //   console.log('after sendResponse', dbChanged)
    // }
    // res.write('data: ' + dbChanged + `\n\n`)
    res.write('data: ' + timeStamp + `\n\n`)
    dbChanged = false
  }, 5000)
}

// let dbChangedOld = null
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
  })
  sendResponse(res)
})

let isDisableKeepAlive = false
app.use(function (req, res, next) {
  if (isDisableKeepAlive) {
    res.set('Connection', 'close')
  }
  next()
})

// app.use(listener())
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
