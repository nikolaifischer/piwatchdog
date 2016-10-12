
// grab the mongoose module
var mongoose = require('mongoose');

// define our settings model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('settings', {
    pushbulletAPI : {type : String, default: ''},
   	email: {type: String, default: ''},
   	smtp_host: {type: String, default: ''},
   	smtp_user: {type: String, default: ''},
   	smtp_pass: {type: String, default: ''},
   	smtp_port: {type: Number, default: 25},
   	smtp_ssl: {type: Boolean, default: true},
   	sendPushbullet: {type: Boolean, default: false},
   	sendEmail: { type: Boolean, default: false }
});