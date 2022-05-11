const express = require('express')
const router = express.Router()
const _1_03_mainController = require('../controllers/_1_03_mainController')

router.post('/get_permits', _1_03_mainController.get_permits)

router.post('/get_site_info', _1_03_mainController.get_site_info)

router.post('/update_site_info', _1_03_mainController.update_site_info)

module.exports = router
