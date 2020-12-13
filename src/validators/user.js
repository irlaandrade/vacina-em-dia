const yup = require('yup')

yup.setLocale({
  string: {
    email: 'Esse e-mail não é válido',
    min: 'A senha precisa ter no mínimo 8 caracteres'
  }
})

exports.signupUserSchema = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório'),
  email: yup.string().required('O campo e-mail é obrigatório'),
  password: yup.string().min(8).required('É necessário inserir a senha'),
  cpf: yup.string().required('O campo CPF é obrigatório'),
  phone: yup.string().required('O campo telefone é obrigatório')
}).required('Esse objeto não pode ser vazio')