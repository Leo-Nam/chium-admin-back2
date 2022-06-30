const express = require('express')
const router = express.Router()
const _1_03_mainController = require('../controllers/_1_03_mainController')

router.post(
  '/sp_admin_retrieve_site_lists',
  _1_03_mainController.sp_admin_retrieve_site_lists
)

router.post(
  '/sp_admin_retrieve_site_info',
  _1_03_mainController.sp_admin_retrieve_site_info
)

router.post(
  '/sp_admin_update_site_info',
  _1_03_mainController.sp_admin_update_site_info
)

router.post(
  '/sp_admin_retrieve_users',
  _1_03_mainController.sp_admin_retrieve_users
)

module.exports = router
