const express = require('express')
const router = express.Router()
const commonController = require('../controllers/commonController')
const multer = require('multer')
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

router.post('/get_admin_decision', commonController.get_admin_decision)

router.post('/get_wste_lists', commonController.get_wste_lists)

router.post('/get_wste_appearance', commonController.get_wste_appearance)
router.post('/get_department', commonController.get_department)
router.post('/admin_login', commonController.admin_login)
router.post(
  '/upload_img_to_s3',
  upload.single('file'),
  commonController.upload_img_to_s3
)
router.post('/triggers', commonController.triggers)
router.post('/get_stats', commonController.get_stats)
router.post('/get_sido', commonController.get_sido)
router.post('/get_region_stats', commonController.get_region_stats)

module.exports = router