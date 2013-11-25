var mongoose = require('mongoose')
, Schema = mongoose.Schema;
/*, async = require('async')
, _ = require('underscore');*/

var TaskSchema = new Schema({
	summary:String,
	completed:Boolean
});	
var Task = mongoose.model('Task',TaskSchema);