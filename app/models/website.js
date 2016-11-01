
/**
*  This model is used to store all necessary data about watched websites.
*
**/

var mongoose = require('mongoose');

// define our website model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('website', {
    name : {type : String, default: ''},
   	url: {type: String, default: ''},
   	interval: {type: Number, default: 30},
   	last_checked: { type: Date, default: Date.now },
   	isOnline: {type: Boolean, default: true},
   	content: {type:String, default:''},
   	hasChanged: {type: Boolean, default:false},
   	notifyChanges: {type: Boolean, default: false},
   	ignore: {type:  [String], default: []}
   });