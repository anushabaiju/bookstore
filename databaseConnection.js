// import mongoose
const mongoose = require("mongoose")

connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log("mongoDb Connected Successfuly");
}).catch((err)=>{
    console.log(`MongoDb Connection Failed..Due to : ${err}`);
    
})