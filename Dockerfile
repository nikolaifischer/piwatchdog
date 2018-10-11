FROM andresvidal/rpi3-mongodb3
# Requirements for running phantomJS and piwatchdog
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libfreetype6 \
    libfreetype6-dev \
    libfontconfig1 \
    libfontconfig1-dev \
    libicu-dev \
    libicu57
# Clone piwatchdog from git
WORKDIR /var/www
RUN git clone https://github.com/nikolaifischer/piwatchdog.git
RUN chmod -R 700 piwatchdog
# Download and add prebuilt executable phantomJS to path
WORKDIR /var/www/piwatchdog
ADD https://github.com/piksel/phantomjs-raspberrypi/raw/master/bin/phantomjs /var/www/piwatchdog/phantomjs
RUN chmod +777 phantomjs
ENV PATH="/var/www/piwatchdog:${PATH}"
# Get debian-supported nodeJS package
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs \
    build-essential
RUN mkdir --parents /data/db/
WORKDIR /var/www/piwatchdog
RUN npm install 
RUN npm install -g bower
RUN bower install --allow-root
# Start Mongo and Watchdog
CMD mongod --fork --logpath /var/log/mongodb.log &&  node server.js