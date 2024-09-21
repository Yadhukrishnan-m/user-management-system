const express=require('express');
const t=require('true');
const admin_route=express();
const True=t();
const False=!True;

const session=require('express-session');
const config=require('../config/config');
admin_route.use(session({secret:config.sessionSecret,
    resave:False,
    saveUninitialized:True
})) 


// body purser
const bodyParser= require('body-parser')
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

const adminController=require('../controllers/adminController')

const auth=require('../middleware/adminAuth'); // to require middleware 
const mailauth = require('../middleware/mailauth'); //to require duplicate email middleware

admin_route.get('/',auth.isLogout,adminController.loadLogin);


//for verification of mail and password
admin_route.post('/',adminController.verifyLogin);

admin_route.get('/home',auth.isLogin,adminController.loadDashboard); //for loading admin home

admin_route.get('/logout',auth.isLogin,adminController.logout);

admin_route.get('/dashboard',auth.isLogin,adminController.adminDashbosrd); //route for dashboard

admin_route.get('/new-user',auth.isLogin,adminController.newUserLoad); // to load user insertion 

admin_route.post('/new-user',mailauth.checkDuplicateEmailAdminAdd,auth.isLogin,adminController.addUser); // to add new user foom admin

admin_route.get('/edit-user',auth.isLogin,adminController.editUserLoad); //to load update form

admin_route.post('/edit-user',adminController.updateUsers);  // to update users

admin_route.get('/delete-user',adminController.deleteUser); //to delete the usere



admin_route.get('/search',auth.isLogin,adminController.searchUser);// to search the user

    
admin_route.get('*',function(req,res){
    res.redirect('/admin');         //after localhost.../admin whatever the parameter passed it redirect to /admin again
    })

module.exports= admin_route
