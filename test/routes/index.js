var stackato = require('../lib/index');

/*
 * GET index page.
 */

exports.index = function(req, res){
  if(stackato.hasMongoDB){
    stackato.getService('x1', function(err, service){
      console.log(service);
    });
    stackato.connectMongoDB('x1', function(err, client){
      console.error(err);
    });
  }

  if(stackato.hasRedis){
    stackato.connectRedis('x2', function(err, client){
      console.error(err, client);
    });
  }
  res.render('index', { title: 'Stackato-Assist', stackato: stackato });
};
