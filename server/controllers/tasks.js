var _ =           require('underscore')
  ,  mongoose = require('mongoose');
    require('../models/Task');
Task = mongoose.model('Task');
User = mongoose.model('User');
module.exports = {
    index: function(req, res) {
   	
	    console.log('getting tasks for user-'+req.user.id)
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
					    console.log('task '+ task.summary +' assigned to user '+u.name.toUpperCase());
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
	deleteUnassignedtask: function(req, res) {
	    //console.log('deleting task '+req.params.id)
        var id=req.params.id;
	    Task.findOne({_id:id}).remove( function(err, task){	    
			res.end();
	    })
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
				if(index!==null){
					user.tasks.splice(index,1);
					user.save(function(){
						res.send({});
					})
				}else{
					console.log('task ref NOT found among this user tasks!')
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
		var newtask= new Task({
			summary:req.body.summary,
			status:'new'
		})
		newtask.save(function(err){
			if(!err)	     
			  res.json(newtask); 
		});	
	},
	updatetask:function(req, res) {
	    var taskid = req.params.id;
		var thetask= req.body;
		Task.findOne({_id:taskid},function(err , foundtask){
			 if(!err) {  
				foundtask.status = thetask.status;
				foundtask.changedate = new Date();
				//foundtask.summary ='user screen - add task functionality';
				foundtask.save(function(error){
					if(!error){	
                        console.log('finally:'+foundtask.status)					
						res.json(foundtask);
						console.log('task saved! ')
					} else{
						console.log('some error occured during save of the task! '+error)
					}
								 
				});
			}
			else{
                 console.log('task not found');
			}			
		});	
	},
	//for update summary - for Admin
	updatetaskSummary:function(req, res) {
	    var taskid = req.params.id;
		var thetask= req.body;
		Task.findOne({_id:taskid},function(err , foundtask){
			 if(!err) {  
				foundtask.summary = thetask.summary;
				foundtask.save(function(error){
					if(!error){	
                        					
						res.json(foundtask);
						console.log('task saved with summary: '+thetask.summary)
					} else{
						console.log('some error occured during save summary of the task! '+error)
					}
								 
				});
			}
			else{
                 console.log('task not found');
			}			
		});	
	}
	
};