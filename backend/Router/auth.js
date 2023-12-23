const express = require('express');
const router = express.Router();
const User = require("../Model/User");
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt=require('jsonwebtoken')
const JWT_SECRET="hellobrother";
const fetchuser=require("../middleware/fetchUser");
// create user
router.post('/createuser', [
    body('name', "Min length of name is 3 character").isLength({ min: 3 }),
    body('password', "enter a valid password of length 6 character").isLength({ min: 6 })
], async(req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    // create user
    try {
        let user=await User.findOne({name:req.body.name})
        if(user){
            success=false
            return res.status(500).json({success,error:"Sorry a username already exists"})
        }
        const salt = await bcrypt.genSalt(10);
const pass = await bcrypt.hashSync(req.body.password, salt);
     user=await User.create({
        name: req.body.name,
        password: pass,
    })
    const data={
        user:{
            id:user.id
        }
     }
     const authtoken=jwt.sign(data,JWT_SECRET);
     success=true;
     res.json({success,authtoken})
} catch (error) {
        console.error(error.message);
        res.status(500).send("some error ");
}
    
    
})
// login
router.post('/login',[
    body('password',"enter password").exists()
],async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
  const {name,password}=req.body;
  try {
    let user=await User.findOne({name});
    if(!user){
        return res.status(500).json({error:"Login with correct Credentials"})
    }
    const comparepassword= await bcrypt.compare(password,user.password);
    if(!comparepassword){
        return res.status(500).json({error:"Login with correct Credentials"})
    }
     const data={
        user:{
            id:user.id
        }
     }
     success=true
     const authtoken=jwt.sign(data,JWT_SECRET);
     res.json({success,authtoken})

    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error ");
    
  }

})
// fetchuser
router.post('/getuser', fetchuser,async (req, res) => {

try {
  userId =req.user.id;
 const user=await User.findById(userId).select("-password");
  res.send({user})  
} catch (error) {
console.error(error.message)
res.status(500).send("Internal Server")
}
    
})

module.exports = router;