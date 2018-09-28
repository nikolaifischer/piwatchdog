FROM mongo:3.2-jessie
# Requirements for running mongo, phantomJS and piwatchdog
RUN apt-get update && apt-get install -y \
    git \
    mongodb-org \
    curl \
    libfreetype6 \
    libfreetype6-dev \
    libfontconfig1 \
    libfontconfig1-dev
# Get debian-supported nodeJS package
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs \
    build-essential
RUN mkdir --parents /data/db/
WORKDIR /var/www
RUN git clone https://github.com/nikolaifischer/piwatchdog.git
RUN chmod -R 700 piwatchdog
WORKDIR /var/www/piwatchdog
RUN npm install 
RUN npm install -g bower
RUN bower install --allow-root
RUN npm install -g forever
# Start Mongo and Watchdog
CMD mongod --fork --logpath /var/log/mongodb.log && node server.js
    