import { Publication } from '../models/index.js'

//Guardar Publicacion
const createPublication = (req, res) => {

    const { publicacion } = req.body

    try {
        const modeloPublicacion = new Publication({text:publicacion,user:req.usuario.id})
        modeloPublicacion.save({new:true})
        res.status(200).json({status:"success",msg:"Publicacion guardada exitosamente",data:modeloPublicacion })
    } catch (error) {
        res.status(404).json({ status: "error", msg:"Error al guardar la publicacion.",data:'',error})
    }

}

//Sacar una publicacion

//eliminar publicaciones

//Listar todas las publicaciones del usuario logueado

//listar publicaciones de un usuario

//subir ficheros

//devolver archivos multimedia imagenes



export {
    createPublication
}