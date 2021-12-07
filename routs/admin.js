const { text } = require('body-parser');
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

    //Validation
    var crash = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        crash.push({text: "Invalid name"});
    }
    if(!req.body.surname || typeof req.body.surname == undefined || req.body.surname == null){
        crash.push({text: "Invalid surname"});
    }
    if(crash.length>0){
        res.render('admin/register', {crash: crash});
    }

    //Creat nre user
    const newUser = {
        name: req.body.name,
        surname: req.body.surname
    }
    new User(newUser).save().then(()=>{
        req.flash('success_msg', "User created")
        res.redirect("/admin/records")
    }).catch((err)=>{
        if(crash.length===0){
            req.flash('error_msg', "An error occurred while registering the user")
            res.redirect('/admin')
        }
    })
});

module.exports = router