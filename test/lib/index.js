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

    // TODO
    // Database auto connection helpers

};

module.exports = new Stackato()