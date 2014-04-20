# BlueMix Demo Apps

Some demo apps to get started with [IBM BlueMix](http://www.bluemix.net):

* Chat App
* Chat Log Viewer



## Context Information for Applications

Applications need to retrieve certain context information from environment variables. Two prominent examples are:

* `VCAP_APP_PORT` (integer) to get the port where the application should listen
* `VCAP_SERVICES` (JSON object string) to get access information for services used by the application such as a database service

Please find below a simple code snippet to be used for applications based on node.js:

    // Get port
    var port = process.env.VCAP_APP_PORT;

    // Get credentials to access mongo database service
    var services = JSON.parse(process.env.VCAP_SERVICES);
    var mongoCred = services['mongodb-2.2'][0].credentials;
    var mongoAddress = mongoCred.url;



## Deploy Chat App

Simple chat application based on node.js that logs all conversations in a mongo database.

First, create a BlueMix account at http://www.bluemix.net. Second, [install the `cf` command-line tool and connect it to BlueMix](http://www.ng.bluemix.net/docs/BuildingWeb.jsp#install-cf) using your BlueMix account. Then, run the following commands:

    git clone https://github.com/jojow/bluemix-demo-apps.git
    cd bluemix-demo-apps/chat
    cf push mychatapp -c 'node server.js'

Of course, you can use a different name for your application instead of "mychatapp". Now, use the `cf create-service SERVICE PLAN SERVICE_NAME` command to create a mongo database service:

    cf create-service mongodb 100 chatlogdb

Use the `cf bind-service APP_NAME SERVICE_NAME` command to bind the service to the application:

    cf bind-service mychatapp chatlogdb

Restart the application to refresh all environment variables for the application. This enables the application to connect to the database:

    cf restart mychatapp

Go to http://mychatapp.ng.bluemix.net to access the chat application. :-)



## Deploy Chat Log Viewer

Simple mongo database viewer based on mongo-express to view the chat logs produced by the chat application.

Similar to the deployment of the chat application, run the following commands to deploy the chat log viewer and connect it to the same mongo database:

    cd ../chatlog-viewer
    cf push mychatlogs -c 'node app.js'
    cf bind-service mychatlogs chatlogdb
    cf restart mychatlogs

Go to http://mychatlogs.ng.bluemix.net to access the chat logs. :-)



## Node.js Hackathon Starter

As a starting point to create your own node.js application we recommend to check out [Node.js Hackathon Starter](https://github.com/sahat/hackathon-starter). Have fun!
