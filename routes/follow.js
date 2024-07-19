import {Router} from "express";
import { body, check } from 'express-validator'
import { validarCampos, validarArchivoSubir, validarJWT } from '../middleware/index.js'
import { follow, unfollow } from '../controllers/index.js'

const route = Router();

//Rutas para seguir a un usuario
route.post('/follow/follow',validarJWT,follow)

//Ruta para dejar de seguir a un usuario
route.delete('/follow/unfollow/:id',[
    validarJWT,
    check('id','No es un id de mongo valido').isMongoId(),
    validarCampos
],unfollow)


export default route
