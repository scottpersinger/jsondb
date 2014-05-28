db = require('./json_pg.js')
setTimeout(function() {
	db.find('credit_cards', {"id=":2})
	db.find('credit_cards', {"number like":'88%'})
}, 200);

