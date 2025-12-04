const users = require("../model/userModel");
var jwt = require('jsonwebtoken');

// register
exports.registerController =async (req,res)=>{
    // logic
    const {username,email,password} = req.body
    console.log(username,email,password);
    try{
        const existingUser = await users.findOne({email})
        if(existingUser){
            res.status(400).json("Already existing user...")
        }else{
            const newUser = new users({
                username,
                email,
                password,
                profile:""
            })
            await newUser.save() //momgodb save
            res.status(200).json(newUser)
        }
    }catch(err){
        res.status(500).json(err)
    }
    
}

// login
exports.loginController =async (req,res)=>{
    // logic
    const {email,password} = req.body
    console.log(email,password);
    try{
        const existingUser = await users.findOne({email})
        if(existingUser){
            if(existingUser.password == password){
                const token=jwt.sign({userMail:existingUser.email},'secretKey')
                console.log(token);
                
                res.status(200).json({existingUser,token})
            }else{
                res.status(401).json("Password Doesnot Match!!")
            }
            
        }else{
           res.status(404).json("User Doesnot Exist!!!")
        }
    }catch(err){
        res.status(500).json(err)
    }
    
}
 // google login
exports.googleLoginController = async (req, res) => {
    const { username, email, profile } = req.body;
    console.log(username, email, profile);

    try {
        // Check existing user
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            const token = jwt.sign({ userMail: existingUser.email }, 'secretKey');
            return res.status(200).json({ existingUser, token });
        }

        // Create new user
        const newUser = new users({
            username,
            email,
            password: "",   // Google login → no password needed
            profile
        });

        await newUser.save();

        const token = jwt.sign({ userMail: newUser.email }, 'secretkey');
        res.status(200).json({ existingUser: newUser, token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err });
}
};


// getall user controller
exports.getAllUserController = async(req,res)=>{
    const email = req.payload
    try{
        const allUsers = await users.find({email:{$ne:email}})
        res.status(200).json(allUsers)
    }catch(err){
        res.status(500).json(err)
    }
}

// update user profile controller
exports.editAdminProfileController = async(req,res)=>{
    console.log("inside editadminprofilecontroller");
    const {username,password,profile} =req.body
    const prof = req.file ? req.file.filename :profile
    const email = req.payload
    console.log(email);

    try{
        const adminDetails = await users.findOneAndUpdate({email},{username,email,password,profile:prof},{new:true})
        res.status(200).json(adminDetails)
    }catch(err){
        res.status(500).json(err)
    }
}

// update admin profile controller
exports.editUserProfileController = async(req,res)=>{
    console.log("inside edituserprofilecontroller");
    const {username,password,profile,bio} =req.body
    const prof = req.file ? req.file.filename :profile
    const email = req.payload
    console.log(email);

    try{
        const userDetails = await users.findOneAndUpdate({email},{username,email,password,profile:prof,bio},{new:true})
        res.status(200).json(userDetails)
    }catch(err){
        res.status(500).json(err)
    }
}
