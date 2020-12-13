const express = require('express')
const router = express.Router()
const vaccineController = require('../controllers/vaccine')
const authMiddleware = require('../middlewares/auth')

router.get('/', vaccineController.getVaccine)

router.get('/name', vaccineController.getVaccineByName)

router.get('/:id', vaccineController.getVaccineById)

router.use(authMiddleware)
router.post('/register', vaccineController.registerVaccine)
router.patch('/vaccinestaken/:id', vaccineController.insertVaccineCard)
router.delete('/:id', vaccineController.deleteVaccine)

module.exports = router