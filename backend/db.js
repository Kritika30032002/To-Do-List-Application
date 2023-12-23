const mongoose=require('mongoose')
// mongoose.set('strictQuery', true);
const mongoURI="mongodb://0.0.0.0:27017/deadline"
const connectMongo=async()=>{
   try {
    await mongoose.connect(mongoURI)
    console.log("connected to mongo");
    
   } catch (error) {
    console.log("some error occured")
   }
}
module.exports=connectMongo;