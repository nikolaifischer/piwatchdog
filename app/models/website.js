
// grab the mongoose module
var mongoose = require('mongoose');

// define our website model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('website', {
    name : {type : String, default: ''},
   	url: {type: String, default: ''},
   	interval: {type: Number, default: 30},
   	last_checked: { type: Date, default: Date.now },
   	isOnline: {type: Boolean, default: true}
});