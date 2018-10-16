# Pi Watchdog
Pi Watchdog monitors the status and content of websites for you. This web app is specifically built to run on a Raspberry Pi, providing a cost-efficient and self-hosted monitoring solution.
![Screenshot](https://i.imgur.com/659kQdW.png)

## Features
* **Online Status Monitoring:** <br />
Monitor your websites with Pi Watchdog: Receive a push notification or E-Mail when one of your projects goes offline.
* **Content Monitoring:** <br />
 Waiting for a website's content to be updated? Pi Watchdog can monitor a website and notify you when the content changes.
 
<img src="https://i.imgur.com/rPKNOW2.png" alt="Screenshot of Edit Window" width="300" align="center"/>

# Install on Raspberry Pi (Raspbian)
The preferred way to run Pi Watchdog on a Raspberry Pi is to use Docker. This will help you to install all necessary requirements.
## Get Docker
    curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh
## Download and start Docker Image


# Install on Windows/Mac
Follow these instructions if you want to use (or test) Pi Watchdog on a Windows or Mac.
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

<img src="https://i.imgur.com/zOIDnGo.png" alt="notification" width="200"/>

Pi Watchdog can send notifications to your phone or browser if a monitored website goes offline or if the content of a monitored website changes. To enable this features you will need a (free) Pushbullet account.
* Create an account at pushbullet.com
* Install the pushbullet browser extension and/or mobile App
* Navigate to Settings: https://www.pushbullet.com/#settings
* Click **Create Access Token** 
* Copy your Access Token
* Open the Settings in Pi Watchdog
* Activate **Send Pushbullet Notification** and paste your Access Token
## E-Mail Notifications
In order for Pi Watchdog to send E-Mails, you will have to provide the SMTP Details for your Mail account in the Pi Watchdog Settings. You can get these at your E-Mail provider. If you are using gmail, please follow these [instructions](https://www.lifewire.com/what-are-the-gmail-smtp-settings-1170854).
<br>
<br>
![Settings](https://i.imgur.com/y4ytzC4.png)
## Ignore Elements
When monitoring a website for changes, you can tell Pi Watchdog to ignore certain elements. This can be useful if the monitored page, e.g., has a timestamp which changes every minute. <br>
To ignore an element, add one or more CSS selectors (separated by commas) to the **Ignore Elements** option of the webpage:


