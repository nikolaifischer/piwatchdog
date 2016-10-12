
var mongoose = require('mongoose');
var website = require('./models/website');
var settings = require('./models/settings');
var http = require('http');
var URL = require('url-parse');
var Repeat = require('repeat');
var fs = require('fs');

var mailer = require('./mailer');
var screenshot = require ('./screenshot');
var pushbullet = require('./pushbullet');


var watching = [];



mongoose.connect('mongodb://localhost/piwatchdog');


// This array contains the ids of the websites for which the user was already informed that its offline
var alreadyNotified = [];


module.exports = function(app) {

    startWatchingAgain();

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route

    app.get('/api/websites', function(req, res) {
        
        // use mongoose to get all websites in the database
        website.find({}).maxTime(1000).exec(function(err, websites) {
            

            // if there is an error retrieving, send the error. 
            // nothing after res.send(err) will execute

            if (err)
            {
                res.send(err);
                console.log(err);
            }
            res.json(websites); // return all websites in JSON format
        });
    });


    app.post('/api/websites', function(req, res) {
          console.log(req.body);
          var name = req.body.name;
          var url = req.body.url;
          var interval = parseInt(req.body.interval);
          var newSite = new website ();
          newSite.name = name;
          newSite.url = url;
          newSite.interval = interval;

          newSite.save(function(err){
            if (err) {
                res.send(err);
            }

            res.json({ message: 'Site has been added!', data: newSite });

            registerWatcher(newSite.id,newSite.interval);
            screenshot.takeScreenshot(newSite.url, newSite.id);

          });


    });

    app.delete('/api/websites/:id', function(req, res) {
        console.log("Deleting in DB the website with the id " +req.params.id);
        deregisterWatcher(req.params.id);
        website.findByIdAndRemove(req.params.id, function(err) {
            if (err)
              res.send(err);
            res.json({ message: 'Website removed' });
         });

    });


    app.put('/api/websites/:id',function(req, res) {
   
         console.log("Updating in DB the website with the id " +req.params.id);
      website.findById(req.params.id, function(err, website) {
        if (err)
          res.send(err);

        deregisterWatcher(website.id);
        website.name = req.body.name;
        website.interval = req.body.interval;
        website.url = req.body.url;
        //website.last_checked = req.body.last_checked;

        
        website.save(function(err,website){
             registerWatcher(website.id, website.interval);
             screenshot.takeScreenshot(website.url, website.id);

        });
       

       res.json(website);
      });
    });


    app.post('/api/check', function(req, res) {


        var url = new URL(req.body.url);       

        var options = {
                      host: url.hostname,
                      port: url.port,
                      path: url.pathname
                    };

                    http.get(options, function(res) {

                    }).on('error', function(e) {
                      console.log("Got error: " + e.message);
                    });

    });



    app.get('/api/settings', function(req, res) {
        
        // use mongoose to get all websites in the database
        settings.find({}).maxTime(1000).exec(function(err, settings) {
            

            // if there is an error retrieving, send the error. 
            // nothing after res.send(err) will execute

            if (err)
            {
                res.send(err);
                console.log(err);
            }
            res.json(settings); // return all websites in JSON format
        });
    });


    app.post('/api/settings', function(req, res) {


        settings.find({}, function(err, response){

          var newSettings = response[0];
          newSettings.pushbulletAPI = req.body.pushbulletAPI;
          newSettings.email = req.body.email;
          newSettings.sendPushbullet = req.body.sendPushbullet;
          newSettings.sendEmail = req.body.sendEmail;
          newSettings.smtp_ssl = req.body.smtp_ssl;
          newSettings.smtp_user = req.body.smtp_user;
          newSettings.smtp_pass = req.body.smtp_pass;
          newSettings.smtp_host = req.body.smtp_host;
          newSettings.smtp_port = req.body.smtp_port;


          newSettings.save(function(err){
            if (err) {
                res.send(err);
            }

            res.json({ message: 'Settings have been updated', data: newSettings });
          });


        });



    });



    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });



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



    function registerWatcher(id, interval) {

        console.log("Register Watcher for "+ id);

        // if ID not in "watching" array
            // call repeat function with checkonlineStatus for new id
            // add ID to "watching" array

        if(inWatching(id)==false){    
            Repeat(function(){return checkOnlineStatus(id); }).every(interval, 'minutes').until(function(){return inWatching(id)==false}).start.now();
            watching.push(id);
        }

    }


     // removes site from watching Array
    function deregisterWatcher (id) {

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
    function startWatchingAgain() {

      website.find({}).maxTime(2000).exec(function(err, websites) {

        if(err) {
            console.log (err);
            return;
        }

        for (var i=0 ; i<websites.length; i++) {
            registerWatcher(websites[i]._id, websites[i].interval);

            // Make new Screenshots:

            screenshot.takeScreenshot(websites[i].url, websites[i]._id);
        }
      });

      return;

    }




    
     // returns true if website is in watching array
    function inWatching (id) {
       
        for (var i = 0; i<watching.length; i++) {
            if (id == watching[i]) {
                return true;
            }
        }
        return false;
    }





};

