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
const axios = require('axios')

let timeStamp = null
let sseData = {
  timestamp: null,
  table: null,
  type: null,
}

let sseTrackingData = [
  { id: 1, lat: 36.9559775, lng: 127.4671265 },
  { id: 2, lat: 36.9559978, lng: 127.4672442 },
  { id: 3, lat: 36.9559789272727, lng: 127.467355945455 },
  { id: 4, lat: 36.9559600545455, lng: 127.467467690909 },
  { id: 5, lat: 36.9559411818182, lng: 127.467579436364 },
  { id: 6, lat: 36.9559223090909, lng: 127.467691181818 },
  { id: 7, lat: 36.9559034363636, lng: 127.467802927273 },
  { id: 8, lat: 36.9558845636364, lng: 127.467914672727 },
  { id: 9, lat: 36.9558656909091, lng: 127.468026418182 },
  { id: 10, lat: 36.9558468181818, lng: 127.468138163636 },
  { id: 11, lat: 36.9558279454545, lng: 127.468249909091 },
  { id: 12, lat: 36.9558090727273, lng: 127.468361654545 },
  { id: 13, lat: 36.9557902, lng: 127.4684734 },
  { id: 14, lat: 36.9557713272727, lng: 127.468585145455 },
  { id: 15, lat: 36.9557524545454, lng: 127.468696890909 },
  { id: 16, lat: 36.9557335818182, lng: 127.468808636364 },
  { id: 17, lat: 36.9557147090909, lng: 127.468920381818 },
  { id: 18, lat: 36.9556958363636, lng: 127.469032127273 },
  { id: 19, lat: 36.9556769636363, lng: 127.469143872727 },
  { id: 20, lat: 36.9556580909091, lng: 127.469255618182 },
  { id: 21, lat: 36.9556392181818, lng: 127.469367363636 },
  { id: 22, lat: 36.9556203454545, lng: 127.469479109091 },
  { id: 23, lat: 36.9556014727272, lng: 127.469590854545 },
  { id: 24, lat: 36.9555826, lng: 127.4697026 },
  { id: 25, lat: 36.9556787588939, lng: 127.469394768146 },
  { id: 26, lat: 36.9557749177877, lng: 127.469086936292 },
  { id: 27, lat: 36.9558710766816, lng: 127.468779104438 },
  { id: 28, lat: 36.9559672355755, lng: 127.468471272584 },
  { id: 29, lat: 36.9560633944693, lng: 127.46816344073 },
  { id: 30, lat: 36.9561281, lng: 127.4679563 },
  { id: 31, lat: 36.9561260260389, lng: 127.467987801165 },
  { id: 32, lat: 36.9561239520778, lng: 127.468019302329 },
  { id: 33, lat: 36.9561218781167, lng: 127.468050803494 },
  { id: 34, lat: 36.9561198041556, lng: 127.468082304659 },
  { id: 35, lat: 36.9561177301945, lng: 127.468113805823 },
  { id: 36, lat: 36.9561156562334, lng: 127.468145306988 },
  { id: 37, lat: 36.9561135822723, lng: 127.468176808152 },
  { id: 38, lat: 36.9561115083112, lng: 127.468208309317 },
  { id: 39, lat: 36.9561094343501, lng: 127.468239810482 },
  { id: 40, lat: 36.956107360389, lng: 127.468271311646 },
  { id: 41, lat: 36.9561052864279, lng: 127.468302812811 },
  { id: 42, lat: 36.9561032124668, lng: 127.468334313976 },
  { id: 43, lat: 36.9561011, lng: 127.4683664 },
  { id: 44, lat: 36.9561249487155, lng: 127.468570193981 },
  { id: 45, lat: 36.956148797431, lng: 127.468773987962 },
  { id: 46, lat: 36.9561726461465, lng: 127.468977781942 },
  { id: 47, lat: 36.956206, lng: 127.4692628 },
  { id: 48, lat: 36.9560552876676, lng: 127.469293699981 },
  { id: 49, lat: 36.9559045753353, lng: 127.469324599962 },
  { id: 50, lat: 36.9557538630029, lng: 127.469355499942 },
  { id: 51, lat: 36.9556031506705, lng: 127.469386399923 },
  { id: 52, lat: 36.9554524383382, lng: 127.469417299904 },
  { id: 53, lat: 36.9553017260058, lng: 127.469448199885 },
  { id: 54, lat: 36.9551510136735, lng: 127.469479099865 },
  { id: 55, lat: 36.9550003013411, lng: 127.469509999846 },
  { id: 56, lat: 36.9548495890087, lng: 127.469540899827 },
  { id: 57, lat: 36.9546988766764, lng: 127.469571799808 },
  { id: 58, lat: 36.954548164344, lng: 127.469602699788 },
  { id: 59, lat: 36.9544711, lng: 127.4696185 },
  { id: 60, lat: 36.9546260226151, lng: 127.46963022199 },
  { id: 61, lat: 36.9547809452302, lng: 127.46964194398 },
  { id: 62, lat: 36.9549358678453, lng: 127.46965366597 },
  { id: 63, lat: 36.9550907904604, lng: 127.46966538796 },
  { id: 64, lat: 36.9552457130755, lng: 127.46967710995 },
  { id: 65, lat: 36.9554006356906, lng: 127.46968883194 },
  { id: 66, lat: 36.9555826, lng: 127.4697026 },
  { id: 67, lat: 36.9554023967781, lng: 127.469809211554 },
  { id: 68, lat: 36.9552221935562, lng: 127.469915823107 },
  { id: 69, lat: 36.9550419903344, lng: 127.470022434661 },
  { id: 70, lat: 36.9548617871125, lng: 127.470129046214 },
  { id: 71, lat: 36.9546815838906, lng: 127.470235657768 },
  { id: 72, lat: 36.9545013806687, lng: 127.470342269322 },
  { id: 73, lat: 36.9543211774468, lng: 127.470448880875 },
  { id: 74, lat: 36.954140974225, lng: 127.470555492429 },
  { id: 75, lat: 36.9539607710031, lng: 127.470662103983 },
  { id: 76, lat: 36.95375, lng: 127.4707868 },
  { id: 77, lat: 36.9538501945054, lng: 127.471064472171 },
  { id: 78, lat: 36.9539503890108, lng: 127.471342144341 },
  { id: 79, lat: 36.9540505835162, lng: 127.471619816512 },
  { id: 80, lat: 36.9541507780217, lng: 127.471897488682 },
  { id: 81, lat: 36.9542509725271, lng: 127.472175160853 },
  { id: 82, lat: 36.9543511670325, lng: 127.472452833023 },
  { id: 83, lat: 36.9544513615379, lng: 127.472730505194 },
  { id: 84, lat: 36.9545515560433, lng: 127.473008177365 },
  { id: 85, lat: 36.9546517505487, lng: 127.473285849535 },
  { id: 86, lat: 36.9547519450541, lng: 127.473563521706 },
  { id: 87, lat: 36.9548521395596, lng: 127.473841193876 },
  { id: 88, lat: 36.954952334065, lng: 127.474118866047 },
  { id: 89, lat: 36.955072, lng: 127.4744505 },
  { id: 90, lat: 36.954491264911, lng: 127.475525302099 },
  { id: 91, lat: 36.9539105298221, lng: 127.476600104197 },
  { id: 92, lat: 36.953102, lng: 127.4780965 },
  { id: 93, lat: 36.9530316749806, lng: 127.478431247092 },
  { id: 94, lat: 36.9529613499612, lng: 127.478765994185 },
  { id: 95, lat: 36.9528910249419, lng: 127.479100741277 },
  { id: 96, lat: 36.9528206999225, lng: 127.479435488369 },
  { id: 97, lat: 36.9527503749031, lng: 127.479770235461 },
  { id: 98, lat: 36.9526800498837, lng: 127.480104982554 },
  { id: 99, lat: 36.9526097248643, lng: 127.480439729646 },
  { id: 100, lat: 36.952539399845, lng: 127.480774476738 },
  { id: 101, lat: 36.9524690748256, lng: 127.48110922383 },
  { id: 102, lat: 36.952427, lng: 127.4813095 },
]
let globalCount = 0
let globalTrackingCount = 0

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
      sseData.trigger = 'JOB_LOG_AFTER_INSERT'
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

app.get('/tracking', (req, res) => {
  let localTrackingCount = 0
  console.log('sse tracking started.....')
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
    console.log('sseTrackingData.length>>>>', sseTrackingData.length)
    if (localTrackingCount < sseTrackingData.length) {
      let trackingDataTemp = {}
      trackingDataTemp.id = sseTrackingData[localTrackingCount].id
      trackingDataTemp.lat = sseTrackingData[localTrackingCount].lat
      trackingDataTemp.lng = sseTrackingData[localTrackingCount].lng
      trackingDataTemp.timestamp = Date.now()
      console.log('trackingDataTemp>>>>', trackingDataTemp)
      res.status(200).write(`data: ${JSON.stringify(trackingDataTemp)}\n\n`)
      console.log('localTrackingCount has set....>>>>', localTrackingCount)
      localTrackingCount += 1
    } else {
      localTrackingCount = 0
    }
  }, 10000)
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
