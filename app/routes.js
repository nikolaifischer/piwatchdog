/**
* This file defines the API Routes. Helper Methods, which are doing the actual work are called from here.
*
*/


// Dependencies
var http = require('http');
var URL = require('url-parse');
var fs = require('fs');
var mongoose = require('mongoose');

// Models
var website = require('./models/website');
var settings = require('./models/settings');

// Helpers
var mailer = require('./mailer');
var screenshot = require ('./screenshot');
var pushbullet = require('./pushbullet');
var watchengine = require ('./watchengine');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/piwatchdog');

// Restarts the watchers after a server restart
watchengine.startWatchingAgain();


module.exports = function(app) {

    app.get('/api/websites', function(req, res) {
        website.find({}).maxTime(1000).exec(function(err, websites) {
            
            if (err)
            {
                res.send(err);
                console.log(err);
            }
            res.json(websites); 
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

            watchengine.registerWatcher(newSite.id,newSite.interval);
            screenshot.takeScreenshot(newSite.url, newSite.id);

          });


    });

    app.delete('/api/websites/:id', function(req, res) {
        console.log("Deleting in DB the website with the id " +req.params.id);
        watchengine.deregisterWatcher(req.params.id);
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

        watchengine.deregisterWatcher(website.id);
        website.name = req.body.name;
        website.interval = req.body.interval;
        website.url = req.body.url;
        
        website.save(function(err,website){
             watchengine.registerWatcher(website.id, website.interval);
             screenshot.takeScreenshot(website.url, website.id);

        });
       

       res.json(website);
      });
    });


    // This is not used yet but could come in handy.
    app.post('/api/check', function(req, res) {


        var url = new URL(req.body.url);       

        var options = {
                      host: url.hostname,
                      port: url.port,
                      path: url.pathname
                    };

                    http.get(options, function(res) {
                      // Website is reachable
                      // Do something with the result

                    }).on('error', function(e) {
                      console.log("Got error: " + e.message);
                    });

    });



    app.get('/api/settings', function(req, res) {
        
        // use mongoose to get all websites in the database
        settings.find({}).maxTime(1000).exec(function(err, settings) {


            if (err)
            {
                res.send(err);
                return;
            }
            res.json(settings); // return all websites in JSON format
        });
    });


    app.post('/api/settings', function(req, res) {

        settings.find({}, function(err, response){

          var newSettings;
          // Overwrite settings object, if there already is one
          if (response.length>0)
             newSettings = response[0];
          else
            newSettings = new settings();
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


};

