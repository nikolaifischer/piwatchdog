var webshot = require('webshot');
var URL = require('url-parse');

var webshotOptions = {

renderDelay: 3000,

screenSize: {
    width: 1920
  , height: 1080
}
, shotSize: {
    width: 'window'
  , height: 'window'
}
, userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2228.0 Safari/537.36'

};


exports.takeScreenshot =  function (urlString, id) {

    var url = new URL (urlString);


    webshot(url.href, './public/media/screenshots/'+id+'.png', webshotOptions, function(err) {

        if (err) {
            //console.log(err);
            return;
        }
    });




}