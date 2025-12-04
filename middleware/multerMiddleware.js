// import multer
const multer = require("multer")

const storage = multer.diskStorage({
    // path to store data
    destination:(req,file,callback)=>{
        callback(null,'./uploads')
    },
    // name in which file is stored
    filename:(req,file,callback)=>{
        const fname = `image-${file.originalname}`
        callback(null,fname)
    }
})

const fileFilter = (req,file,callback)=>{
    // accept only png,jpeg,jpg,svg....
    if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/svg" ){
        callback(null,true)
    }else{
        callback(null,false)
        return callback(new Error("Accept only jpeg,jpg,svg,png files"))
    }
}

// create config
const multerConfig = multer({
    storage,
    fileFilter
})

module.exports = multerConfig

