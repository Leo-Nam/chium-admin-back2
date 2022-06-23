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
router.post('/get_chat_rooms', commonController.get_rooms)
router.post(
  '/upload_img_to_s3',
  upload.single('file'),
  commonController.upload_img_to_s3
)
router.post('/triggers', commonController.triggers)
router.post('/get_stats', commonController.get_stats)
router.post('/get_sido', commonController.get_sido)
router.post('/get_region_stats', commonController.get_region_stats)

// 신규 배출 리스트
router.post('/get_new_comings', commonController.get_new_comings)
// 신규 배출 리스트에 대한 상세정보
router.post('/get_new_comings_detail', commonController.get_new_comings_detail)

// 배출자의 폐기물 배출지를 관심지역으로 하는 수거자 사이트 리스트 반환
// Input Parameters
// USER_ID(Number), B_CODE(String)
router.post(
  '/sp_get_site_list_whose_biz_areas_of_interest',
  commonController.sp_get_site_list_whose_biz_areas_of_interest
)

// 오더 관련 정보를 수정한다.
// Parameters
// type(string), key(string), value(string)
router.post(
  '/sp_admin_update_order_info',
  commonController.sp_admin_update_order_info
)

router.post(
  '/sp_get_site_list_inside_range',
  commonController.sp_get_site_list_inside_range
)

router.post(
  '/sp_admin_get_personal_details',
  commonController.sp_admin_get_personal_details
)

router.post(
  '/sp_admin_update_personal_details',
  commonController.sp_admin_update_personal_details
)

router.post(
  '/sp_admin_get_new_biddings',
  commonController.sp_admin_get_new_biddings
)

router.post(
  '/sp_admin_get_new_bidding_details',
  commonController.sp_admin_get_new_bidding_details
)

router.post(
  '/sp_admin_update_bidding_details',
  commonController.sp_admin_update_bidding_details
)

router.post(
  '/sp_admin_get_new_transactions',
  commonController.sp_admin_get_new_transactions
)

router.post(
  '/sp_admin_get_new_transaction_details',
  commonController.sp_admin_get_new_transaction_details
)

router.post(
  '/sp_admin_update_order_details',
  commonController.sp_admin_update_order_details
)

router.post(
  '/sp_admin_get_new_reports',
  commonController.sp_admin_get_new_reports
)

router.post(
  '/sp_admin_get_new_report_details',
  commonController.sp_admin_get_new_report_details
)

router.post(
  '/sp_admin_update_report_details',
  commonController.sp_admin_update_report_details
)

router.post('/sp_admin_get_new_logs', commonController.sp_admin_get_new_logs)

module.exports = router
