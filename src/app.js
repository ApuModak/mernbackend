
require('./db/conn');
const express = require('express');
const path = require('path');
 const hbs = require('hbs');
 const bcrypt=require('bcryptjs');
 const cookieParser=require('cookie-parser');
 const auth=require('./middleware/auth');
const Register=require('./models/register');
const AdminRegister=require('./models/AdminReg');
const port=process.env.PORT || 3000;

// all path setting

const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partial_path=path.join(__dirname,"../templates/partials");
// all app
var app = express();
app.use(express.static(static_path));
app.use(express.urlencoded({
   extended: false
}));
app.use(express.json());

app.use(cookieParser());

app.set("view engine", "hbs");
app.set("views",template_path );
hbs.registerPartials(partial_path);

//all appGet



app.get('/',async (req,res) => {

  var n= await Register.find().sort({rating:+1}).limit(1);
   var m=await AdminRegister.find({pin:n[0].pinno});
  var v=[];
          v[1]=await Register.find({pinno:n[0].pinno}).countDocuments();
            v[2]=await Register.find({$and:[{pinno:n[0].pinno},{home:"Kachha"}]}).countDocuments();
            v[3]=await Register.find({$and:[{pinno:n[0].pinno},{home:"Pukka"}]}).countDocuments();
           v[4]=await Register.find({$and:[{pinno:n[0].pinno},{family:"One"}]}).countDocuments();
            v[5]=await Register.find({$and:[{pinno:n[0].pinno},{family:"Two"}]}).countDocuments();
            v[6]=await Register.find({$and:[{pinno:n[0].pinno},{family:"Above Two"}]}).countDocuments();
           v[7]=await Register.find({$and:[{pinno:n[0].pinno},{hospital:"hyes"}]}).countDocuments();
          v[8]=await Register.find({$and:[{pinno:n[0].pinno},{hospital:"hno"}]}).countDocuments();
           v[9]=await Register.find({$and:[{pinno:n[0].pinno},{medical:"myes"}]}).countDocuments();
           v[10]=await Register.find({$and:[{pinno:n[0].pinno},{medical:"mno"}]}).countDocuments();
        v[11]=await Register.find({$and:[{pinno:n[0].pinno},{facility:"fyes"}]}).countDocuments();
            v[12]=await Register.find({$and:[{pinno:[0].pinno},{facility:"fno"}]}).countDocuments();
            v[13]=await Register.find({$and:[{pinno:n[0].pinno},{employee:"eyes"}]}).countDocuments();
            v[14]=await Register.find({$and:[{pinno:n[0].pinno},{employee:"eno"}]}).countDocuments();
           var u=[];
           for(var i=2; i<=14;i++)
              { u[i]=(v[i]/v[1])*5;
              }
  
    res.render("index",{rating: u,name:m[0].Name});
});
app.get('/register', (req,res) => {
  res.render("register");
});

app.get('/AdminReg', (req,res) => {
  res.render("AdminReg");
});
app.get('/Adminlogin', (req,res) => {
  res.render("Adminlogin");
});
app.get('/login',async (req, res)=>{
  res.render("login");
 });
app.get("/logout",auth,async(req , res) =>
{
  try{
  res.clearCookie("jwt");
  res.render("index");
  console.log("logout successfully");
  }
  catch(error)
  {
    res.status(500).send(error);
  }
});

 app.get('/BDO',async (req, res)=>{
  res.render("survey");
 
 });

 app.get('/knowplace',async (req, res)=>{
  res.render("knowplace");
 
 });
 app.get('/knowBdo',async (req, res)=>{
  res.render("knowBdo");
 
 });

 //all post method

 app.post('/BDO', auth ,async (req, res)=>{
   try
 {  var user=await AdminRegister.find({$and:[{pin:req.body.pin},{"type":"BDO"}]});
  //console.log(employee[0].head);
  res.render('BDO', {records : user[0]});}
  catch(error)
 {res.status(400).send("invalid")}
});



//user registration



app.post("/register", async (req,res) => {

  try{
      
         const user=new Register ({
      name:req.body.name,
      adhar:req.body.adhar,
      fathername:req.body.fathername,
      mothername:req.body.mothername,
      Distric:req.body.Distric,
      block:req.body.block,
      village:req.body.village,
      pinno:req.body.pinno,
      Bdopin:req.body.Bdopin,
      quali:req.body.quali,
      skill:req.body.skill,
      email:req.body.email,
      mobile:req.body.mobile,
      password:req.body.password,
      home:req.body.home,
      family:req.body.family,
      answer:req.body.answer,
      hospital:req.body.hospital,
      medical:req.body.medical,
      facility:req.body.facility,
      employee:req.body.employee,
      rating:0
         });

         const token=await user.generateAuthToken();
        
         res.cookie("jwt",token,{
           expires: new Date(Date.now()+30000),
           httpOnly: true
         });
         const register=await user.save();
         var employee=await AdminRegister.find({pin:req.body.pinno});
         res.status(201).render('survey', {records : employee[0]});
      }
     
    
 
   catch(err)
   {
     console.log(err);
   }
});


// user login



app.post('/login',async (req, res)=>{
 
 try{    
       const adhar=req.body.adhar;
       const password=req.body.password;
       var useradhar=await Register.find({adhar:adhar});

      const isMatch=bcrypt.compare(password,useradhar[0].password);

        const token=await useradhar[0].generateAuthToken();
        
        res.cookie("jwt",token,{
          expires: new Date(Date.now()+30000),
          httpOnly: true
        });
       
    if(  isMatch)   
        { 
          
          var user=await AdminRegister.find({$and:[{pin:useradhar[0].Bdopin},{"type":"BDO"}]});
          var employee=await AdminRegister.find({$and:[{pin:useradhar[0].pinno},{"type":"Gram"}]});
          if(useradhar[0].pinno )
           res.status(201).render('survey', {records : employee[0],pinBdo:user[0]});
          else
          res.status(201).render('Gram', {records : employee[0],pinBdo:user[0]});
       }
    else
      {
        res.send("wrong password");
      }
 
 }
 catch(error)
 {res.status(400).send("invalid")}
});



