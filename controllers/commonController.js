const bcrypt = require('bcrypt')
const Pool = require('../pool')
const jwt = require('../modules/jwt.js')
const { postApi } = require('../api.js')
const { s3Upload } = require('../s3')

exports.get_admin_decision = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_decision_list', data, res)
}

exports.get_wste_lists = (req, res, next) => {
  postApi('sp_req_b_wste_code', null, res)
}

exports.sp_req_b_wste_class_code = (req, res, next) => {
  postApi('sp_req_b_wste_class_code', null, res)
}

exports.get_wste_appearance = (req, res, next) => {
  postApi('sp_req_b_wste_appearance', null, res)
}

exports.get_department = (req, res, next) => {
  postApi('sp_req_b_department', null, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_insert_manager = (req, res, next) => {
  let data = JSON.parse([req.body.params])
  pw = data[0]['PASSWORD']

  console.log('[req.body.params]>>>>>>', [req.body.params])
  console.log('req.body.params>>>>>>', req.body.params)
  console.log('pw>>>>>>', pw)
  const encryptedPW = bcrypt.hashSync(pw, 10)
  console.log('encryptedPW>>>>>>', encryptedPW)
  inputData = [
    {
      NAME: data[0]['NAME'],
      CLASS: data[0]['CLASS'],
      DEPARTMENT: data[0]['DEPARTMENT'],
      USER_ID: data[0]['USER_ID'],
      PASSWORD: encryptedPW,
      PHONE: data[0]['PHONE'],
    },
  ]
  console.log([req.body.params])
  console.log([JSON.stringify(inputData)])
  postApi('sp_admin_insert_manager', [JSON.stringify(inputData)], res)
}

exports.sp_admin_init_user = (req, res, next) => {
  let data = [req.body.params]
  let inputParamId = JSON.parse(data)[0]['ADMIN_ID']
  let inputParamUid = JSON.parse(data)[0]['ADMIN_UID']
  let inputParamPw = JSON.parse(data)[0]['PWD']

  const encryptedPW = bcrypt.hashSync(inputParamPw, 10)
  const inputParam = [
    JSON.stringify([
      {
        ADMIN_ID: inputParamId,
        ADMIN_UID: inputParamUid,
        PWD: encryptedPW,
      },
    ]),
  ]
  console.log('data>>>>>>', data)
  console.log('data>>>>>>', inputParam)

  let address = 'sp_admin_init_user'
  const pool = new Pool()
  var sql = `CALL ${address}(?)`
  if (data == null) sql = `CALL ${address}()`
  pool.execute((conn) => {
    conn.queryAsync(sql, inputParam, async (error, rows) => {
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
          const jwtToken = await jwt.sign(inputParam)
          console.log('JWT issued user login :', jwtToken)
          const payload = {
            state: rows[0][0]['rtn_val'],
            message: rows[0][0]['msg_txt'],
            data: rows[0][0]['json_data'],
            token: jwtToken,
          }
          res.send(payload)
        }
      }
    })
    pool.end()
  })
}

exports.admin_login = (req, res, next) => {
  console.log('hello2')
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
          console.log(inputParam.PW, pw)
          const pwOk = await bcrypt.compare(inputParam.PW, pw)

          const encryptedPW = bcrypt.hashSync(inputParam.PW, 10)
          console.log('encryptedPW>>>>>>', encryptedPW)

          console.log('pwOk >>>', pwOk)
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
}

exports.upload_img_to_s3 = async (req, res, next) => {
  let data = [req.body.params]
  const forExt = req.file.originalname.split('.')
  const ext = forExt[forExt.length - 1]
  const url = await s3Upload(`./uploads/chium.${ext}`)
  res.send(url)
}

exports.triggers = (req, res, next) => {
  postApi('sp_req_b_department', null, res)
}

exports.sp_admin_retrieve_stat_registeration = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_stat_registeration', data, res)
}

exports.sp_req_sido = (req, res, next) => {
  postApi('sp_req_sido', null, res)
}

exports.sp_admin_retrieve_stat_region = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_stat_region', data, res)
}

exports.get_rooms = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_chat_rooms', data, res)
}

