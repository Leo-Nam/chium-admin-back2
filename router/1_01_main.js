const express = require('express')
const router = express.Router()
const _1_01_mainController = require('../controllers/_1_01_mainController')

router.post('/', _1_01_mainController.admin_get)

router.post('/top_list_load_more', _1_01_mainController.top_list_load_more)

router.post(
  '/check_if_exist_license',
  _1_01_mainController.check_if_exist_license
)
router.post(
  '/get_info_of_site_list',
  _1_01_mainController.get_info_of_site_list
)

module.exports = router
