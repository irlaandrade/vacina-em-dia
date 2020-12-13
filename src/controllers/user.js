const mongoose = require('mongoose')
const User = require('../models/User')
const { signupUserSchema } = require('../validators/user')
const bcrypt = require('bcrypt')
const bcryptSalt = 8

exports.getUser = (req, res, next) => {
  User.find()
    .then((user) => {
      res.status(200).json(user)
    })
    .catch((err) => next(err))
}

exports.getUserById = (req, res, next) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: `O ID especificado não é válido.` })
    return
  }

  User.findById(id)
    .then((user) => {
      res.status(200).json(user)
    })
    .catch((err) => next(err))
}

exports.getUserCard = (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: `O ID especificado não é válido.` })
    return
  }
  
  User.findById(id, {"name":1, "email":1, "cpf":1, "phone":1})
    .populate({ path: 'vaccinesTaken', select: 'name dose avoidedDiseases' })
    .then((cardUser) => {
      res.status(200).json(cardUser)
    })
    .catch((err) => json(err))
}

exports.signup = async (req, res) => {
  const { password } = req.body
  const salt = bcrypt.genSaltSync(bcryptSalt)

  try {
    const validatedBody = await signupUserSchema.validate(req.body)

    const user = new User(validatedBody)

    User.findOne({ email: validatedBody.email })
      .then(async (existingUser) => {
        if (existingUser) {
          return res.status(400).json({
            error: [`Já existe uma conta com esse e-mail.`]
          })
        }

        const passwordHashed = await bcrypt.hashSync(password, salt)
        user.password = passwordHashed

        user.save()
          .then((user) => res.status(200).json(user))
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

exports.updatePhone = (req, res) => {
  const { id } = req.params
  const { phone } = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: `O ID especificado não é válido.` })
    return
  }
  User.findByIdAndUpdate(id, { $set: { phone } })
    .then(() => {
      res.status(200).json({
        message: `O telefone do usuário de id: ${req.params.id} foi atualizado com sucesso.`
      })
    })
    .catch((err) => {
      res.json(err)
    })
}

exports.deleteUser = (req, res) => {
  const { id } = req.params

  User.findByIdAndDelete(id)
    .then(() => {
      res.status(200).json({ message: `Usuário deletado com sucesso.` })
    })
    .catch((err) => {
      throw new Error(err)
    })
}
