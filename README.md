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
      /---------------

      // Users who have access to this app
      for(user in stackato.app.users){
        console.log(stackato.users[user]);
      }

      // Group for this app
      stackato.app.group

      // Database services
      //------------------

      // true / false
      stackato.hasMongoDB
      stackato.hasRedis
      stackato.hasMySQL
      stackato.hasPostgreSQL

      // Persistent Filesystem service
      stackato.hasFileSystem // true/false
      stackato.fileSystemPath // /path/to/fs



    }
