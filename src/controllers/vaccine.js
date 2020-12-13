const mongoose = require('mongoose')
const Vaccine = require('../models/Vaccine')
const User = require('../models/User')

exports.getVaccine = (req, res, next) => {
  Vaccine.find().sort({ name: 1 })
    .then((user) => {
      res.status(200).json(user)
    })
    .catch((err) => next(err))
}

exports.getVaccineByName = (req, res) => {
  const { name } = req.query
  Vaccine.find({ name: name }).sort({ dose: 1 }).then((vaccine) => {
      res.status(200).json(vaccine)
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

exports.getVaccineById = (req, res, next) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: `O ID especificado não é válido.` })
    return
  }

  Vaccine.findById(id)
    .then((vaccine) => {
      res.status(200).json(vaccine)
    })
    .catch((err) => next(err))
}

exports.registerVaccine = async (req, res, next) => {
  const { name, dose, avoidedDiseases } = req.body

  Vaccine.findOne({ $and: [{ name: name }, { dose: dose }] })
    .then(async (existingVaccine) => {
      if (existingVaccine) {
        return res.status(400).json({
          error: ["Já existe essa vacina cadastrada."]
        })
      }

      const newVaccine = new Vaccine({
        name,
        date: new Date().toString(),
        dose,
        avoidedDiseases
      })

      newVaccine
        .save()
        .then((vaccine) => {
          res.status(201).json(vaccine)
        })
        .catch((err) => next(err))
    })
    .catch((err) => {
      res.status(400).json(err)
    })
}

exports.insertVaccineCard = async (req, res) => {
  user = req.params
  id = user.id

  const { name, dose } = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: `O ID especificado não é válido.` })
    return
  }

  try {
    Vaccine.findOne({ $and: [{ name: name }, { dose: dose }] }).then(async (existingVaccine) => {
        if (!existingVaccine) {
          return res.status(404).json({
            error: [`Não existe essa vacina cadastrada na base de dados.`]
          })
        }

        const newVaccineTaken = await Vaccine.findOne({ $and: [{ name: name }, { dose: dose }] })
        const userById = await User.findById(id)

        userById.vaccinesTaken.push(newVaccineTaken)

        userById.save()
          .then((user) => {
            res.status(200).json(user)
          })
          .catch((err) => {
            return res.status(500).json(err)
          })
      })
      .catch((err) => {
        res.status(400).json(err)
      })
  } catch (e) {
    return res.status(400).json(e)
  }
}

exports.deleteVaccine = (req, res) => {
  const { id } = req.params

  Vaccine.findByIdAndDelete(id).then(() => {
      res.status(200).json({ message: `Vacina deletada com sucesso.` })
    })
    .catch((err) => {
      throw new Error(err)
    })
}
