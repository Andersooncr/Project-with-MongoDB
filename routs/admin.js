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


//Creat users
router.post('/register/new',(req,res)=>{
    //Validation
    let crash = []
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

//Edit user page
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
    let invalidedit = [] 
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        invalidedit.push({text: "Invalid name"});
    }
    if(!req.body.surname || typeof req.body.surname == undefined || req.body.surname == null){
        invalidedit.push({text: "Invalid surname"});
    }
    if(invalidedit.length>0){
        res.render('admin/records', {invalidedit: invalidedit});
    }else{

        //Edit user
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
    Post.find().lean().populate('user').sort({date:'desc'}).then((posts)=>{
        res.render('admin/posts', {posts: posts})
    }).catch((err)=>{
        req.flash('error_msg', "An error ocurred while finding posts")
        res.redirect('/admin/records')
    })
})

//Register post
router.get('/new-post',(req,res)=>{
    User.find().lean().then((user)=>{
        res.render("admin/new_post", {user: user})
    }).catch((err)=>{
        req.flash("error_msg", "An error ocurred while load form")
        res.redirect('/admin')
    })
})

//Create new post
router.post('/posts/new',(req,res)=>{
    //validation 
    let invalidpost = []
    if(!req.body.alert || typeof req.body.alert == undefined || req.body.alert == null){
        invalidpost.push({text: "Invalid alert"});
    }
    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        invalidpost.push({text: "Invalid description"});
    }
    if(!req.body.contents || typeof req.body.contents == undefined || req.body.contents == null){
        invalidpost.push({text: "Invalid contents"});
    }
    if(req.body.user == "0"){
        invalidpost.push({text: "Invalid user, register a user"});
    }
    if(invalidpost.length>0){
        res.render('admin/new_post', {invalidpost: invalidpost});
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

//Edit post page
router.get('/posts/edit_post/:id',(req,res)=>{
    Post.findOne({_id:req.params.id}).lean().then((post)=>{
        User.find().lean().then((user)=>{
            res.render('admin/editpost', {user: user, post: post})
        }).catch((err)=>{
            req.flash('error_msg', "An error ocurred while listing the users")
            res.redirect('/admin/posts')
        })
    }).catch((err)=>{
        req.flash('error_msg', "An error ocurred when load form")
        res.redirect('/admin/posts')
    })
    
})

//Edit post
router.post('/posts/edit/post',(req,res)=>{
    //Validation
    let invalideditpost = [] 
    if(!req.body.alert || typeof req.body.alert == undefined || req.body.alert == null){
        invalideditpost.push({text: "Invalid alert"});
    }
    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        invalideditpost.push({text: "Invalid description"});
    }
    if(!req.body.contents || typeof req.body.contents == undefined || req.body.contents == null){
        invalideditpost.push({text: "Invalid contents"});
    }
    if(req.body.user == "0"){
        invalideditpost.push({text: "Invalid post, register a new post"});
    }
    if(invalideditpost.length>0){
        res.render('admin/posts', {invalideditpost: invalideditpost});
    }else{

        //Edit user
        Post.findOne({_id:req.body.id}).then((post)=>{
            post.alert = req.body.alert
            post.description = req.body.description
            post.contents = req.body.contents
            post.user = req.body.user
            post.save().then(()=>{
                req.flash('success_msg', "Post edited")
                res.redirect("/admin/posts")
            }).catch((err)=>{
                req.flash('error_msg', "An error occurred while updating the post")
                res.redirect('/admin/posts')
            })
        }).catch((err)=>{
            req.flash('error_msg', "An error occurred while updating the post")
            res.redirect('/admin/posts')
        })
    }
})

//Delete post
router.post('/posts/delete',(req,res)=>{
    Post.deleteOne({_id:req.body.id}).then(()=>{
        req.flash('success_msg', "Post deleted")
        res.redirect("/admin/posts") 
    }).catch((err)=>{
        req.flash('error_msg', "An error occurred while deleting the post")
        res.redirect('/admin/posts')
    })
})


module.exports = router