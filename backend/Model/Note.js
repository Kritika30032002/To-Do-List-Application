const mongoose=require('mongoose')
const {Schema}=mongoose;
const UserSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'

    },
    title:{
        required:true,
        type:String
    },
    description:{
        required:true,
        type:String
    }
})
module.exports=mongoose.model('note',UserSchema)