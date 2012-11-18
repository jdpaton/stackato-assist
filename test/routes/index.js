var stackato = require('../lib/index');

/*
 * GET index page.
 */

exports.index = function(req, res){
  if(stackato.hasMongoDB){
    stackato.getService('x1', function(err, service){
      //console.log(service);
    });
    stackato.connectMongoDB('x1', function(err, client){
      //console.error(err);
    });
  }

  if(stackato.hasRedis){
    stackato.connectRedis('x2', function(err, client){
      //console.error(err, client);
    });
  }

  if(stackato.hasPostgreSQL){
    stackato.connectPostgreSQL('x3p', function(err, client, pg){
      client.query("SELECT NOW() as when", function(err, result) {
        console.log("Row count: %d",result.rows.length);  // 1
        console.log("Current year: %d", result.rows[0].when.getFullYear());

        pg.connect(function(err, clientTwo){
          clientTwo.query("SELECT NOW() as when", function(err, result) {
            console.log("ClientTwo: Row count: %d",result.rows.length);  // 1
            console.log("ClientTwo: year: %d", result.rows[0].when.getFullYear());
          });
        });
      });
    });
  }
  res.render('index', { title: 'Stackato-Assist', stackato: stackato });
};
