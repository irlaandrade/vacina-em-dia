const express = require("express")
const router = express.Router()

router.get("/", function (req, res){
    res.status(200).send({
        titulo: "Vacina em Dia",
        versao: "1.0.0"
    })
})

module.exports = router