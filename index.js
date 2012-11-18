var mongodb = require('mongodb');


function has (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}


var Stackato = function(opts){

    this.isStackato = (process.env.STACKATO_APP_NAME) ? true : false;

    // Application environment helpers
    this.port = (process.env.PORT) ? process.env.PORT : null;
    this.host = (process.env.VCAP_APP_HOST) ? process.env.VCAP_APP_HOST : null;

    if (process.env.VCAP_APPLICATION){
        this.app = JSON.parse(process.env.VCAP_APPLICATION);
        this.instance = JSON.parse(process.env.VMC_APP_INSTANCE);
        this.services = JSON.parse(process.env.VCAP_SERVICES);
    }

    if (this.instance){
        this.sudo = this.instance.sudo;
        this.instanceID = this.instance.instance_id;
        this.uris = this.instance.uris;
    }

    // Helpers for database services
    this.hasMongoDB = (process.env.MONGODB_URL) ? true : false;
    this.hasRedis = (process.env.REDIS_URL) ? true : false;
    this.hasMySQL = (process.env.MYSQL_URL) ? true : false;
    this.hasPostgreSQL = (process.env.POSTGRESQL_URL) ? true : false;
    if(process.env.STACKATO_FILESYSTEM) {
        this.hasFileSystem = true;
        this.fileSystemPath = process.env.STACKATO_FILESYSTEM;
    }

    if (process.env.STACKATO_SERVICES){

        this.services = JSON.parse(process.env.STACKATO_SERVICES);

        if(this.services){

            for(service in this.services){

                // If more than one of any database type
                // <db*>_URL env is unset
                if(service == 'mongodb') this.hasMongoDB = true;
                if(service == 'redis') this.hasRedis = true;
                if(service == 'mysql') this.hasMySQL = true;
                if(service == 'postgresql') this.hasPostgreSQL = true;
                if(service == 'filesystem') this.hasFileSystem = true;

            }
        }
    }

};

/* MongoDB connection helper

   Uses the native mongodb driver.

   @servicename = the user derived servicename specified in the stackato.yml
   @opts = mongodb connection parameters (optional)
   @cb = the callback function when a connection has been attempted
*/
Stackato.prototype.connectMongoDB = function(serviceName, opts, cb) {
    if(opts instanceof Function) {
        cb = opts;
        opts = {};
    }
    if(!cb){
        return new Error('Second argument must be callback function')
    }
    if(!serviceName){
        return cb(new Error('Service name not specified'));
    }
    if (has(this.services, serviceName)){
        var server = new mongodb.Server(this.services[serviceName].host, this.services[serviceName].port, opts);
        new mongodb.Db(this.services[serviceName].db, server, opts).open(function (error, client) {
            cb(error, client);
        });

    }else{
        cb(new Error('Cannot find a service named: ' + serviceName));
    }
};

module.exports = new Stackato()