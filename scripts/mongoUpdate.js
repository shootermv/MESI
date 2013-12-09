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
/*
Task.find({},function(err,dbtasks){

	for(var i=0; i<dbtasks.length; i++) {
		var task = dbtasks[i];
		//task.createdate = new  Date();
		
		switch(task.status.name){
		    case "new":
				task.status = {name:"new",id:1}
				break;
		    case "active":
				task.status = {name:"active",id:2}
				break;	
		    case "completed":
				task.status = {name:"completed",id:3}
				break;					
		}
		
		task.save();
	}


	
	console.log("Tasks update finished! Press Ctrl+C to exit.");
})*/
Task.update({"status.name":"active"}, {"status.id": "1"} , {upsert: false, multi:true}, function(err){
	if(!err)console.log("Tasks update finished! Press Ctrl+C to exit.");
	if(err)console.log('error:',err)
})
