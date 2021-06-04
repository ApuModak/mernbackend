const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

var employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },
    adhar: {
        type: String,
        required: 'This field is required.'
    },
    fathername: {
        type: String,
        required: 'This field is required.'
    },
    mothername: {
        type: String,
        required: 'This field is required.'
    },
    Distric: {
        type: String,
        required: 'This field is required.'
    },
    block : {
        type: String,
        required: 'This field is required.'
    },
    village: {
        type: String,
        required: 'This field is required.'
    },
   pinno: {
        type: String,
        required: 'This field is required.'
    },
   Bdopin: {
        type: String,
        required: 'This field is required.'
    },
    quali: {
        type: String,
        required: 'This field is required.'
    },
    skill: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    password: {
        type: String
    },
    home: {
        type: String,
        required: 'This field is required.'
    },
    family: {
        type: String,
        required: 'This field is required.'
    },
    answer: {
        type: String,
        required: 'This field is required.'
    },
    hospital: {
        type: String,
        required: 'This field is required.'
    },
    medical: {
        type: String,
        required: 'This field is required.'
    },
    facility: {
        type: String,
        required: 'This field is required.'
    },
    employee: {
        type: String,
        required: 'This field is required.'
    },
    rating: {
        type: Number
        
    },
    tokens:[
        {
            token:{
                type: String,
              required: 'This field is required.'

            }
        }
    ]
});

//Generating password
employeeSchema.pre("save",async function(next) 
{
    if(this.isModified("password")){ 
    this.password=await  bcrypt.hash(this.password, 10);}

    next()
})



//Generating token

employeeSchema.methods.generateAuthToken = async function() {
   
    try 
       {    console.log("hello");

          const token=jwt.sign({_id:this._id.toString()},"mynameissantumodakiwanttodosomething");
          this.tokens=this.tokens.concat({token:token});
          await this.save();
          return token;
          console.log(token);
       }
    catch(error)
    {   console.log(error);
        res.send("the error part"+error);
        console.log(error);
    }
}

// Custom validation for email
employeeSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

const employee=mongoose.model('employee', employeeSchema);
module.exports=employee;