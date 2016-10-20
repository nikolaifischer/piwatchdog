/**
*  This model is used to store the settings.
*
**/

var mongoose = require('mongoose');

module.exports = mongoose.model('settings', {
      pushbulletAPI : {type : String, default: ''},
   	email: {type: String, default: ''},		// Receiver of the e-mail
   	smtp_host: {type: String, default: ''},
   	smtp_user: {type: String, default: ''},
   	smtp_pass: {type: String, default: ''},
   	smtp_port: {type: Number, default: 25},
   	smtp_ssl: {type: Boolean, default: true},
   	sendPushbullet: {type: Boolean, default: false},
   	sendEmail: { type: Boolean, default: false }
});