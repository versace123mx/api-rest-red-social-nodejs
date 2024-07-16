const pruebaUser = (req,res) => {

    res.status(200).json({msg:"Mensaje enviado desde el controlador users.js"})
}

export {
    pruebaUser
}