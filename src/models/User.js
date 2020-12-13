const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cpf: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  vaccinesTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vaccine' }]
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User