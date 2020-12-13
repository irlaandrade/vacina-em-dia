const express = require('express')
const router = express.Router()
const userController = require('../controllers/admin')

router.post('/register', userController.createAdmin)

module.exports = router