
const exp = require("express")
//mini 
const doctorApp = exp.Router()
const expressAsyncHandler = require("express-async-handler")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Doctor = require("../models/Doctor") 
doctorApp.use(exp.json())


//create user - post 

doctorApp.post("/createdoctor", expressAsyncHandler(async (req, res) => {

    //get  new user
    const newDoctor = req.body

    const doctorObjFromDb = await Doctor.findOne({ username: newDoctor.username })

    if ( doctorObjFromDb != null) {
        res.send({ message: "username already exist" })
    }
    else {
        // before inserting hasing the password
        let hashedPassword = await bcryptjs.hash(newDoctor.password, 5);
        //replace plain password wiht hashed
        newDoctor.password = hashedPassword;

        //create new doc

        const newDoc = new Doctor({ ...newDoctor })

        let newDoctorForDb = await newDoc.save()
        console.log("doctor id created");

        res.send({ message: "doctor id created", payload: newDoctorForDb })
    }

}))
//login doctor
doctorApp.post("/login", expressAsyncHandler(async (req, res) => {

    //get  new doctor
    const loginDoctor = req.body
    //find doctor from username
    const doctorWaitingToLogin = await Doctor.findOne({ username: loginDoctor.username })
    //if doctor not found
    if (doctorWaitingToLogin == null) {
        res.send({ message: "doctor not found" })
    }
    // if doctor found 
    else {
        //compare passwords
        let status = await bcryptjs.compare(loginDoctor.password, doctorWaitingToLogin.password)
        // if password not matched
        if (status == false) {
            res.send({ message: "invalid password" })
        }
        //if passwords match , create token and send response
        else {
            let signedToken = await jwt.sign({ username: doctorWaitingToLogin.username }, process.env.SECRET_KEY, { expiresIn: 100 })
            res.status(200).send({ message: "login success", token: signedToken, doctor: doctorWaitingToLogin })
        }

    }
}))

//get doctors list
//get doctors
doctorApp.get('/getdoctors',expressAsyncHandler(async(req,res)=>{

    //we have to call on model and no need toArray //if any thing returns query try to use exec() method on them
    //exec() is optional
    let doctors = await Doctor.find().exec()

    res.send({message:"doctorsData",payload:doctors})
}))

//get  doctors by username
//get user by username
doctorApp.get('/getdoctors/:username',expressAsyncHandler(async(req,res)=>{
    //get username from url
    let usernameFromUrl=req.params.username
     //find user by username
     let doctorFromDb = await Doctor.findOne({username:usernameFromUrl}).exec()
 
     //if user not found, it returns null
     if(doctorFromDb==null){
         res.send({message:"doctor not found"})
     }
     //if user existed
     else{
         res.send({message:"doctor existed",payload:doctorFromDb})
     }
     
 }))

//path not available middleware
doctorApp.use((req, res, next) => {
    res.send({ message: `path ${req.url} is not found` })
})


//error handling middleware
doctorApp.use((err, req, res, next) => {
    res.send({ message: "error!", payload: err.message })
})


//export
module.exports = doctorApp