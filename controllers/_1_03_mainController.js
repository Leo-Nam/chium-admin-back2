const { postApi } = require('../api.js')

exports.get_permits = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_site_lists', data, res)
}

exports.get_site_info = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_retrieve_site_info', data, res)
}

exports.update_site_info = (req, res, next) => {
  let data = [req.body.params]
  postApi('sp_admin_update_site_info', data, res)
}
