// mongoimport.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myDB');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var roles = require('./roles');

var RoleSchema = new mongoose.Schema({
	title: String,
	bitMask:Number
});
var Role  = mongoose.model('Role', RoleSchema);

Role.find({},function(err,dbroles){

	for(var i=0; i<dbroles.length; i++) {
		dbroles[i].remove();
	}

	for(var i=0; i<roles.length; i++) {
		var role = new Role({
			"title": roles[i].title,
			"bitMask": roles[i].bitMask
		})

		role.save(function(err,dbrole){
			if (err)
			console.log("Error on role save!");
		})
	}
	
	console.log("Roles import finished! Press Ctrl+C to exit.");
})
