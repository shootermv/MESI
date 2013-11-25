var _ =           require('underscore')
  ,  mongoose = require('mongoose');
    require('../models/Task');
Task = mongoose.model('Task');
User = mongoose.model('User');
module.exports = {
    index: function(req, res) {
       // res.json( [{'summary':'shlomo'}]);		
	    console.log('getting tasks for user-'+req.user.id)
		/*
	   	Task.find(function(err, tasks){
			res.send(tasks);
	    });
		*/
		User.findOne({_id:req.user.id}).populate('tasks').exec(function(err,user){
            /*
			Task.findOne({},'first',function(err, task){
				user.tasks.push(task._id);
				user.save();
			});
			*/	
            console.log('user.tasks '+user.tasks.length)			
			res.send(user.tasks);
		});
	},
	foradmin: function(req, res) {
		function notFoundInAssiged(users, task){
		    
		    var notfound = true;
		    _.each(users,function(u){
			   // console.log('searching for task -'+task.id+' in user' + u.name + ', who has -'+u.tasks.length+'  tasks');
			    _.each(u.tasks,function(usertask){
				
					if(task.id==usertask.id){
					    console.log('task '+ task.summary +' assigned to user '+u.name);
						notfound = false;
					}
				});
				//console.log('pppp '+u.name+' tasks-'+u.tasks.length)
			});
			return notfound;
		}
	
	
	    var result={ unassignedTasks:null, users:null };
	   	Task.find(function(err, tasks){
			result.unassignedTasks=tasks;
			//not admin users
             User.find().populate('role').populate('tasks').exec(function(err, allUsers){
			    //must filter admin from all users:
			    result.users  = _.filter(allUsers, function(usr){return usr.role.title== "user"});
				//filter assgned tasks:
				result.unassignedTasks = _.filter(result.unassignedTasks, function(tsk){
				   return notFoundInAssiged(result.users, tsk)
				});				
				res.send(result);				
				
			 });			 
	    });	
		
	},
	unassigntask: function(req, res) {
	    var taskId = req.query.taskId, userId = req.query.uid;
		User.findOne({_id:userId},function(err , user){
		    if(!err){
			 // user.tasks.remove({id:taskId});
			    var index=null;
				 _.each(user.tasks, function (id, ind) {
				    if(id==taskId){ 
						index=ind; 
					    console.log('task ref found!')
					}
				});
				if(!index){
					user.tasks.splice(index,1);
					user.save(function(){
						res.send({});
					})
				}
		        //console.log('user tasks len:'+user.tasks.length)
			}
		});//end of find user
		
	},
	assigntask: function(req, res) {
	    var taskId = req.query.taskId, userId = req.query.uid;
		User.findOne({_id:userId},function(err , user){	
			if(!err){
			    console.log('assiging task!')
				user.tasks.push(taskId);
				user.save(function(){
					res.send({});
				})			
			}//end of !err		
		});//end of find user	
	},
	addtask:function(req, res) {
	    console.log('trying to add new task!')
		var newtask= new Task({summary:req.body.summary, completed:req.body.completed})
		newtask.save(function(err){
			if(!err)	     
			  res.json(newtask); 
		});	
	}
};