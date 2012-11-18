var stackato = require('stackato-assist');

/*
 * GET index page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Stackato-Assist', stackato: stackato });
};
