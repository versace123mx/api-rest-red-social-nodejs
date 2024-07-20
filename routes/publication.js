import {Router} from "express";
import { check } from 'express-validator'
import { validarCampos, validarArchivoSubir, validarJWT } from '../middleware/index.js'
import { createPublication, showPublication, deletePublication } from '../controllers/index.js'

const route = Router();

//Rutas de crear publicacion
route.post('/publication/create',[
    validarJWT,
    check('publicacion','La publicacion no debe de estar vacia, minimo tiene que tener 5 caracteres')
    .trim().toLowerCase().notEmpty().isLength({min:5, max:3000}),
    validarCampos
],createPublication)

//Mostrar una publicacion de cualquier usuario
route.get('/publication/show-publication/:id',[
    validarJWT,
    check('id','El id no es un id de Mongo valido').isMongoId(),
    validarCampos
],showPublication)

//Eliminar una publicacion que sea del usuario registrado
route.delete('/publication/delete-publication/:id',[
    validarJWT,
    check('id','El id no es un id de Mongo valido').isMongoId(),
    validarCampos
],deletePublication)


export default route