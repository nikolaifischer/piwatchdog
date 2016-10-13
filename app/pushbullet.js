/**
* This file encapsulates all notificatoin sending functionality using Pushbullet.
* To use this, an account at http://www.pushbullet.com is needed.
*/  

var PushBullet = require('pushbullet');

exports.sendPush =  function (title, body, api){

        var pusher = new PushBullet(api);
        pusher.note({}, title, body, function(error, response) {

            if (error) {
                console.log(error);
                console.log ("Make sure, you provided a correct Pushbullet Access Token in the settings!")
            }

        });


}
