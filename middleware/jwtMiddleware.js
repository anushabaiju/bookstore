const jwt = require("jsonwebtoken")

const jwtMiddleware = (req,res,next)=>{
    
    // console.log(req.headers['authorization'].split(' ')[1]);
    
    const token = req.headers['authorization'].split(' ')[1]
   
    try{
        const jwtResponse = jwt.verify(token,"secretKey")
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail
         next()
        
    } catch(err){
        res.status(401).json("Invalid Token")
    }
   
    
}
module.exports = jwtMiddleware