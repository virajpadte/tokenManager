# Token Manager #
---------------
[![forthebadge](https://forthebadge.com/images/badges/uses-js.svg)](http://forthebadge.com) [![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)

This node application serves as a backend to provides a valid access
token for a Sierra Wireless AirVantage account.

The service will restart automatically if it is killed or in an event of server
reboot (but not if issued a `service <...> stop`).

To check the status of the service:

`service tokenManager status`


Please modify the configuration parameters in the config.js file to match the airvantage account credentials:
~~~
module.exports = {
  'port': 5001,
  'grant_type': 'password',
  'accessTokenUrl': "https://na.airvantage.net/api/oauth/token",
  'username': "<airvantage username>",
  'password': "<airvantage account password>",
  'client_id': "<airvantage api client_id>",
  'client_secret':  "<airvantage api client_secret>"
};
~~~

Note: If you don't have an airvantage api client setup for your account, please refer the **Create an API Client** section in  https://doc.airvantage.net/av/howto/cloud/gettingstarted_api/


## Setup instructions after cloning the repo##
---------------

#### Install node.js ####
~~~~
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
~~~~
#### Install node package dependencies ####
~~~
sudo mv tokenManager /var/www  
cd /var/www/tokenManager/
npm install
~~~
#### Configuring the service ####
The following parameters in the tokenManager.service must be configured to work with the existing server configuration:
* User
* Group
* RestartSec  - to change delay between successive restarts.

#### Create a Systemd service for the node application ####
~~~
sudo mv tokenManager.service /etc/systemd/system/
cd /etc/systemd/system
service tokenManager start //starts the service
service tokenManager status //check service status
service tokenManager stop //stops the service
~~~

Expected response to the status query:
``` bash
tokenManager.service - Manages Access tokens for the Sierra Wireless Airvantage Cloud Syst
   Loaded: loaded (/etc/systemd/system/tokenManager.service; enabled; vendor preset: enabled
   Active: active (running) since Fri 2017-12-01 10:50:33 MST; 12s ago
 Main PID: 8954 (node)
   CGroup: /system.slice/tokenManager.service
           └─8954 /usr/bin/node /var/www/tokenManager/app.js

Dec 01 10:50:33 jarvis systemd[1]: Started Manages Access tokens for the Sierra Wireless Airvantage Cloud Syst
Dec 01 10:50:34 jarvis tokenManager[8954]: Token Manager is serving on port 5001
```
#### Additional features which can be implemented ####
* logging each request and response - check morgan npm package
* Application logging  - check winston npm package

##### Keep contributing to Open Source
लोकाः समस्ताः सुखिनोभवंतु
