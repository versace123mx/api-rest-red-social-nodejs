import mongoose from "mongoose";

//Creamos el Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String
    },
    nick:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default:"role_user"
    },
    imagen:{
        type: String,
        default:"default.png"
    },
    create_at:{
        type: Date,
        default:Date.now()
    },
    update_at:{
        type: Date,
        default:Date.now()
    }
})


//Creamos el modelo dentro colocamos el nombre de la coleccion y le pasamos el schema, la coleccione ahora en mongo sera Articulo
const User = mongoose.model('User',UserSchema);

//Exportamos el modelo
export default User;