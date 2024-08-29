const express=require('express');
const user_route=express();

const session =require('express-session');


const config=require("../config/config")
user_route.use(session({secret:config.sessionSecret,
    resave:false,
    saveUninitialized:true,

}))

const auth=require('../middleware/auth');

const mailauth = require('../middleware/mailauth'); //to require duplicate email middleware

const path=require("path");

user_route.set('view engine','ejs');
user_route.set('views','./views/user');



// body purser
const bodyParser= require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));


const userController=require('../controllers/userController');

user_route.get('/register',auth.isLogout,userController.loadRegister); // route for loading the form
user_route.post('/register',mailauth.checkDuplicateEmail, userController.insertUser); // route for the result after submission
// -----------------------------------------

user_route.get('/',auth.isLogout,userController.loginLoad);
user_route.get('/login',auth.isLogout,userController.loginLoad);
user_route.post('/login',userController.verifyLogin); // to verify the login

 user_route.get('/home',auth.isLogin,userController.loadHome);// to render home after verification 

 user_route.get('/logout',auth.isLogin,userController.userLogout); // to log out

 user_route.get('/edit',auth.isLogin,userController.editLoad); //to load user edit functionality

 user_route.post('/edit',userController.updateProfile);



module.exports  =  user_route;
