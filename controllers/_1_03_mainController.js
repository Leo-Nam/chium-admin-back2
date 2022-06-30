const { postApi } = require('../api.js')

exports.sp_admin_retrieve_site_lists = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_site_lists', data, res)
}

exports.sp_admin_retrieve_site_info = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_site_info', data, res)
}

exports.sp_admin_update_site_info = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_update_site_info', data, res)
}

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
exports.sp_admin_retrieve_users = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_users', data, res)
}
