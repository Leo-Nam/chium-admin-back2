const { postApi } = require('../api.js')

exports.admin_get = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_get_1_01_main', data, res)
}

exports.top_list_load_more = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_main_top_list_load_more', data, res)
}

exports.check_if_exist_license = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_main_get_no_confirm_counts_monthly_base', data, res)
}

exports.get_info_of_site_list = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_main_get_no_confirm_lists_monthly_base', data, res)
}
