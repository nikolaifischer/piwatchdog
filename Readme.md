# Pi Watchdog
Description and Purpose

## Features
* Pushbullet Support: <br />
Receive Push Notifications via your Phone or your Browser
* E-Mail Support: <br />
 Pi Watchdog can send you an E-Mail the moment a monitored website changes or goes offline 

# Install on Raspberry Pi (Raspbian)
The preferred way to run Pi Watchdog on a Raspberry Pi is to use Docker. This will help you to install all necessary requirements.
## Get Docker
    curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh
## Download and start Docker Image


# Install on Windows/Mac
Follow these instructions if you want to use Pi Watchdog on a 
## Prerequisites
### Node JS
[Install NodeJS](https://nodejs.org/)
### Mongo DB running on port 27017
[Install MongoDB](https://www.mongodb.com/download-center?initial=true#community)
## Clone Repository
    git clone https://github.com/nikolaifischer/piwatchdog.git
## Install Dependencies and Start
    cd piwatchdog && npm install && bower install
    node server.js

# Getting Started
Start using Pi Watchdog by navigating to localhost:8080 in your browser. You can start to monitor websites by pressing the **+** button. Pi Watchdog notifies you when a monitored websites is no longer available (404 or 500 codes). If you additionally also want to get notified if the content (e.g. text) of the webpage changes, you can activate the **Notify me when content changes** option.
<br>
<br>
You can choose if you want to get notified via Pushbullet notifications or E-Mails. To set up these methods please read the text below:
## Pushbullet Notifications
Pi Watchdog can send you notifications if a monitored website goes offline or if the content of a monitored website changes. To enable this features you will need a (free) Pushbullet account.
* Create an account at pushbullet.com
* Navigate to Settings: https://www.pushbullet.com/#settings
* Click **Create Access Token** 
* Copy your Access Token
* Open the Settings in Pi Watchdog
* Activate **Send Pushbullet Notification** and paste your Access Token
## E-Mail Notifications
In order for Pi Watchdog to send E-Mails, you will have to provide the SMTP Details for your Mail account in the Pi Watchdog Settings. You can get these at your E-Mail provider. If you are using gmail, please follow these [instructions](https://www.lifewire.com/what-are-the-gmail-smtp-settings-1170854).
## Ignore Elements
When monitoring a website for changes, you can tell Pi Watchdog to ignore certain elements. This can be useful if the monitored page, e.g., has a timestamp which changes every minute. <br>
To ignore an element, add one or more CSS selectors (separated by commas) to the **Ignore Elements** option of the webpage:


