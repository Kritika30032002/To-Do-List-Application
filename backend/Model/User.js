const mongoose=require('mongoose')
const {Schema}=mongoose;
const UserSchema=new Schema({
    name:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    }
})
module.exports=mongoose.model('user',UserSchema)