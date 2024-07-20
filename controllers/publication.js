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
const deletePublication = async (req, res) => {

    const { id } = req.params

    try {
        const result = await Publication.findOneAndUpdate({
            _id:id,
            user:req.usuario.id,
            estado:true
            },
            {$set:{estado:false}}
        )

        if(!result){
            return res.status(404).json({status:"success",msg:"No hay registros encontrados",data:[] })
        }
    
        res.status(200).json({status:"success",msg:"Eliminar Publicaciones",data:'' })
    } catch (error) {
        return res.status(400).json({status:"error",msg:"Eror en la operacion, no se pudo ejecutar",data:[] })
    }
}

//Listar todas las publicaciones del usuario logueado
const showPublications = async (req, res) => {

    const { limite = 5, pagina = 1 } = req.query //Los parametros que bienen en la query

    if(isNaN(limite) || isNaN(pagina)){
        return res.json({ status: "error", msj: 'Los valores deben de ser numeros' });
    }

    try {
        
        //Para este caso se crean dos promesas para que corra al mismo tiempo y se hace una destructuracion de arreglos
        const [total, post] = await Promise.all([
            Publication.countDocuments({user:req.usuario.id,estado: true}),
            Publication.find({user:req.usuario.id,estado: true})
            .skip((pagina-1)*limite).limit(limite).sort({create_at:-1})
        ])

        if(!post.length){
            return res.status(404).json({status:"success",msg:"No hay registros encontrados",data:[] })
        }

        const totalPaginas = Math.ceil(total/limite)
        res.status(200).json({ status: "success", msg:"desde el listado",
        totalRegistros:total,pagina,totalPaginas,numRegistrosMostrarXPagina:limite,data:post})

    } catch (error) {
        return res.status(400).json({status:"error",msg:"Eror en la operacion, no se pudo ejecutar",data:[] })
    }
    
}

//listar publicaciones de un usuario

//subir ficheros

//devolver archivos multimedia imagenes



export {
    createPublication,
    showPublication,
    deletePublication,
    showPublications
}