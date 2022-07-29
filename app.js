require('dotenv').config()
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const checkToken = require('./middlewares/auth')
const adminRouter = require('./router/admin')
const routes = require('./router')
const app = express()
const bodyParser = require('body-parser')

const mysql = require('mysql')
const MySQLEvents = require('@rodrigogs/mysql-events')
let timeStamp = null
let sseData = {
  timestamp: null,
  table: null,
  type: null,
}
let globalCount = 0

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
      sseData = event
      sseData.timestamp = Date.now()
      dbChanged = true
      globalCount++
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

// const sendResponse = (res) => {
//   setTimeout(() => {
//     sendResponse(res)
//     // if (dbChanged) {
//     //   res.write('data: ' + dbChanged + `\n\n`)
//     //   console.log('after sendResponse', dbChanged)
//     // }
//     // res.write('data: ' + dbChanged + `\n\n`)
//     res.write('data: ' + timeStamp + `\n\n`)
//     dbChanged = false
//   }, 5000)
// }

// let dbChangedOld = null
app.get('/sse', (req, res) => {
  let localCount = 0
  console.log('sse service started.....')
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': true,
    Connection: 'keep-alive',
  })
  setInterval(() => {
    if (localCount < globalCount) {
      console.log('globalCount has increased....>>>>', globalCount)
      res.status(200).write(`data: ${JSON.stringify(sseData)}\n\n`)
      dbChanged = false
      localCount = globalCount
      console.log('localCount has set....>>>>', localCount)
    }
  }, 1000)
})

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
