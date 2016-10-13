
/**
* This file encapsulates all email-sending functionality using nodemailer.
*
*/  
exports.sendEmail = function (subject, text, settings) {

    var nodemailer = require('nodemailer');


    var smtpConfig = {
        host: settings.smtp_host,
        port: settings.smtp_port,
        secure: settings.smtp_ssl, // use SSL 
        auth: {
            user: settings.smtp_user,
            pass: settings.smtp_pass
        }
    };


    // create reusable transporter object using the default SMTP transport 
    var transporter = nodemailer.createTransport(smtpConfig);
     
    // setup e-mail data with unicode symbols 
    var mailOptions = {
        from: '"Pi Watchdog" <watchdog@finallybinary.com>', // sender address 
        to: settings.email, // list of receivers 
        subject: subject, // Subject line 
        text: text // plaintext body 
        //html: '<b>Oh no! Your Website finallybinary.com seems to be offline</b>' // html body 
    };
     
    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });



    }