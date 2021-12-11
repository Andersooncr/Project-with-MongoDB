const { text } = require('body-parser');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User')
const User = mongoose.model("new_user")
require('../models/Post')
const Post = mongoose.model("postages")

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
    if(!req.body.surname || typeof req.body.surname == undefined || req.body.surname == null){
        crash.push({text: "Invalid surname"});
    }
    if(crash.length>0){
        res.render('admin/register', {crash: crash});
    }else{

        //Creat new user
        const newUser = {
            name: req.body.name,
            surname: req.body.surname
        }
        new User(newUser).save().then(()=>{
            req.flash('success_msg', "User created")
            res.redirect("/admin/records")
        }).catch((err)=>{
            req.flash('error_msg', "An error occurred while registering the user")
            res.redirect('/admin/home')
        })
    }
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
        res.render('admin/records', {crash: crash});
    }else{

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
            req.flash('error_msg', "An error occurred while updating the user")
            res.redirect('/admin/records')
        })
    }
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

//Register post
router.get('/new-post',(req,res)=>{
    User.find().lean().then((records)=>{
        res.render("admin/new_post", {records: records})
    }).catch((err)=>{
        req.flash("error_msg", "An error ocurred while load form")
        res.redirect('/admin')
    })
})

//Create new post
router.post('/posts/new',(req,res)=>{
    //validation 
    if(!req.body.alert || typeof req.body.alert == undefined || req.body.alert == null){
        crash.push({text: "Invalid alert"});
    }
    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        crash.push({text: "Invalid description"});
    }
    if(!req.body.contents || typeof req.body.contents == undefined || req.body.contents == null){
        crash.push({text: "Invalid contents"});
    }
    if(req.body.user == "0"){
        crash.push({text: "Invalid user, register a user"});
    }
    if(crash.length>0){
        res.render('admin/new_post', {crash: crash});
    }else{

        //New post
        const newPost = {
            alert: req.body.alert,
            description: req.body.description,
            contents: req.body.contents,
            user: req.body.user
        }
        new Post(newPost).save().then(()=>{
            req.flash('success_msg', "Post created")
            res.redirect("/admin/posts")
        }).catch((err)=>{
            req.flash('error_msg', "An error ocurred while register the post")
            res.redirect('/admin/home')
        })
    }
})

module.exports = router



    