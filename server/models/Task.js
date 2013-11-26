var mongoose = require('mongoose')
, Schema = mongoose.Schema;
/*, async = require('async')
, _ = require('underscore');*/

var TaskSchema = new Schema({
	summary:String,	
	status:String
});	
var Task = mongoose.model('Task',TaskSchema);