// 신규 배출 리스트 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_get_new_comings = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_new_comings', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_get_new_comings_detail = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_new_comings_detail', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_get_site_list_whose_biz_areas_of_interest = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_get_site_list_whose_biz_areas_of_interest', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_update_order_info = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_update_order_info', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_get_site_list_inside_range = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_get_site_list_inside_range', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_get_personal_details = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_personal_details', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_update_personal_details = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_update_personal_details', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_get_new_biddings = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_new_biddings', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_get_new_bidding_details = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_new_bidding_details', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_update_bidding_details = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_update_bidding_details', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_get_new_transactions = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_new_transactions', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_get_new_transaction_details = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_new_transaction_details', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_update_order_details = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_update_order_details', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_get_new_reports = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_new_reports', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_get_new_report_details = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_new_report_details', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_update_report_details = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_update_report_details', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_get_new_logs = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_new_logs', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_insert_note = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_insert_note', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_get_prospective_site_list_inside_range = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_get_prospective_site_list_inside_range', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_retrieve_prospective_site_lists = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_prospective_site_lists', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_retrieve_prospective_site_info = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_prospective_site_info', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_get_note_lists = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_note_lists', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_get_note_details = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_note_details', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_update_note = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_update_note', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_req_b_department = (req, res, next) => {
  postApi('sp_req_b_department', null, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_get_disposer_schedule = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_disposer_schedule', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_req_b_trmt_biz = (req, res, next) => {
  postApi('sp_req_b_trmt_biz', null, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_update_prospective_member_info = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_update_prospective_member_info', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_get_question_lists = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_question_lists', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_retrieve_stat_registeration_daily = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_stat_registeration_daily', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_get_version_list = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_version_list', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_insert_version_info = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_insert_version_info', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_admin_get_current_background_theme = (req, res, next) => {
  postApi('sp_admin_get_current_background_theme', null, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_req_b_project_list = (req, res, next) => {
  postApi('sp_req_b_project_list', null, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_update_admin_info = (req, res, next) => {
  let data = [req.body.params]
  console.log(data)
  postApi('sp_admin_update_admin_info', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_update_admin_birthday = (req, res, next) => {
  let data = [req.body.params]
  console.log(data)
  postApi('sp_admin_update_admin_birthday', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_req_b_genders = (req, res, next) => {
  postApi('sp_req_b_genders', null, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_update_admin_gender = (req, res, next) => {
  let data = [req.body.params]
  console.log(data)
  postApi('sp_admin_update_admin_gender', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_update_admin_email = (req, res, next) => {
  let data = [req.body.params]
  console.log(data)
  postApi('sp_admin_update_admin_email', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_update_admin_phone = (req, res, next) => {
  let data = [req.body.params]
  console.log(data)
  postApi('sp_admin_update_admin_phone', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_update_admin_loginid = (req, res, next) => {
  let data = [req.body.params]
  console.log(data)
  postApi('sp_admin_update_admin_loginid', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_get_updated_at = (req, res, next) => {
  let data = [req.body.params]
  console.log(data)
  postApi('sp_admin_get_updated_at', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_req_b_resolution = (req, res, next) => {
  postApi('sp_req_b_resolution', null, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_update_resolution = (req, res, next) => {
  let data = [req.body.params]
  console.log('sp_admin_update_resolution>>>>', data)
  postApi('sp_admin_update_resolution', data, res)
}

exports.uploadImageToS3 = async (req, res, next) => {
  let data = [req.body.params]
  console.log('uploadImageToS3:data>>>>>>', data)
  const forExt = req.file.originalname.split('.')
  const ext = forExt[forExt.length - 1]
  const url = await s3Upload(`./uploads/chium.${ext}`)
  res.send(url)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_update_admin_avatar = (req, res, next) => {
  let data = [req.body.params]
  console.log(data)
  postApi('sp_admin_update_admin_avatar', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_req_b_sys_policy = (req, res, next) => {
  postApi('sp_req_b_sys_policy', null, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_change_policy = (req, res, next) => {
  let data = [req.body.params]
  console.log(data)
  postApi('sp_admin_change_policy', data, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_req_b_cs_manager = (req, res, next) => {
  postApi('sp_req_b_cs_manager', null, res)
}

// 신규 배출 리스트에 대한 상세 정보를 가져오는 컨트롤러 ( db에 프로시저 요청 )
exports.sp_req_b_last_modified_table = (req, res, next) => {
  postApi('sp_req_b_last_modified_table', null, res)
}
