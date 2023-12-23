const connectMongo=require('./db')
const express=require('express');
var cors=require("cors");

connectMongo();

const app=express();
const port=3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth',require('./Router/auth'));
app.use('/api/note',require('./Router/notes'));

app.listen(port,()=>{
    console.log(`app is listening on the ${port}`)
})