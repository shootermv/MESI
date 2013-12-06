// mongoimport.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myDB');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Schema=mongoose.Schema;

var TaskSchema = new Schema({
	summary:String,	
	status:String,
	createdate:{ type : Date, default: Date.now },
	changedate:Date
});
var Task  = mongoose.model('Task', TaskSchema);

Task.find({},function(err,dbtasks){

	for(var i=0; i<dbtasks.length; i++) {
		var task = dbtasks[i];
		task.createdate = new  Date();
		task.save();
	}


	
	console.log("Tasks update finished! Press Ctrl+C to exit.");
})
