const { response } = require("express");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const admin = require('./routs/admin')
const path = require('path')

//Config
    //Template Engine 

        app.engine('handlebars', handlebars({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');

    //Body Parser

        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());

    //Mongoose

        mongoose.Promise = global.Promise;

        mongoose.connect("mongodb://localhost/register").then(()=>{
            console.log('Mongo online');
        }).catch((err)=>{
            console.log('an error has occurred:'+ err);
        })

    //Public

        app.use(express.static(path.join(__dirname,"public")));

//Routs
  
    app.use('/admin',admin);


    
//Others

    app.listen(9091,function(){
        console.log("Server online")
    });