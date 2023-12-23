const jwt=require('jsonwebtoken');
const JWT_SECRET="hellobrother"
const fetchuser=(req,res,next)=>{
    const token=req.header("auth-token");
    if(!token){
        res.status(401).send("Try to validate token");
    }
    try {
        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).send("Try to validate token");
        
    }
}

module.exports=fetchuser