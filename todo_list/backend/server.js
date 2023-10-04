const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const taskRoute = require('./routes/tasks');
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:3000"],
    
    credentials: true,
  }

));
// const MongoURI = "mongodb+srv://BharathK1:BharathK1@cluster0.u3jigft.mongodb.net/?retryWrites=true&w=majority";
MongoURI= "mongodb+srv://todo_krithika:krithika@cluster0.udq5ys5.mongodb.net/?retryWrites=true&w=majority";

app.use("/api/auth", authRoutes);
app.use("/api/tasks",taskRoute);

mongoose.connect(MongoURI, {
    useNewUrlParser : true,
    UseUnifiedTopology : true
}).then (() => {
    console.log("Connected to MongoDB");
}).catch ((error) => {
    console.log("An error ocurred while connecting to MONGODB");
    console.log(error);
})


const Port = 5000;
app.listen(Port , ()=> {
    console.log(`Server started on port ${Port}`)
})