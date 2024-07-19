import {Router} from "express";
import { check } from 'express-validator'
import { validarCampos, validarArchivoSubir, validarJWT } from '../middleware/index.js'
import { createPublication } from '../controllers/index.js'

const route = Router();

//Rutas de crear publicacion
route.post('/publication/create',[
    validarJWT,
    check('publicacion','La publicacion no debe de estar vacia, minimo tiene que tener 5 caracteres')
    .trim().toLowerCase().notEmpty().isLength({min:5, max:3000}),
    validarCampos
],createPublication)

export default route