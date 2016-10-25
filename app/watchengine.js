var Repeat = require('repeat');
var website = require('./models/website');
var settings = require ('./models/settings');
var screenshot = require('./screenshot.js');
var mailer = require('./mailer.js');
var http = require('http');
var URL = require('url-parse');
var pushbullet = require('./pushbullet');
var fs = require('fs');
var hiff = require('hiff');

var watching = {};

// This array contains the ids of the websites for which the user was already informed that its offline
var alreadyNotified = [];

exports.registerWatcher = function (id, interval) {


    // if ID not in "watching" array
        // call repeat function with checkonlineStatus for new id
        // add ID to "watching" array

    if(exports.inWatching(id)==false){    
        watching[id] = setInterval(checkOnlineStatus, 60000*interval, id);
        //Repeat(function(){return checkOnlineStatus(id); }).every(interval, 'minutes').until(function(){return exports.inWatching(id)==false}).start.now();
        
    }

}


 // removes site from watching Array
exports.deregisterWatcher =function (id) {

    clearInterval(watching[id]);
    // Delete the id from the watching array.
    delete watching[id];

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
   
    if(id in watching)
        return true;

    return false;
}





function checkOnlineStatus(id) {

    console.log("Checking id "+id);
  
    // Get url from DB

    website.findById(id, function(err, website) 
    {

      // Die Settings Abfrage muss leider nach oben, damit man auch checken kann ob Mails und Notifications bei Änderungen gesendet werden
      // sollen. Ein alreadyNotified braucht man hierbei aber nicht!
        settings.find({}, function(err, settingsArray){
            var settings = settingsArray[settingsArray.length-1]; // Get the last (and most recent) settings object.

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
                  if(res.statusCode == 200 || res.statusCode == 302) {
                    res.setEncoding('utf8');
                      var html = '';
                       res.on('data', (chunk) => {
                            html +=chunk;
                        });
                       
                       res.on('end', function () {

                        if(website.notifyChanges){
                            checkForChanges(id,html,settings,website);
                        }

                        website.content = html;   
                        website.isOnline = true;
                        website.last_checked = Date.now();
                        website.save();
                       });            
                       


                  }
                }).on('error', function(e) {
                    // Hier müsste noch gecheckt werden, ob nicht einfach das WLAN aus ist.
                  console.log("Got error: " + e.message);
                  website.isOnline = false;
                  website.last_checked = Date.now();
                  website.save();

                  // Send Pushbullet?

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

checkForChanges = function (id, newContent,settings,website){

    console.log("Checking for changes");
        var oldContent = website.content;
        var result = hiff.compare(oldContent, newContent);
        if (result.different) {
          result.changes.map(function(change) {
            website.hasChanged=true;
            website.save();
            if(settings.sendPushbullet){
                pushbullet.sendPush( website.name+" has changed", website.url +" has changed!: "+ change.message+" I last checked at "+website.last_checked,settings.pushbulletAPI);

            }
            if(settings.sendEmail) {

                mailer.sendEmail("Website "+website.name+" has changed", "The website with the url "+website.url+" has changed!", settings);

           
            }
          });
          return true;
        } else {
          return false;
        }

   


}



