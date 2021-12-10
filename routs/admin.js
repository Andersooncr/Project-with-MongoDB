const { text } = require('body-parser');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User')
const User = mongoose.model("new_user")

//Home page
router.get('/home',(req,res)=>{
    res.render("admin/home")
});

//Register page
router.get('/register',(req,res)=>{
    res.render("admin/register")
});

//Records page
router.get('/records',(req,res)=>{
    User.find().lean().sort({date:'desc'}).then((records)=>{
        res.render("admin/records", {records: records})
    }).catch((err)=>{
        req.flash("error_msg", "An error occurred while finding users")
        res.redirect('/admin/home')
    })
});

//Variable of validation
var crash = []

//Creat users
router.post('/register/new',(req,res)=>{

    //Validation
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        crash.push({text: "Invalid name"});
    }
    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        crash.push({text: "Invalid description"});
    }
    if(crash.length>0){
        res.render('admin/register', {crash: crash});
    }

    //Creat new user
    const newUser = {
        name: req.body.name,
        description: req.body.description
    }
    new User(newUser).save().then(()=>{
        req.flash('success_msg', "User created")
        res.redirect("/admin/records")
    }).catch((err)=>{
        if(crash.length===0){
            req.flash('error_msg', "An error occurred while registering the user")
            res.redirect('/admin/home')
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
    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        crash.push({text: "Invalid description"});
    }
    if(crash.length>0){
        res.render('admin/register', {crash: crash});
    }

    //Edit user
    User.findOne({_id:req.body.id}).then((records)=>{
        records.name = req.body.name
        records.description = req.body.description
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

//Delete user
router.post('/records/delete',(req,res)=>{
    User.deleteOne({_id:req.body.id}).then(()=>{
        req.flash('success_msg', "User deleted")
        res.redirect("/admin/records") 
    }).catch((err)=>{
        req.flash('error_msg', "An error occurred while deleting the user")
        res.redirect('/admin/records')
    })
})

//Post page
router.get('/posts',(req,res)=>{
    res.render("admin/posts")
})

//Register post post
router.get('/posts/new',(req,res)=>{
    User.find().lean().then((records)=>{
        res.render("admin/new_post", {records: records})
    }).catch((err)=>{
        req.flash("error_msg", "An error ocurred while load form")
        res.redirect('/admin')
    })
})

module.exports = router



    