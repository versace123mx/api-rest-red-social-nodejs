import {Router} from "express";
import { check } from 'express-validator'
import { validarCampos } from '../middleware/validar-campos.js'
import { validarArchivoSubir } from '../middleware/validar-archivo.js'

const route = Router();

//Rutas de pruebas
route.get('/red-social/user',(req,res)=>{
    res.status(200).json({msg:"Desde user"})
})

export default route