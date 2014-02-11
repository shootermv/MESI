var _ =           require('underscore')
  ,  mongoose = require('mongoose');
    require('../models/Task');
Task = mongoose.model('Task');
User = mongoose.model('User');
Role = mongoose.model('Role');
var io=null;


module.exports = {
	init:function(_io){
       io =_io;
        
	},
    index: function(req, res) {
   	
	    console.log('getting tasks for user-'+req.user.id)
		User.findOne({_id:req.user.id}).populate('tasks').exec(function(err,user){
            /*
			Task.findOne({},'first',function(err, task){
				user.tasks.push(task._id);
				user.save();
			});
			*/	
			//console.log('user.tasks[0] summary is : '+user.tasks[0].summary)	
            //console.log('user.tasks[0] status  is: '+user.tasks[0].status.name)			
			res.send(user.tasks);
		});
	},
	unactivatePrevActive: function(req, nextstatus, next) {
	    if(nextstatus=='active'){
			User.findOne({_id:req.user.id}).populate('tasks', null, {'status.name': 'active'}).exec(function(err, user){
			    console.log('changing to old active status to NEW...')
				if(!user.tasks.length){
					console.log('no previously active tasks found...');
					next();
				}
				else{//there are previously active tasks
					Task.update({_id:user.tasks[0].id},{ $set: { status: {name:'new',id:2}}},{upsert:false,multi:false},function(err){
						if(!err){
							console.log('old active status changed successfully...');
							next();
						}
						else{
							console.log('error ocurred');
						}				
					})
				}
			});//end of finding previously actvie tasks...
		}
		else{
			next();
		}
	
	},
	foradmin: function(req, res) {
		function notFoundInAssiged(users, task){
		    
		    var notfound = true;
		    _.each(users,function(u){
			   // console.log('searching for task -'+task.id+' in user' + u.name + ', who has -'+u.tasks.length+'  tasks');
			    _.each(u.tasks,function(usertask){
				
					if(task.id==usertask.id){
					    //console.log('task '+ task.summary +' with status ['+task.status.name+'] assigned to user '+u.name.toUpperCase());
						notfound = false;
					}
				});				
			});
			return notfound;
		}
	
	
	    var result={ unassignedTasks:null, users:null };
	   	Task.find(function(err, tasks){
			result.unassignedTasks=tasks;
			
			//sort by the task status id  -{path:'tasks',options:{sort:{'status.id': 'ascending'}}}
			/*
			Role.findOne({title:'user'}, function(err, role){			
				User.find({role:role._id}).populate('role').exec(function(err, u){
				   if(err)
					  console.log('error-',err);
				   else{
					  console.log('users in role "user":',u.length);
				   }			   
				});
			
			});*/
			
			//not admin users
             User.find().populate('role').populate('tasks').exec(function(err, allUsers){
			    //must filter admin from all other users(admin cannot get tasks):
			    result.users  = _.filter(allUsers, function(usr){return usr.role.title== "user"});
				//filter assgned tasks:

				result.unassignedTasks = _.filter(result.unassignedTasks, function(tsk){
				   return notFoundInAssiged(result.users, tsk)
				});
				
				//must sort tasks of each user by status
                console.log('sorting...')				
				_.each(result.users,function(u){				
				    u.tasks = _.sortBy(u.tasks, function(obj){ return +obj.status.id })
					u.tasks = u.tasks.slice(0,10);
				})
				//print tasks of each user:
				/*
				_.each(result.users,function(u){
				    console.log( u.name.toUpperCase() );
					_.each(u.tasks,function(usertask){											
						console.log('task '+ usertask.summary +' - ['+usertask.status.id+']');													
					});				
				});				
				*/
				
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

					//socket						
					io.sockets.emit('newtask', {});
					res.send({});
				})			
			}//end of !err		
		});//end of find user	
	},
	addtask:function(req, res) {
	    console.log('trying to add new task!')
		var newtask= new Task({
			summary:req.body.summary,
			status:{name:'new',id:1}
		})
		newtask.save(function(err){
			if(!err)	     
			  res.json(newtask); 
		});	
	},
	
	//only user
	updatetask:function(req, res) {
	    var taskid = req.params.id;
		var thetask= req.body;
		//if status gonna change to 'active' - the old active must be changed back to "new"
		console.log('current user-'+req.user.name);
		module.exports.unactivatePrevActive(req, thetask.status.name, function(){											
			Task.findOne({_id:taskid},function(err , foundtask){
				 if(!err) {  
					foundtask.status = thetask.status;
					foundtask.changedate = new Date();
					
					foundtask.save(function(error){
						if(!error){	
							console.log('changing task status to: '+foundtask.status.name);

                            //socket						
					        io.sockets.emit('status', {task:foundtask, user:req.user});                    


							res.json(foundtask);							
						}else{
							console.log('some error occured during save of the task! '+error)
						}									 
					});
				}
				else{
					console.log('task not found');
				}			
			});
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