const mysql = require('mysql')
const axios = require('axios')
const MySQLEvents = require('@rodrigogs/mysql-events')
const { nextTick } = require('vue')
const app = require('express')()

const BASE_URL = 'http://192.168.0.46:3000'

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

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
    name: 'CS_NOTE_AFTER_INSERT',
    expression: '*',
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: async (event) => {
      // You will receive the events here
      const response = await axiosPrivate.post('/common/triggers')
    },
  })

  instance.addTrigger({
    name: 'JOB_LOG_AFTER_INSERT',
    expression: '*',
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: async (event) => {
      // You will receive the events here
      const response = await axiosPrivate.post('/common/triggers')
    },
  })

  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error)
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error)
}

const listener = async () => {
  await program()
    .then(() => console.log('Waiting for database events...'))
    .catch(console.error)
  //   next()
}
listener()
module.exports = listener
