const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const authMiddleware = require('../middlewares/auth')

router.get("/:id", userController.getUserById)

router.get("/card/:id", userController.getUserCard)

router.post("/register", userController.signup)

router.patch("/phone/:id", userController.updatePhone)

router.use(authMiddleware)
router.get("/", userController.getUser)
router.delete("/:id", userController.deleteUser)

module.exports = router
