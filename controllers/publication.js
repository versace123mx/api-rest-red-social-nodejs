import { Publication } from '../models/index.js'

//Guardar Publicacion
const createPublication = async (req, res) => {

    const { publicacion } = req.body

    try {
        const modeloPublicacion = await new Publication({text:publicacion,user:req.usuario.id})
        modeloPublicacion.save({new:true})
        res.status(200).json({status:"success",msg:"Publicacion guardada exitosamente",data:modeloPublicacion })
    } catch (error) {
        res.status(404).json({ status: "error", msg:"Error al guardar la publicacion.",data:'',error})
    }

}

//Sacar una publicacion
const showPublication = async (req,res) => {

    const { id } = req.params

    try {

        const result = await Publication.find({
            $and:[
                {_id:id},{estado:true}
            ]
        })
        .select('-update_at')// del modelo Publication quitamos el update_at
        .populate('user',"-password -estado -role -imagen -update_at -__v -bio -create_at")//del usuario que creo la publicacion quitamos todos estos campos
    
        if(!result.length){
            return res.status(404).json({status:"success",msg:"No hay registros encontrados",data:[] })
        }
    
        res.status(200).json({status:"success",msg:"Publicacion show",data:result })

    } catch (error) {
        return res.status(400).json({status:"error",msg:"Eror en la operacion, no se pudo ejecutar",data:[] })
    }

}

//eliminar publicaciones

//Listar todas las publicaciones del usuario logueado

//listar publicaciones de un usuario

//subir ficheros

//devolver archivos multimedia imagenes



export {
    createPublication,
    showPublication
}