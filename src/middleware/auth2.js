const jwt2=require('jsonwebtoken');
const Register=require('../models/AdminReg');

const auth2= async (req, res , next) =>
{
    try{
        const token=req.cookies.jwt2;
        const verifyuser=jwt2.verify(token,"mynameissantumodakiwanttodosomething");
        const user=await  Register.findOne({_id:verifyuser._id})

        req.token=token;
        req.user=user;
        next();
    }
    catch(error)
    {
        res.status(401).send(error);
    }
}

module.exports=auth2;