var Repeat = require('repeat');
var website = require('./models/website');
var settings = require ('./models/settings');
var screenshot = require('./screenshot.js');
var http = require('http');
var URL = require('url-parse');
var pushbullet = require('./pushbullet');

var watching = [];

// This array contains the ids of the websites for which the user was already informed that its offline
var alreadyNotified = [];

exports.registerWatcher = function (id, interval) {


    // if ID not in "watching" array
        // call repeat function with checkonlineStatus for new id
        // add ID to "watching" array

    if(exports.inWatching(id)==false){    
        Repeat(function(){return checkOnlineStatus(id); }).every(interval, 'minutes').until(function(){return exports.inWatching(id)==false}).start.now();
        watching.push(id);
    }

}


 // removes site from watching Array
exports.deregisterWatcher =function (id) {

    var index ;

    for (var i = 0; i<watching.length; i++) {
        if (id == watching[i]) {
            index = i;
        }
    }

    // Delete the id from the watching array.
    watching.splice(index,1);

    var filePath = "./public/media/screenshots/"+id+".png" ; 
    // Check if there is a file and then delete it
    fs.stat(filePath,function(err, stat){
        if(err) {
            return;
        }
        else if(stat.isFile()){
            fs.unlink(filePath);
        }
    });
   
   
}



// This function is called, when the server is started. All websites from the DB are registered again at the watcher.
exports.startWatchingAgain = function() {

  website.find({}).maxTime(2000).exec(function(err, websites) {

    if(err) {
        console.log (err);
        return;
    }

    for (var i=0 ; i<websites.length; i++) {
        exports.registerWatcher(websites[i]._id, websites[i].interval);

        // Make new Screenshots:

        screenshot.takeScreenshot(websites[i].url, websites[i]._id);
    }
  });

  return;

}


 // returns true if website is in watching array
exports.inWatching = function (id) {
   
    for (var i = 0; i<watching.length; i++) {
        if (id == watching[i]) {
            return true;
        }
    }
    return false;
}





function checkOnlineStatus( id) {
    
    // Get url from DB

    console.log("checking Online Status of "+ id);

    website.findById(id, function(err, website) 
    {

        if (err) {
            console.log("Probably DB Error!")
            console.log(err);
        }

           var url =  new URL(website.url);

           var options = {
              host: url.hostname,
              port: url.port,
              path: url.pathname
            };


            http.get(options, function(res) {
              console.log("Got response: " + res.statusCode);
              if(res.statusCode == 200 || res.statusCode == 302) {
                website.isOnline = true;
                website.last_checked = Date.now();
                website.save();
              }
            }).on('error', function(e) {
                // Hier müsste noch gecheckt werden, ob nicht einfach das WLAN aus ist.
              console.log("Got error: " + e.message);
              website.isOnline = false;
              website.last_checked = Date.now();
              website.save();

              // Send Pushbullet?

              settings.find({}, function(err, settingsArray){

                var settings = settingsArray[settingsArray.length-1];

                console.log(settings);

                if (err) {
                    console.log("DB Error:")
                    console.log(err);
                    return;
                }

                if(alreadyNotified.indexOf(id)<0) {
                    if(settings.sendPushbullet) {
                        pushbullet.sendPush( website.name+" is offline", website.url +" just went offline. I last checked at "+website.last_checked,settings.pushbulletAPI);
                    }

                    if(settings.sendEmail) {
                        mailer.sendEmail("Website "+website.name+" is offline", "The website with the url "+website.url+" appears to be offline!", settings);
                    }
                    alreadyNotified.push(id);
                }

              });

            });

    });

   

}



