import {Router} from "express";
import { check } from 'express-validator'
import { validarCampos, validarArchivoSubir } from '../middleware/index.js'

const route = Router();

//Rutas de pruebas
route.get('/publication',(req,res)=>{
    res.status(200).json({msg:"Desde publicacion"})
})

export default route