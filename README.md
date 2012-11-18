# Stackato-Assist
## A utility library for easy assistance in getting your node app running on Stackato.

## Install

    npm install stackato-assist

or add to your package.json dependencies.

## Usage

    var stackato = require('stackato-assist');

    if(stackato.isStackato){

      // Basic App settings
      // ------------------

      // listen port
      stackato.port

      // instance id
      stackato.instance_id

      // application host IP
      stackato.host

      // sudo enabled
      stackato.sudo

      // Registered application URIs
      for(uri in stackato.app.uris){
        console.log(stackato.uris[uri]);
      }

      // User / Groups
      // --------------

      // Users who have access to this app
      for(user in stackato.app.users){
        console.log(stackato.users[user]);
      }

      // Group for this app
      stackato.app.group


## Services and database connection providers

Stackato-assist can easily provide database connections by only passing
in the service name you gave when creating the service, or as defined in
stackato.yml:

      // Database services
      // -----------------

      // true / false
      stackato.hasMongoDB
      stackato.hasRedis
      stackato.hasMySQL
      stackato.hasPostgreSQL

      // Get a service by name
      // ---------------------
      stackato.getService('myMongodb1', function(err, service){
          console.log(service.host);
          console.log(service.db);
          // ... //
      });

      // Persistent Filesystem service
      // -----------------------------
      stackato.hasFileSystem // true/false
      stackato.fileSystemPath // /path/to/fs

      // MongoDB connection helper
      // -------------------------
      stackato.connectMongoDB('serviceName', function(err, client){
          //client.collection(...)
      });

      // Redis connection helper
      // -------------------------
      stackato.connectRedis('serviceName', function(err, client){
          //client.set("string key", "string val", redis.print);
          // ...
      });
    }
