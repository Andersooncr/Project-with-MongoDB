const { text } = require('body-parser');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User')
const User = mongoose.model("new_user")

//Home Page
router.get('/',(req,res)=>{
    res.render("admin/home")
});

//Register Page
router.get('/register',(req,res)=>{
    res.render("admin/register")
});

//Records Page
router.get('/records',(req,res)=>{
    User.find().lean().sort({date:'desc'}).then((records)=>{
        res.render("admin/records", {records: records})
    }).catch((err)=>{
        req.flash("error_msg", "An error occurred while finding users")
        res.redirect('/admin')
    })
});

//Var of validation
var crash = []

//Creat users
router.post('/register/new',(req,res)=>{

    //Validation
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        crash.push({text: "Invalid name"});
    }
    if(!req.body.surname || typeof req.body.surname == undefined || req.body.surname == null){
        crash.push({text: "Invalid surname"});
    }
    if(crash.length>0){
        res.render('admin/register', {crash: crash});
    }

    //Creat new user
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

//Edit page
router.get('/records/edit/:id',(req,res)=>{
    User.findById({_id:req.params.id}).lean().then((records)=>{
        res.render('admin/editrecords', {records: records})
    }).catch((err)=>{
        req.flash('error_msg', "This user wont exists")
        res.redirect('/admin/records')
    })
    
})

//Edit user
router.post('/records/edit',(req,res)=>{
    //Validation
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        crash.push({text: "Invalid name"});
    }
    if(!req.body.surname || typeof req.body.surname == undefined || req.body.surname == null){
        crash.push({text: "Invalid surname"});
    }
    if(crash.length>0){
        res.render('admin/register', {crash: crash});
    }

    //Edit User
    User.findOne({_id:req.body.id}).then((records)=>{
        records.name = req.body.name
        records.surname = req.body.surname
        records.save().then(()=>{
            req.flash('success_msg', "User edited")
            res.redirect("/admin/records")
        }).catch((err)=>{
            req.flash('error_msg', "An error occurred while updating the user")
            res.redirect('/admin/records')
        })
    }).catch((err)=>{
        if(crash.length===0){
            req.flash('error_msg', "An error occurred while updating the user")
            res.redirect('/admin/records')
        }
    })
})

module.exports = router



    