import {Router} from "express";
import { check } from 'express-validator'
import { validarCampos, validarArchivoSubir } from '../middleware/index.js'

const route = Router();

//Rutas de pruebas
route.get('/follow',(req,res)=>{
    res.status(200).json({msg:"Desde follow"})
})

export default route
