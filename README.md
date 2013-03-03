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
      stackato.instanceID

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

      // Harbor external port service
      // ----------------------------
      stackato.hasHarbor // true/false
      stackato.harborPort // port #

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

      // PostgreSQL connection helper
      // -------------------------
      if(stackato.hasPostgreSQL){
        stackato.connectPostgreSQL('x3p', function(err, client, pg){
          client.query("SELECT NOW() as when", function(err, result) {
            console.log("Row count: %d",result.rows.length);  // 1
            console.log("Current year: %d", result.rows[0].when.getFullYear());

            pg.connect(function(err, clientTwo){
              // clientTwo.query(...) a new client object using connection params already set
              // by stackato-assist
            });

            //pg.end(); //terminate the client pool, disconnecting all clients
          });
        });
      }

      // MySQL connection helper
      // -------------------------
      if(stackato.hasMySQL){
        stackato.connectMySQL('x4m', function(err, conn){
          connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
            if (err) throw err;
             console.log('The solution is: ', rows[0].solution);
          });
          // connection.end();
        });
      }
