const express = require('express')
const router = express.Router()

const _1_01_main = require('./1_01_main')
const _1_03_main = require('./1_03_main')
const common = require('./common')

router.use('/1_01_main', _1_01_main)
router.use('/1_03_main', _1_03_main)
router.use('/common', common)

module.exports = router
