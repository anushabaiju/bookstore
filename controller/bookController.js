const books = require("../model/bookModel");
const stripe = require("stripe")(process.env.secretKey)


// add book
exports.addBookController= async (req,res)=>{
    console.log("Inside addbook controller");
    const{title,author,noofpages,imageurl,price,dprice,abstract,publisher,language,isbn,category} = req.body

    uploadedImg =[]
    req.files.map((item)=>uploadedImg.push(item.filename))

    console.log(uploadedImg);
    const email = req.payload
    console.log(email);

    try{
        const existingBook = await books.findOne({title,userMail:email})
        if(existingBook){
            res.status(401).json("You are already added the Book!!!")
        }else{
            const newBook = new books({
                title,author,noofpages,imageurl,price,dprice,abstract,publisher,language,isbn,category,uploadedImg,userMail:email,status:"pending"
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    }catch(err){
        res.status(500).json(err)

    }
        
    
}

// to get all books
exports.getHomeBookController= async (req,res)=>{
  console.log("inside get home controller");
    

    try{
        const homeBooks = await books.find().sort ({_id:-1}).limit(4)
        res.status(200).json(homeBooks)
       
    }
    catch(err){
        res.status(500).json(err)

    }

}

// to get all books
exports.getAllBookController= async (req,res)=>{
  console.log("inside get home controller");
  console.log(req.query.search);
  const searchKey = req.query.search 
  const email = req.payload
  
    

    try{
        const query ={
            title:{
                $regex:searchKey,$options:"i"
            },
            userMail:{
                $ne:email
            }
        }
        const allBooks = await books.find(query)
        res.status(200).json(allBooks)
       
    }
    catch(err){
        res.status(500).json(err)

    }

}

// to get a particular book
exports.getABookController= async (req,res)=>{
  console.log("inside get home controller");
    const {id} = req.params
    console.log(id);
    

    try{
        const aBook = await books.findOne({_id:id})
        res.status(200).json(aBook)
       
    }
    catch(err){
        res.status(500).json(err)

    }

}

// ---------------------admin-------------------

// to get all boooks - pending status
exports.getAllBookAdminController= async (req,res)=>{
  console.log("inside get home controller");
   
    try{
        const allBooks = await books.find()
        res.status(200).json(allBooks)
       
    }
    catch(err){
        res.status(500).json(err)

    }

}

// to get all boooks - pending status
exports.approveBookController= async (req,res)=>{
  console.log("inside approvebook controller");
  const{_id,title,author,noofpages,imageurl,price,dprice,abstract,publisher,language,isbn,category,uploadedImg,status,userMail,brought} = req.body
  console.log(_id,title,author,noofpages,imageurl,price,dprice,abstract,publisher,language,isbn,category,uploadedImg,status,userMail,brought);
  
   
    try{
        const updatedBook = await books.findByIdAndUpdate({_id},{_id,title,author,noofpages,imageurl,price,dprice,abstract,publisher,language,isbn,category,uploadedImg,status:"approved",userMail,brought},{new:true})

        res.status(200).json(updatedBook)
       
    }
    catch(err){
        res.status(500).json(err)

    }

}

// to get user books
exports.getAllUserBookController= async (req,res)=>{
  console.log("inside getAllUserBookController");
    const email = req.payload
    console.log(email);

    try{
        const alluserBooks = await books.find({userMail:email})
        res.status(200).json(alluserBooks)
       
    }
    catch(err){
        res.status(500).json(err)

    }

}

// to get all books brought by user
exports.getAllUserBroughtBookController= async (req,res)=>{
  console.log("inside getAllUserBroughtBookController");
    const email = req.payload
    console.log(email);

    try{
        const allBroughtBooks = await books.find({brought:email})
        res.status(200).json(allBroughtBooks)
       
    }
    catch(err){
        res.status(500).json(err)

    }

}

// to delete a user book
exports.deleteUserBookController= async (req,res)=>{
  console.log("inside deleteUserBookController");
    const {id} = req.params
    console.log(id);

    try{
        await books.findByIdAndDelete({_id:id})
        res.status(200).json("Deleted Successfully..")
       
    }
    catch(err){
        res.status(500).json(err)

    }

}

// to delete a user book
exports.makePaymentController= async (req,res)=>{
  console.log("inside makePaymentController ");
  const {bookDetails} = req.body
  const email = req.payload
    try{
        const existingBook = await books.findByIdAndUpdate({_id:bookDetails._id},{
            title:bookDetails.title,
            author:bookDetails.author,
            noofpages:bookDetails.noofpages,
            imageurl:bookDetails.imageurl,
            price:bookDetails.price,
            dprice:bookDetails.dprice,
            abstract:bookDetails.abstract,
            publisher:bookDetails.publisher,
            language:bookDetails.language,
            isbn:bookDetails.isbn,
            category:bookDetails.category,
            uploadedImg:bookDetails.uploadedImg,
            status:"sold",
            userMail:bookDetails.userMail,
            brought:email
        },{new:true})

        const line_item =[{
            price_data :{
                currency:"usd",
                product_data:{
                   name:bookDetails.title,
                   description:`${bookDetails.author} | ${bookDetails.publisher}`,
                   images:[bookDetails.imageurl],
                   metadata:{
                     title:bookDetails.title,
                     author:bookDetails.author,
                     noofpages:`${bookDetails.noofpages}`,
                     imageurl:bookDetails.imageurl,
                     price:`${bookDetails.price}`,
                     dprice:`${bookDetails.dprice}`,
                     abstract:bookDetails.abstract,
                     publisher:bookDetails.publisher,
                     language:bookDetails.language,
                     isbn:bookDetails.isbn,
                     category:bookDetails.category,
                     // uploadedImg:bookDetails.uploadedImg,
                     status:"sold",
                     userMail:bookDetails.userMail,
                      brought:email
                   }
            },
            unit_amount :Math.round(bookDetails.dprice*100)
        },
        quantity:1
        }]

        // create checkout session
        const session = await stripe.checkout.sessions.create({
            // purchased type
            payment_method_types : ["card"],
            // details of product that is purchasing
            line_items : line_item,
            // make payment
            mode: "payment",
            // if payment success -url to be shown
            success_url:"http://localhost:5173/payment-success",
             // if payment error -url to be shown
             cancel_url:"http://localhost:5173/payment-error"
        });
        console.log(session);
         
        res.status(200).json({url: session.url})
        
    }
    catch(err){
        res.status(500).json(err)

    }

}
