const User=require("../models/userModel");
const bcrypt=require('bcrypt');     


//to crypt the password 
// const bcrypt=require('bcrypt');
const securepassword=async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
        
    }
}



const loadLogin=async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
        
    }
}

// for verification of mail and password and admin or not 

const verifyLogin=async(req,res)=>{

    try {
        const email=req.body.email;
        const password=req.body.password;

        const userData=await User.findOne({email:email});
              // check user email is inside database or not
        if (userData) {                                            
            const passwordMatch=await bcrypt.compare(password,userData.password);
                        // check the password is match or not 
                    if (passwordMatch) {         
                          //to check the it is user or not                          
                                if (userData.is_admin==0) {                  
                                    res.render("login",{message:'you are not admin ,go to user login'}); 
                                } else {
                                  //  initialise session with userdata
                                    req.session.user_id=userData._id;    
                                     res.redirect("/admin/home");
                                }

                    } else {
                        res.render("login",{message:'email and password is wrong'});
                    }

        } else {
            res.render("login",{message:'email and password is wrong'});
        }

    } catch (error) {
        console.log(error.message);
        
    }
}


//render the admin dashboard of admin home 
const loadDashboard=async (req,res)=>{
    try {
        const userData=await User.findById({_id:req.session.user_id});
        res.render('home',{admin:userData});
    } catch (error) {
        console.log(error.message);
        
    }
}

// distry session in admin for logout 
const logout=async(req,res)=>{
    try {
        req.session.destroy();
        return res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
        
    }
}


const adminDashbosrd=async(req,res)=>{
    try {
        const usersData=await User.find({is_admin:0});
        res.render('dashboard',{users:usersData});
    } catch (error) {
        console.log(error.message);
        
    }
}

// new user insert in db
const newUserLoad=async(req,res)=>{
try {
    res.render('new-user',{message:''});
} catch (error) {
    console.log(error.message);
    
}
}



const addUser=async(req,res)=>{
    try {
       
        // console.log(req.body);
        const spassword=await securepassword(req.body.password); //get password here and make it crypted 
        const user=new User({

            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            password:spassword,
            is_admin:0
        });
        const userData=await user.save();
        if(userData){
            res.render('new-user',{message:'new userinserted sucessfully'});
        }
        else{
            res.render('new-user',{message:'your registration is failed'});

        }
    } catch (error) {
        console.log(error.message);   
    }
}

//for the edit user functionality

const editUserLoad=async(req,res)=>{
    try {
        const id=req.query.id;
        const userData=await User.findById({_id:id})
        if (userData) {
            res.render('edit-user',{user:userData},);

        } else {
            res.redirect('/admin/dashboard')
        }
       
    } catch (error) {
        console.log(error.message);
        
    }
}

// to update users
const updateUsers=async(req,res)=>{
    try {
      const userData=await  User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}});
    //  res.redirect('/admin/dashboard');
     res.render('edit-user',{user:userData,   message: 'Successfully updated!'},);

    } catch (error) {
        console.log(error.message);
        
    }
}

//to delete the user

const deleteUser=async(req,res)=>{
    try {
        const id=req.query.id;
        await User.deleteOne({_id:id});
        res.redirect('/admin/dashboard'); 
        
    } catch (error) {
        console.log(error.message);
        
    }
}

//to search user
// const searchUserLoad=async(req,res)=>{
//     try {
//         res.render('search');
//     } catch (error) {
//         console.log(error.message);
        
//     }
// }

const searchUser = async (req, res) => {
    try {
        const query = req.query.query || ''; 
        const regex = new RegExp('^' + query, 'i'); 

        const users = await User.find({
            $or: [
                { name: { $regex: regex } },
                { email: { $regex: regex } }
            ]
            ,is_admin:0 });

        res.render('dashboard', { users });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};


module.exports={
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashbosrd,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser,
    // searchUserLoad,
    searchUser
}