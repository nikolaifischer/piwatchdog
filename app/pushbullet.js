var PushBullet = require('pushbullet');

exports.sendPush =  function (title, body, api){

        console.log("Trying to send Push");
        console.log(title+" "+body+" "+api);


        var pusher = new PushBullet(api);
        pusher.note({}, title, body, function(error, response) {

            if (error) {
                console.log(error);
                console.log ("Make sure, you provided a correct Pushbullet Access Token in the settings!")
            }

        });


}
