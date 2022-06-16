const express = require('express')
const router = express.Router()
const _1_03_mainController = require('../controllers/_1_03_mainController')

router.post('/get_permits', _1_03_mainController.get_permits)

router.post('/get_site_info', _1_03_mainController.get_site_info)

router.post('/update_site_info', _1_03_mainController.update_site_info)

router.post(
  '/sp_admin_retrieve_users',
  _1_03_mainController.sp_admin_retrieve_users
)

module.exports = router
