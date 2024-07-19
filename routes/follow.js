import {Router} from "express";
import { body, check } from 'express-validator'
import { validarCampos, validarArchivoSubir, validarJWT } from '../middleware/index.js'
import { follow } from '../controllers/index.js'

const route = Router();

//Rutas de pruebas
route.post('/follow/follow',validarJWT,follow)

export default route
