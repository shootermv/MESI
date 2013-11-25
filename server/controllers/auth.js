var passport =  require('passport')
    , mongoose = require('mongoose')
    , _User = require('../models/User.js')
    ,  modelUser =   mongoose.model('User');
module.exports = {
    register: function(req, res, next) {
        try {
            _User.validate(req.body);
        }
        catch(err) {
            return res.send(400, err.message);
        }

        _User.addUser(req.body.username, req.body.password, req.body.role, function(err, user) {
            if(err === 'UserAlreadyExists'){
				return res.send(403, "User already exists");
			}
            else if(err){
				return res.send(500);
			}
			else{
			
				req.logIn(user, function(err) {
					if(err){ 
						next(err);
					}
					else { 
						console.log('user.role --- ',user.role);						
						res.json(200, { "role": user.role, "username": user.username }); 
					}
				});
			}
			
        });
    },

    login: function(req, res, next) {
        passport.authenticate('local', function(err, user) {

            if(err){ 
				console.log('auth error 1'); 
				return next(err);
			}
            if(!user){ 
			    console.log('no users  auth error')
				return res.send(400); 
			}

            req.logIn(user, function(err) {
                if(err) {
				    console.log('login auth error');
                    return next(err);
                }
                //console.log('user name is:'+user.name+',role is '+user.role.title)
                if(req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                res.json(200, { "role": user.role, "username": user.username ,"name":user.name});
            });
        })(req, res, next);
    },

    logout: function(req, res) {
        req.logout();
        res.send(200);
    }
};