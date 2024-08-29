const User=require("../models/userModel")

const checkDuplicateEmail = async (req, res, next) => {
    try {
         const email = req.body.email;
        const existingUser = await User.findOne({ email: email });
        
        if (existingUser) {
            return res.render('registration', { message: 'Email already exists. Please use another email.' });
        }
        
        next(); 

    } catch (error) {
        console.log(error.message);
       
    }
};

const checkDuplicateEmailAdminAdd = async (req, res, next) => {
    try {
         const email = req.body.email;
        const existingUser = await User.findOne({ email: email });
        
        if (existingUser) {
            return res.render('new-user', { message: 'Email already exists. Please use another email.' });
        }
        
        next(); 

    } catch (error) {
        console.log(error.message);
       
    }
};



module.exports ={
    checkDuplicateEmail,
    checkDuplicateEmailAdminAdd,
   
}
