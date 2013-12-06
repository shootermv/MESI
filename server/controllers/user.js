var _ =           require('underscore')
    , User_ =      require('../models/User.js')
	, mongoose = require('mongoose')
	, User =   mongoose.model('User')
    , userRoles = require('../../client/js/routingConfig').userRoles;

module.exports = {
    index: function(req, res) {
	   /*
        var users = User.findAll();
        _.each(users, function(user) {
            delete user.password;
            delete user.twitter;
            delete user.facebook;
            delete user.google;
            delete user.linkedin;
        });*/
		User.find({}).populate('role').exec(function(err, users){
		    if(err)console.log('error durig user search...');
			console.log('users found '+users.length);
			
			   console.log('users ',users.length)
			   res.json(users);			
		});
			
	    
		
        //res.json(users);
    }
};