const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
var adminSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: 'This field is required.',
      
    },
    pin: {
        type: String,
        required: 'This field is required.',
    },
    pass: {
        type: String,
        required: 'This field is required.'

    },
    repass: {
        type: String,
        required: 'This field is required.'
    },
    type: {
        type: String,
        required: 'This field is required.',
        
    },
    head: {
        type: String
    },
    member1: {
        type: String
        
    },
    rating: {
        type: Number
        
    },
    image:[String],
    tokens:[
        {
            token:{
                type: String,
              required: 'This field is required.'

            }
        }
    ]
});

//password encryption

adminSchema.pre("save",async function(next) 
{
    if(this.isModified("pass")){ 
    this.pass=await  bcrypt.hash(this.pass, 10);}

    next()
})


adminSchema.methods.generateToken = async function() {
   
    try 
       {    console.log("hello");

          const token=jwt.sign({_id:this._id.toString()},"mynameissantumodakiwanttodosomething");
          this.tokens=this.tokens.concat({token:token});
          await this.save();
          return token;
          console.log(token);
       }
    catch(error)
    {
        res.send("the error part"+error);
        console.log(error);
    }
}


const Admin=mongoose.model('Admin', adminSchema);
module.exports=Admin;