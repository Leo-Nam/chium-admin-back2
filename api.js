const Pool = require('./pool')

const postApi = function (address, data, res) {
  const pool = new Pool()
  var sql = `CALL ${address}(?)`
  if (data == null) sql = `CALL ${address}()`
  pool.execute((conn) => {
    conn.queryAsync(sql, data, (error, rows) => {
      if (error) {
        return console.error(error.message)
      } else {
        const payload = {
          state: rows[0][0]['rtn_val'],
          message: rows[0][0]['msg_txt'],
          data: JSON.parse(rows[0][0]['json_data']),
        }
        if (address === 'sp_admin_update_prospective_member_info') {
          console.log(payload)
        }
        res.send(payload)
      }
    })
    pool.end()
  })
}

module.exports = {
  postApi: postApi,
}
