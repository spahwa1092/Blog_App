const mongoose = require("mongoose");
const Mail = require("nodemailer/lib/mailer");
const mailSender = require("../utils/mailSender");
const emailTemplate= require("../template/emailVerification");

const OTPSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});



async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification Email for blogApp ", emailTemplate(otp));
        console.log("Email sent Successfully: ", mailResponse);
    }
    catch(error){
        console.log("error occured while sending mails ", error);
        throw error;
    }
}


OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPSchema);