const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Admin = require('../models/Admin')

function checkPassword(passwordEntry, password) {
  return bcrypt.compareSync(passwordEntry, password)
}

/**
 * Gera um token de acesso para o admin caso o e-mail e senha estejam corretos.
 * @param {Object} req - Requisição HTTP contendo email e password no body.
 * @param {Object} res - Resposta HTTP.
 * @returns {Object} Retorna o admin e o token JWT, ou erro 401 se não autorizado.
 */
exports.accessToken = (req, res) => {
  try {
    const { email, password: passwordEntry } = req.body
    Admin.findOne({ email: email })
      .then((admin) => {
        if (!admin) {
          return res.status(401).json({ error: `Administrador não encontrado.` })
        }
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
