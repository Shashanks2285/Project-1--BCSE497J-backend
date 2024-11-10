const express= require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const mongoUrl ="##################";
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const JWT_SECRET = "WEWUIFHASGHhUHDSBVUADUBBbhiubuefudcbrbvo32wechmvcd[]dlpwek[ff032";

mongoose.connect(mongoUrl)
    .then(()=>{
        console.log("MongoDB connected");
    })
    .catch((e)=>{
        console.log(e);
    });

require('./UserDetails');
const User = mongoose.model("UserInfo");//schema


//register API
app.post('/register', async(req,res)=>{
    const {name,email, mobile, password,userType} = req.body;
    // console.log(req.body);
    const oldUser = await User.findOne({email:email});
    if(oldUser){
        return res.send({data:"User already exist!"});
    }
    const encrypt = await bcrypt.hash(password,10);
    try {
        await User.create({
            name: name,
            email: email,
            mobile: mobile,
            password: encrypt,
            userType:userType
        });
        res.send({status:"ok", data:"User Created"});
    } catch (e) {
        // console.log(e);
        res.send({status:"error", data:e});
    }
});

//login API
app.post("/login-user", async(req, res)=>{
    const {email,password}= req.body;
    const oldUser = await User.findOne({email:email});
    // console.log(res.data);
    if(!oldUser){
        return res.send({data:"User doesnt exists!!"})
    }
    if(await bcrypt.compare(password,oldUser.password)){
        const token = jwt.sign({email:oldUser.email},JWT_SECRET);

        if(res.status(201)){
            return res.send({status:"ok",data:token});
            console.log("yes");
        }
        else{
            return res.send({error:"error"});
        }
    }
})

app.get("/",(req,res)=>{
    res.send({status:"Started"})
})

app.listen(5001,()=>{
    console.log("Server started");
})