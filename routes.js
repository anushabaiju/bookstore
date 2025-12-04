// import the express
const express = require("express")

// import userController
const UserController = require('./controller/UserController')

// import bookController
const bookController = require('./controller/bookController')
const jwtMiddleware = require("./middleware/jwtMiddleware")
const jwtAdminMiddleware = require('./middleware/jwtAdminMiddleware');


// import multer
const multerConfig = require("./middleware/multerMiddleware")


// create an instance
const route = new express.Router()

// path for register...
route.post('/register',UserController.registerController)

// path for login...
route.post('/login',UserController.loginController)

// path for google login...
route.post('/google-login',UserController.googleLoginController)

// path for get home books.
route.get('/all-home-book',  bookController.getHomeBookController)


// ...............USER....................

// path for add books...
route.post('/add-book',jwtMiddleware,multerConfig.array("uploadImages",3), bookController.addBookController)

// path for all books...
route.get('/all-book',jwtMiddleware,bookController.getAllBookController)

// path for view a book...
route.get('/view-book/:id',bookController.getABookController)

// path for update userss..
route.put('/user-profile-update',jwtMiddleware,multerConfig.single("profile"),UserController.editUserProfileController)

// path for all books...
route.get('/user-books',jwtMiddleware,bookController.getAllUserBookController)

// path for all books...
route.get('/user-brought-books',jwtMiddleware,bookController.getAllUserBroughtBookController)

// path for deleted user books...
route.delete('/delete-user-books/:id',bookController.deleteUserBookController)

// path for deleted user books...
route.put('/make-payment',jwtMiddleware,bookController.makePaymentController)

// -----------------------admin-------------------

// path for admin all book..
route.get('/admin-all-books',jwtAdminMiddleware, bookController.getAllBookAdminController)

// path for approve books..
route.put('/approve-books',jwtAdminMiddleware, bookController.approveBookController)

// path for admin all users..
route.get('/all-users',jwtAdminMiddleware, UserController.getAllUserController)

// path for update admin userss..
route.put('/profile-update',jwtAdminMiddleware,multerConfig.single("profile"),UserController.editAdminProfileController)




// routes export
module.exports = route