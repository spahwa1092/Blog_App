const nodemailer = require("nodemailer");

const mailSender = async(email,title,body)=>{
    try{
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host:process.env.MAIL_HOST,
            auth:{
                user:'shubham1347.be21@chitkara.edu.in',
                pass:'Shubhampahwa@10',
            },
            secure:false
        })

        let info = await transporter.sendMail({
            from:'harsh1713.be21@chitkara.edu.in',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`,
        })

        console.log(info);
        return info;
    }
    catch(error){
        console.log(error.message);
    }
}

module.exports = mailSender;