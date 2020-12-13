const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Admin = require('../models/Admin')

function checkPassword(passwordEntry, password) {
  return bcrypt.compareSync(passwordEntry, password)
}

exports.accessToken = (req, res) => {
  try {
    const { email, password: passwordEntry } = req.body
    Admin.findOne({ email: email })
      .then((admin) => {
        const { id, email, password } = admin
        if (!checkPassword(passwordEntry, password)) {
          return res.status(401).json({ error: `Senha não corresponde.` })
        }

        try {
          return res.json({
            admin: {
              id,
              email,
            },
            token: jwt.sign({ id }, `${process.env.SECRET}`, {
              expiresIn: `${process.env.EXPIRESIN}`,
            }),
          })
        } catch (e) {
          return res.status(401).json({ error: "erro" })
        }
      })
      .catch((e) => {
        return res.status(401).json({ error: `Administrador não encontrado.` })
      })
  } catch (e) {
    return res.status(401).json({ error: "erro" })
  }
}
