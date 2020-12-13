const express = require('express')
const router = express.Router()
const controller = require('../controllers/login')

router.post("/admin", controller.accessToken)

module.exports = router