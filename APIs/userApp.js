
const exp = require("express")
//mini 
const userApp = exp.Router()
const expressAsyncHandler = require("express-async-handler")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
userApp.use(exp.json())


//create user - post (signup)

userApp.post("/createuser", expressAsyncHandler(async (req, res) => {

    //get  new user
    const newUser = req.body

    const userObjFromDb = await User.findOne({ username: newUser.username })

    if (userObjFromDb != null) {
        res.send({ message: "username already exist" })
    }
    else {
        // before inserting hasing the password
        let hashedPassword = await bcryptjs.hash(newUser.password, 5);
        //replace plain password wiht hashed
        newUser.password = hashedPassword;

        //create new doc

        const newDocument = new User({ ...newUser })

        let newUserForDb = await newDocument.save()
        console.log("user created");

        res.send({ message: "user created", payload: newUserForDb })
    }

}))
//login user
userApp.post("/login", expressAsyncHandler(async (req, res) => {

    //get  new user
    const loginUser = req.body
    //find user from username
    const userWaitingToLogin = await User.findOne({ username: loginUser.username })
    //if user not found
    if (userWaitingToLogin == null) {
        res.send({ message: "user not found" })
    }
    // if user found 
    else {
        //compare passwords (user typed data,db data)
        let status = await bcryptjs.compare(loginUser.password, userWaitingToLogin.password)
        // if password not matched
        if (status == false) {
            res.send({ message: "invalid password" })
        }
        //if passwords match , create token and send response
        else {
            let signedToken = await jwt.sign({ username: userWaitingToLogin.username }, process.env.SECRET_KEY, { expiresIn: 100 })
            //create url
            

            res.send({ message: "login success", token: signedToken, user: userWaitingToLogin})
        }

    }
}))
//get user by username
userApp.get('/getuser/:username', expressAsyncHandler(async (req, res) => {
    //get username from url
    let usernameFromUrl = req.params.username
    //find user by username
    let userFromDb = await User.findOne({ username: usernameFromUrl }).exec()

    //if user not found, it returns null
    if (userFromDb == null) {
        res.send({ message: "user does not found" })
    }
    //if user existed
    else {
        res.send({ message: "user existed", payload: userFromDb })
    }

}))

//path not available middleware
userApp.use((req, res, next) => {
    res.send({ message: `path ${req.url} is not found` })
})


//error handling middleware
userApp.use((err, req, res, next) => {
    res.send({ message: "error!", payload: err.message })
})


//export
module.exports = userApp