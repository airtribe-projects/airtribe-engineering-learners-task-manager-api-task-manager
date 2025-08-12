const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


const sendEmail = (options) => {
    return new Promise((resolve,reject) =>{
        transporter.sendMail(options, (err,info) => {
            if(err) return reject(err)
            resolve(info)
        })
    })
}

module.exports = {sendEmail}