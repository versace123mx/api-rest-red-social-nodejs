import fs from 'fs'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import generarJWT   from '../helper/generarJWT.js'
import { subirArchivo } from '../helper/subir-archivo.js'

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

//Login de usuario y generar token
const login = async (req,res) => {

    //Extraigo lo que llega en el body
    const { email, password } = req.body

    try {
        
        //verifico si el usuario existe
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({ status: "error", msg: "Usuario no encontrado" })
        }
        
        //validar contraseña
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword){
            return res.status(400).json({ status:"error", msg: 'El email o password son incorrectos. - password'})
        }

        //Generar JWT se accede user.id o user._id ya que mongo asi lo permite id es un alias de _id
        const token = generarJWT(user.id)

        res.status(200).json({status:"success",msg:"login",
                                data:{name:user.name,nick:user.nick,email:user.email,token}})
    } catch (error) {
        return res.status(400).json({ status:"error", msg: 'Error en la generacion del token'})
    }
    
}

//Metodo para obtener un perfil
const profile = async (req,res) => {

    //Recibo los datos del id
    const { id } = req.params
    
    //verifico si el usuario existe
    const user = await User.findById(id)
    if(!user){
        return res.status(400).json({ status: "error", msg: "Usuario no encontrado" })
    }

    return res.status(200).json({ status: "success", msg: "ruta de profile",data:user})
}

//Metodo para extraer los usuarios y paginarlos
const list = async (req, res) => {

    const { limite = 5, pagina = 1 } = req.query //Los parametros que bienen en la query

    if(isNaN(limite) || isNaN(pagina)){
        return res.json({ status: "error", msj: 'Los valores deben de ser numeros' });
    }

    //Para este caso se crean dos promesas para que corra al mismo tiempo y se hace una destructuracion de arreglos
    const [total, usuarios] = await Promise.all([
            User.countDocuments({estado: true}),
            User.find({estado: true}).skip((pagina-1)*limite).limit(limite)
        ])
    const totalPaginas = Math.ceil(total/limite)
    res.status(200).json({ status: "success", msg:"desde el listado",
        totalRegistros:total,pagina,totalPaginas,numRegistrosMostrarXPagina:limite,data:usuarios})
}

//Metodo para actualizar datos basicos
const update = async (req, res) => {

    const datos = req.body
    datos.update_at = Date.now()
    try {
        const userUpdate = await User.findByIdAndUpdate(req.usuario.id,datos, {new: true})
        res.status(200).json({ status: "success", msg:"desde update",data:userUpdate})
    } catch (error) {
        res.status(400).json({ status: "error", msg:"no se pudieron actualizar los datos.",data:'',error})
    }
}

//Metodo para actualizar la imagen de perfil
const updateImage = async (req,res) => {
    
    try {
        const { imagen } = req.usuario
    
        const pathImage = './uploads/' + imagen //creamos la ruta de la imagen previa
        //verificamos si existe la imagen
        if (fs.existsSync(pathImage)) {
                fs.unlinkSync(pathImage)//en caso de que la imagen previa exista procedemos a eliminarla
        }

        const nombre = await subirArchivo(req.files, undefined)
        req.usuario.imagen = nombre
        req.usuario.update_at = Date.now()
        await req.usuario.save({ new: true })
        res.status(200).json({ status: "success", msg:"Imagen Actualizada Correctamente"})
    } catch (error) {
        res.status(400).json({ status: "error", msg:"No se pudo actualizar la imagen.",data:'',error})
    }

}

//Metodo para obtener la imagen de perfil
const muestraImagenPerfil = (req,res) => {

    try {
        //creamos la ruta de la imagen previa
        const pathImage = `${process.cwd()}/uploads/${req.usuario.imagen}` 
        
        //verificamos si existe la imagen
        if (fs.existsSync(pathImage)) {
            return res.sendFile(pathImage)
        }

    } catch (error) {
        res.status(400).json({ status: "error", msg:"Error Al obtenr la Imagen.",data:'',error})
    }

    const pathImage = `${process.cwd()}/assets/no-image.jpg`
    return res.sendFile(pathImage)

}

export {
    register,
    login,
    profile,
    list,
    update,
    updateImage,
    muestraImagenPerfil
}