// Admin  registration



app.post('/AdminReg',async (req, res)=>{
  try{
      const password=req.body.password;
      const repassword=req.body.Repassword;
      if(password == repassword)
      {  
         
         const ReAdmin=new AdminRegister ({
          Name:req.body.name,
          pin:req.body.pin,
          pass:req.body.password,
          repass:req.body.Repassword,
          type:req.body.type,
          head:"office",
          member1:"no",
          rating:0
         });
         const token=await ReAdmin.generateToken();
        
         res.cookie("jwt",token,{
           expires: new Date(Date.now()+20000),
           httpOnly: true
         });
         
         const register=await ReAdmin.save();
         console.log("hello");
         res.status(201).render("index");
      }
      else
      {
        res.send("password are not matching");
      }
      
   }
 
   catch(err)
   {
     console.log(err);
   }
  });



  //Admin login




  app.post('/Adminlogin',async (req, res)=>{
 
    try{ 
          const pin=req.body.pin;
          const pass=req.body.pass;
          const type=req.body.type;
          var admin=await AdminRegister.find({$and:[{pin:pin},{type:type}]});
           //console.log(useradhar[0].password);
           const isMatch=bcrypt.compare(pass,admin[0].pass);
           const token=await admin[0].generateToken();
        
         res.cookie("jwt",token,{
           expires: new Date(Date.now()+30000),
           httpOnly: true
         });
   if( isMatch)
     { if(type=="Gram")
      res.status(201).render("AdminUpdate",{records : admin[0]}); 
    else
      if(type=="BDO")
      res.status(201).render("AdminBDOupdate",{records : admin[0]});
      else
      res.send(" not matching");}
   // console.log("update");
  }

  catch(err)
  {
    console.log(err);
  }
    
});


// admin update



app.post('/AdminUpdate',async (req, res)=>{
 
  try{ 
 var employee=await AdminRegister.updateOne({pin:req.body.pin},{
  $set : {
        head:req.body.conf,
        member1:req.body.conf1
        }
  });
  res.status(201).render("AdminUpdate"); 
  console.log("update");
}

catch(err)
{
  console.log(err);
}
  
});

app.post('/AdminBDOupdate',async (req, res)=>{
 
  try{ 
 var employee=await AdminRegister.updateOne({pin:req.body.pin},{
  $set : {
        head:req.body.conf,
        member1:req.body.conf1
        }
  });
  res.status(201).render("AdminBDOupdate"); 
  console.log("update");
}

catch(err)
{
  console.log(err);
}
  
});


//know place



app.post('/knowplace',async (req, res)=>{
 
  try{ 
        const pin=req.body.gram;
          var v=[];
            v[1]=await Register.find({pinno:pin}).countDocuments();
            v[2]=await Register.find({$and:[{pinno:pin},{home:"Kachha"}]}).countDocuments();
            v[3]=await Register.find({$and:[{pinno:pin},{home:"Pukka"}]}).countDocuments();
           v[4]=await Register.find({$and:[{pinno:pin},{family:"One"}]}).countDocuments();
            v[5]=await Register.find({$and:[{pinno:pin},{family:"Two"}]}).countDocuments();
            v[6]=await Register.find({$and:[{pinno:pin},{family:"Above Two"}]}).countDocuments();
           v[7]=await Register.find({$and:[{pinno:pin},{hospital:"hyes"}]}).countDocuments();
          v[8]=await Register.find({$and:[{pinno:pin},{hospital:"hno"}]}).countDocuments();
           v[9]=await Register.find({$and:[{pinno:pin},{medical:"myes"}]}).countDocuments();
           v[10]=await Register.find({$and:[{pinno:pin},{medical:"mno"}]}).countDocuments();
        v[11]=await Register.find({$and:[{pinno:pin},{facility:"fyes"}]}).countDocuments();
            v[12]=await Register.find({$and:[{pinno:pin},{facility:"fno"}]}).countDocuments();
            v[13]=await Register.find({$and:[{pinno:pin},{employee:"eyes"}]}).countDocuments();
            v14=await Register.find({$and:[{pinno:pin},{employee:"eno"}]}).countDocuments();
           var user2=await AdminRegister.find({pin:pin});
           var u=[],sum=0,sum2=0;
           for(var i=2; i<14;i++)
              { u[i]=(v[i]/v[1])*5;
                sum+=u[i];
               console.log(v[i])};
               sum2=sum/12;

               var admin=await Register.updateOne({pin:pin},{
                $set : {
                      rating:sum2 
                      }
                });
          

           
           res.status(201).render('rating', {rating: u , total: v ,name:user2[0].Name});

          
  
  }
  catch(error)
  {res.status(400).send("invalid")}
 });


 app.post('/knowBdo',async (req, res)=>{
 
  try{  console.log("helo");
        const pin=req.body.gram;
           var user2=await AdminRegister.find({pin:pin});
           res.status(201).render('knowBdo', {user:user2[0]});

  }
  catch(error)
  {res.status(400).send("invalid")}
 });





   
app.listen(3000, () => {
    console.log(`Express server started at port ${port}`);
});



//app.use('/employee', employeeController);

 