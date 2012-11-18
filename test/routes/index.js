var stackato = require('../lib/index');

/*
 * GET index page.
 */

exports.index = function(req, res){
  if(stackato.hasMongoDB){
    stackato.connectMongoDB('x1', function(err, client){
      console.error(err);
    });
  }
  res.render('index', { title: 'Stackato-Assist', stackato: stackato });
};
