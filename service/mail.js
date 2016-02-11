var config = require('../config.json');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mail = module.exports;

mail.smtpTransport = nodemailer.createTransport(smtpTransport({
    service: config.serviceMail,
    auth: {
        user: config.userMail,
        pass: config.passwordMail
    }
}));

mail.sendMail = function(to, subject, message) {
    var mailOptions = {
        from: config.fromMail,
        to: to,
        subject: subject,
        text: message
    };

    mail.smtpTransport.sendMail(mailOptions, function(error, response){
        if(error) {
            console.log(error);
        }
    });
};
