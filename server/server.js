const express = require('express')
const cors = require ('cors')
const bodyparser = require('body-parser')
const bcrypt = require('bcrypt')

const mongoose = require ('mongoose')

const app = express()

app.use(cors())
app.use(bodyparser.json())

mongoose.connect(
    'mongodb://localhost:27017/mern-rtc',{useNewUrlParser: true}

).then(()=> {
    console.log("Mongodb is Connected...!!")
})

const User = mongoose.model('User',{
    username:String,
    email: String ,
    password : String
})

app.post('/register', async (request, response)=>{
    const { username , email , password } = request.body;
    try{
        const securePassword = await bcrypt.hash(password,10);
        
        const user = new User({
            username,email,password:securePassword
        })
        await user.save();
        console.log("user registered successfully ")
        
        response.status(200).json("!!!!!!!!!")
    }
    catch (error ){
        request.status(500).json({error })
    }
})

app.post('/login', async (request, response)=>{
    const { email , password } = request.body;
    try{
        const user = await User.findOne({email})

        if (!user) {
            return response.status(401).json("Could not found User in Db")
        }
        const validPassword = await bcrypt.compare(password,user.password)

        if (!validPassword){
            return response.status(402).json("password not matched")
        }
        response.status(200).json("Login Successful ")
    }
    catch (error) {
        console.log ("failed ")
    }
})



app.listen(5000,()=>{
    console.log("server listening on port 5000")
})

