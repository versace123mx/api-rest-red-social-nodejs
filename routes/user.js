import { Router } from "express";
import { check } from 'express-validator'
import { validarCampos, validarArchivoSubir, validarJWT } from '../middleware/index.js'
import { register, login } from "../controllers/index.js";
const route = Router();

//Ruta para crear el usuario
route.post('/user',[
    check('name','El campo nombre es requerido').notEmpty().trim().toLowerCase(),
    check('nick','El campo nick es requerido').notEmpty().trim().toLowerCase(),
    check('nick','El campo nick debe ser minimo de 4 caracteres').isLength({min:8,max:50}).trim().toLowerCase(),
    check('email','El campo email es requerido').notEmpty().trim().toLowerCase(),
    check('email','El campo email no tine formato de email valido').isEmail().trim().toLowerCase(),
    check('password','El campo password es requerido').notEmpty().trim(),
    check('password','El password debe de ser minimo de 8 caracteres').isLength({min:8,max:70}).trim(),
    check('surname').trim().toLowerCase(),
    validarCampos
],register)

//Ruta para el login y generar token
route.post('/login',[
    check('email','El campo email es requerido').notEmpty().trim().toLowerCase(),
    check('email','El campo email no tine formato de email valido').isEmail().trim().toLowerCase(),
    check('password','El campo password es requerido').notEmpty().trim(),
    validarCampos
],login)

export default route