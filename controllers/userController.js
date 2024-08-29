const User=require("../models/userModel")


//to crypt the password 
const bcrypt=require('bcrypt');
const securepassword=async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
        
    }
}



// to render the registration page this load register transfered to userRoute
const loadRegister=async(req,res)=>{
    try{
            res.render('registration',{message:''})
    }catch (error){
        console.log(error.message);
        
    }
}

 // registration form
const insertUser=async(req,res)=>{
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
            res.render('registration',{message:'your registration is sucessfull now click log in'})
        }
        else{
            res.render('registration',{message:'your registration is failed'})

        }
    } catch (error) {
        console.log(error.message);   
    }
}


//for the login page to load

const loginLoad=async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
        
    }

}

// for verify the email and password

const verifyLogin=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;

        const userData=await User.findOne({email:email})// to find the userdata from mongodb
        if (userData) {

            const passwordMatch=await bcrypt.compare(password,userData.password);

                 if (passwordMatch) {
                  req.session.user_id=userData._id;// user id is initialised to session
                    res.redirect('/home');
                 } else {
                    res.render('login',{message:"email and passcode is incurrect"});
                 }


        } else {
            res.render('login',{message:"email and passcode is incurrect"});
        }


    } catch (error) {
        console.log(error.message);
        
    }
}

//load home page after verification

const loadHome=async (req,res)=>{
    try {
       const userData=await User.findById({_id:req.session.user_id});

        res.render('home' ,{user:userData})
    } catch (error) {
        console.log(error.message);
        
    }
}


// logout option

const userLogout=async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
        
    }
}
// to load user update functionality
const editLoad=async(req,res)=>{
try {
    const id=req.query.id;
    const userData=await User.findById({_id:id});
    if (userData) {

        res.render('edit',{user:userData});
        
    } else {
        res.redirect('/home')
    }
} catch (error) {
    console.log(error.message);
    
}
}

// to update user data

const updateProfile=async(req,res)=>{
    try {
        const userData=await  User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}});
        //  res.redirect('/admin/dashboard');
         res.render('edit',{user:userData,   message: 'Successfully updated!'},);
    
    } catch (error) {
        console.log(error.message);
        
    }
}


module.exports={
   loadRegister,
   insertUser,
   loginLoad,
   verifyLogin,
   loadHome,
   userLogout,
 editLoad,
 updateProfile
}