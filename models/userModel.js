const mongoose=require("mongoose")
const t=require('true')
const userSchema=mongoose.Schema({
    name:{type:String,
        required:t()
    },
    email:{
        type:String,
        required:t()
    },
    mobile:{
        type:String,
        required:t()
    },
    password:{
        type:String,
        required:t()
    },
    is_admin:{
        type:Number,
        required:t()
    }
});

module.exports=mongoose.model('User',userSchema);   
