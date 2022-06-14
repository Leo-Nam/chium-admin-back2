const mysql = require('mysql')
const util = require('util')
const Promise = require('bluebird')

Promise.promisifyAll(mysql)
Promise.promisifyAll(require('mysql/lib/Connection').prototype)
Promise.promisifyAll(require('mysql/lib/Pool').prototype)
console.log(
  process.env.SQLHOST,
  process.env.SQLUSER,
  process.env.SQLPWD,
  process.env.SQLDB
)
const DB_INFO = {
  host: process.env.SQLHOST,
  user: process.env.SQLUSER,
  password: process.env.SQLPWD,
  database: process.env.SQLDB,
  multipleStatements: true,
  connectionLimit: 100,
  waitForConnections: false,
}

module.exports = class {
  constructor(dbinfo) {
    dbinfo = dbinfo || DB_INFO
    this.pool = mysql.createPool(dbinfo)
  }

  connect() {
    return this.pool.getConnectionAsync().disposer((conn) => {
      return conn.release()
    })
  }

  end() {
    this.pool.end(function (err) {
      if (err) {
        util.log('ERR pool ending!!')
      }
    })
  }

  execute(fn) {
    Promise.using(this.connect(), (conn) => {
      fn(conn)
    })
  }
}
