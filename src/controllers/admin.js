const Admin = require('../models/Admin')
const { signupAdminSchema } = require('../validators/admin')
const bcrypt = require('bcrypt')
const bcryptSalt = 8

exports.createAdmin = async (req, res, next) => {
  const { password } = req.body
  const salt = bcrypt.genSaltSync(bcryptSalt)
  
  try {
    const validatedBody = await signupAdminSchema.validate(req.body)

    const admin = new Admin(validatedBody)

    Admin.findOne({ email: validatedBody.email }).then(async (existingAdmin) => {
      if (existingAdmin) {
        return res.status(400).json({
          error: ["Já existe uma conta com esse e-mail"],
        })
      }

      const passwordHashed = await bcrypt.hashSync(password, salt)
      admin.password = passwordHashed

      admin.save()
        .then((admin) => res.status(200).json(admin))
        .catch(err => next(err));
    })
    .catch((err) => {
      res.status(400).json(err)
    })
  } catch (e) {
      res.status(400).json(e)
  }
}