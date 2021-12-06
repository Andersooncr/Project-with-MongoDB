const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User')
const User = mongoose.model("new_user")


router.get('/',(req,res)=>{
    res.render("admin/home")
});

router.get('/register',(req,res)=>{
    res.render("admin/register")
});

router.get('/records',(req,res)=>{
    res.render("admin/records")
});

router.post('/register/new',(req,res)=>{
    const newUser = {
        name: req.body.name,
        surname: req.body.surname
    }
    new User(newUser).save().then(()=>{
        console.log("User created")
    }).catch((err)=>{
        console.log("Ocurred a error "+err)
    })
});

module.exports = router