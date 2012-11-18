var stackato = require('../lib/index');

/*
 * GET index page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Stackato-Assist', stackato: stackato });
};
