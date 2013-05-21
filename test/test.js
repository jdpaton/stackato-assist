var sa
  , testData = require('./test-data')
  , assert   = require('assert');

function addEnv(key, val){
  key = key.toUpperCase();
  process.env[key] = val;
}

function remEnv(key, val){
  delete process.env[key];
}

describe('Test stackato-assist', function(){

  it('should setup the dummy ENV', function(){
    addEnv('stackato_app_name', 'test');
    addEnv('port', 3000);
    addEnv('vcap_app_host', '192.168.3.130');
    addEnv('vmc_app_instance', JSON.stringify(testData.vmc_app_instance));
    addEnv('vcap_application', JSON.stringify(testData.vcap_application));
    addEnv('vcap_services', JSON.stringify(testData.vcap_services));

    addEnv('mongodb_url', 'mongodb://6b9c0768-be43-41f2-915f-682a0dc3e9c8:a7c4f7a0-747b-4cd4-8846-002333457b91@192.168.8.219:25001/db');
    addEnv('redis_url', 'redis://user:4a965dc5-7718-4c99-a6f4-1783ed226750@192.168.8.219:5001/');
    addEnv('mysql_url', 'mysql://u5abSI2TAAsOQ:pyn3Rv6wpdbEh@192.168.8.219:3306/d918cc3be09de487ea14f10be78896006');
    addEnv('postgresql_url', 'postgres://ua6179e2d2b704109b11970c272de9ef1:pab0a5a006d7a4f2cb9ebcd21eb18be1d@192.168.8.219:5432/d4b4efa3f015d41eaa5005208313e814f');
    addEnv('stackato_harbor', 4100);

    addEnv('stackato_services', JSON.stringify(testData.stackato_services));

  });

  it('should initiate the module', function(){
    sa = require('../index');
  });

  it('should identify as a stackato app', function(){
    assert(sa.isStackato === true);
  });

  it('should return the app port', function(){
    assert(sa.port === 3000);
  });

  it('should return the app host', function(){
    assert(sa.host === process.env.VCAP_APP_HOST);
  });

  it('should return the instance ID', function(){
    assert(sa.instanceID === '469acbd9c9c8c0f42925ca0718a6ceea');
  });

  it('should identify sudo as enabled', function(){
    assert(sa.sudo === true);
  });

  it('should list the app URI', function(){
      assert(sa.uris.indexOf('stackato-assist.stackato-6cad.local') === 0);
  });

  it('should have mongodb enabled', function(){
      assert(sa.hasMongoDB === true);
  });

  it('should have redis enabled', function(){
      assert(sa.hasRedis === true);
  });

  it('should have mysql enabled', function(){
      assert(sa.hasMySQL === true);
  });

  it('should have postgresql enabled', function(){
      assert(sa.hasPostgreSQL === true);
  });

  it('should have harbor enabled', function(){
      assert(sa.hasHarbor === true);
  });

  it('should get service credentials', function(done){
      sa.getService('x3p', function(err, service){
        assert(err === null);
        assert(service, 'getService() details missing');
        assert(service.port);
        assert(service.host);
        done();
      });
  });

  it('should connect to MongoDB', function(done){
    sa.connectMongoDB('x1', function(err, client){
      assert(err === null);
      assert(client);
      done();
    });
  });

});
