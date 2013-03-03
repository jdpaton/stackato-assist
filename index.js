var mongodb = require('mongodb');
var mysql = require('mysql');
var redis = require("redis");
var pg = require('pg');

/* Utility functions */
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
    this.hasHarbor = (process.env.STACKATO_HARBOR) ? true : false;
    if(this.hasHarbor) this.harborPort = process.env.STACKATO_HARBOR;

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
                if(service == 'harbor') this.hasHarbor = true;

            }
        }
    }

};

/*  getService: Get a service by name

    Returns the service object in JSON
    if it exists, otherwise returns null

    @servicename = the user derived service name
    @cb = the callback function (err, service)
*/

Stackato.prototype.getService = function(serviceName, cb){
    if(has(this.services, serviceName)){
        return cb(null, this.services[serviceName]);
    }else{
        return cb(null, null);
    }
}

/* MongoDB connection helper

   Uses the native mongodb driver:

   https://github.com/mongodb/node-mongodb-native

   @servicename = the user derived service name specified in the stackato.yml
   @opts = mongodb connection parameters (optional)
   @cb = the callback function when a connection has been attempted (err, client)
*/
Stackato.prototype.connectMongoDB = function(serviceName, opts, cb) {
    if(opts instanceof Function) {
        cb = opts;
        opts = {safe:false};
    }
    if(!cb){
        return new Error('Last argument must be callback function')
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

/* Redis connection helper

   Uses the ubiquitous node_redis driver: https://github.com/mranney/node_redis

   @servicename = the user derived servicename specified in the stackato.yml
   @opts = node_redis createConnection() parameters (optional)
   @cb = the callback function when a connection has been attempted (err, client)
*/
Stackato.prototype.connectRedis = function(serviceName, opts, cb) {

    if(opts instanceof Function) {
        cb = opts;
        opts = {};
    }
    if(!cb){
        return new Error('Last argument must be callback function')
    }
    if(!serviceName){
        return cb(new Error('Service name not specified'));
    }
    if (has(this.services, serviceName)){
        var client = redis.createClient(this.services[serviceName].port, this.services[serviceName].host, opts);
        client.on('error', function(err){
            cb(err);
        });
        client.auth(this.services[serviceName].password, function(){
            return cb(null, client);
        });
    }else{
        cb(new Error('Cannot find a service named: ' + serviceName));
    }
};


/* PostgreSQL connection helper

   Uses the de facto node-postgres driver: https://github.com/brianc/node-postgres

   @servicename = the user derived servicename specified in the stackato.yml
   @opts = pg defaults parameters (optional)
   @cb = the callback function when a connection has been attempted (err, client, node-postgres [object])
*/
Stackato.prototype.connectPostgreSQL = function(serviceName, opts, cb) {

    if(opts instanceof Function) {
        cb = opts;
        opts = {};
    }
    if(!cb){
        return new Error('Last argument must be callback function')
    }
    if(!serviceName){
        return cb(new Error('Service name not specified'));
    }
    if (has(this.services, serviceName)){

        // make the pg object re-usable in the callback
        // by specifying the default connection params
        pg.defaults.host = this.services[serviceName].host;
        pg.defaults.port = this.services[serviceName].port;
        pg.defaults.user = this.services[serviceName].user;
        pg.defaults.password = this.services[serviceName].password;
        pg.defaults.database = this.services[serviceName].name;

        pg.connect(function(err, client){
            cb(err, client, pg);
        });

    }else{
        cb(new Error('Cannot find a service named: ' + serviceName));
    }
};

/* MySQL connection helper

   Uses the currently active mysql driver: https://github.com/felixge/node-mysql

   @servicename = the user derived servicename specified in the stackato.yml
   @opts = `mysql` default parameters (optional)
   @cb = the callback function when a connection has been attempted (err, connection [object])
*/
Stackato.prototype.connectMySQL = function(serviceName, opts, cb) {

    if(opts instanceof Function) {
        cb = opts;
        opts = {};
    }
    if(!cb){
        return new Error('Last argument must be callback function')
    }
    if(!serviceName){
        return cb(new Error('Service name not specified'));
    }
    if (has(this.services, serviceName)){

        var connection = mysql.createConnection({
          host     : this.services[serviceName].host,
          port     : this.services[serviceName].port,
          user     : this.services[serviceName].user,
          password : this.services[serviceName].password,
          database : this.services[serviceName].name
        });

        connection.connect();

        cb(null, connection);

    }else{
        cb(new Error('Cannot find a service named: ' + serviceName));
    }
};

module.exports = new Stackato()
