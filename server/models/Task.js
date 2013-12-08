var mongoose = require('mongoose')
, Schema = mongoose.Schema;
/*, async = require('async')
, _ = require('underscore');*/


var TaskSchema = new Schema({
	summary:String,	
	status:{ name: String ,id:Number},
	createdate:{ type : Date, default: Date.now },
	changedate:Date	
});	
var Task = mongoose.model('Task',TaskSchema);