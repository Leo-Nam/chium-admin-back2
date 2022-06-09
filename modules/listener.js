const mysql = require('mysql')
const axios = require('axios')
const MySQLEvents = require('@rodrigogs/mysql-events')
const { nextTick } = require('vue')

const BASE_URL = 'http://192.168.0.46:3000'

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

const program = async () => {
  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  })

  const instance = new MySQLEvents(connection, {
    startAtEnd: true,
    excludedSchemas: {
      mysql: true,
    },
  })

  await instance.start()

  instance.addTrigger({
    name: 'USERS_AFTER_UPDATE',
    expression: '*',
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: async (event) => {
      // You will receive the events here
      console.log('event >>>>>>>>>>>', event)
      const response = await axiosPrivate.post('/common/triggers')
      console.log('status >>>>>>>>>>> ')
    },
  })

  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error)
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error)
}

const listener = async () => {
  await program()
    .then(() => console.log('Waiting for database events...'))
    .catch(console.error)
  next()
}

module.exports = listener
