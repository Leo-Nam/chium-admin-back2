const express = require('express')
const bcrypt = require('bcrypt')
const { postApi } = require('../api.js')
const jwt = require('../modules/jwt.js')
const { s3Upload } = require('../s3')
const Pool = require('../pool')
const multer = require('multer')

let globalFilename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const forExt = file.originalname.split('.')
    const ext = forExt[forExt.length - 1]
    cb(null, `chium.${ext}`)
  },
})

const upload = multer({ storage: storage })
const router = express.Router()

router.post('/1_01_main', async function (req, res, next) {
  let data = [req.body.params]
  postApi('sp_admin_get_1_01_main', data, res)
})

router.post('/1_01_main/top_list_load_more', function (req, res, next) {
  let data = [req.body.params]
  postApi('sp_admin_main_top_list_load_more', data, res)
})

router.post('/1_01_main/check_if_exist_license', function (req, res, next) {
  let data = [req.body.params]
  postApi('sp_admin_main_get_no_confirm_counts_monthly_base', data, res)
})

router.post('/1_01_main/get_info_of_site_list', function (req, res, next) {
  let data = [req.body.params]
  postApi('sp_admin_main_get_no_confirm_lists_monthly_base', data, res)
})

router.post('/1_03_main/get_permits', function (req, res, next) {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_site_lists', data, res)
})

router.post('/1_03_main/get_site_info', function (req, res, next) {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_site_info', data, res)
})

router.post('/1_03_main/update_site_info', function (req, res, next) {
  let data = [req.body.params]
  postApi('sp_admin_update_site_info', data, res)
})

router.post('/common/get_admin_decision', function (req, res, next) {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_decision_list', data, res)
})

router.post('/common/get_wste_lists', function (req, res, next) {
  postApi('sp_req_b_wste_code', null, res)
})

router.post('/common/get_wste_appearance', function (req, res, next) {
  postApi('sp_req_b_wste_appearance', null, res)
})

router.post('/common/get_department', function (req, res, next) {
  postApi('sp_req_b_department', null, res)
})

router.post('/common/admin_login', function (req, res, next) {
  let data = [req.body.params]
  let inputParam = JSON.parse(data)[0]

  let address = 'sp_admin_get_user_info'
  const pool = new Pool()
  var sql = `CALL ${address}(?)`
  if (data == null) sql = `CALL ${address}()`
  pool.execute((conn) => {
    conn.queryAsync(sql, data, async (error, rows) => {
      if (error) {
        return console.error(error.message)
      } else {
        let json_data = JSON.parse(rows[0][0]['json_data'])
        if (json_data === null) {
          const payload = {
            state: rows[0][0]['rtn_val'],
            message: rows[0][0]['msg_txt'],
            data: null,
          }
          res.send(payload)
        } else {
          let id = json_data.ID
          let pw = json_data.PWD

          const pwOk = await bcrypt.compare(inputParam.PW, pw)
          if (pwOk === true) {
            const jwtToken = await jwt.sign(inputParam)
            console.log('JWT issued user login :', jwtToken)
            const payload = {
              state: rows[0][0]['rtn_val'],
              message: rows[0][0]['msg_txt'],
              data: rows[0][0]['json_data'],
              token: jwtToken,
            }
            res.send(payload)
          } else {
            const payload = {
              state: rows[0][0]['rtn_val'],
              message: 'password not match',
              data: null,
            }

            res.send(payload)
          }
        }
      }
    })
    pool.end()
  })
})

router.post(
  '/common/upload_img_to_s3',
  upload.single('file'),
  async function (req, res, next) {
    let data = [req.body.params]
    const forExt = req.file.originalname.split('.')
    const ext = forExt[forExt.length - 1]
    const url = await s3Upload(`./uploads/chium.${ext}`)
    res.send(url)
  }
)

router.post('/common/triggers', function (req, res, next) {
  postApi('sp_req_b_department', null, res)
})

router.post('/common/get_stats', function (req, res, next) {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_stat_registeration', data, res)
})

router.post('/common/get_sido', function (req, res, next) {
  postApi('sp_req_sido', null, res)
})

router.post('/common/get_region_stats', function (req, res, next) {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_stat_region', data, res)
})

module.exports = router
