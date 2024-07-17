import bcrypt from 'bcryptjs'
import User from '../models/User.js'

//Registrar usuario
const register = async (req,res) => {

    //hacemos desestructuring
    const {nick,email,password,...data} = req.body

    //creamos un objeto usuario y le asignamos los datos que vamos a guardar, los que destructuramos y el resto
    const usuario = new User({nick,email,password,...data})

    //validamos si el nick o el email ya existen ya que estos campos son unicos
    const user = await User.findOne({"$or":[{nick}, {email}]})
    if(user){
        return res.status(400).json({status:"error",msg:"El nickname o el email ya exiten, intenta con otro nickname u otro email",nick,email})
    }

    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt) //Encriptamos la contraseña con el salt del objeto usuario.password

    //Guardar en DB
    try {
        await usuario.save()
        res.status(200).json({status:"success",msg:"Usuario registrado correctamente",usuario})
    } catch (error) {
        return res.status(400).json({status:"error",msg:"Se produjo un erro al guardar el registro",error})
    }
}

export {
    register
}