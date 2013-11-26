var _ =           require('underscore')
    , path =      require('path')
    , passport =  require('passport')
    , AuthCtrl =  require('./controllers/auth')
    , UserCtrl =  require('./controllers/user')
	, TaskCtrl =  require('./controllers/tasks')
    , User =      require('./models/User.js')
	
    , userRoles = require('../client/js/routingConfig').userRoles
    , accessLevels = require('../client/js/routingConfig').accessLevels;

var routes = [

    // Views
    {
        path: '/partials/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        }]
    },

    // OAUTH
    {
        path: '/auth/twitter',
        httpMethod: 'GET',
        middleware: [passport.authenticate('twitter')]
    },
    {
        path: '/auth/twitter/callback',
        httpMethod: 'GET',
        middleware: [passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/login'
        })]
    },
    {
        path: '/auth/facebook',
        httpMethod: 'GET',
        middleware: [passport.authenticate('facebook')]
    },
    {
        path: '/auth/facebook/callback',
        httpMethod: 'GET',
        middleware: [passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        })]
    },
    {
        path: '/auth/google',
        httpMethod: 'GET',
        middleware: [passport.authenticate('google')]
    },
    {
        path: '/auth/google/return',
        httpMethod: 'GET',
        middleware: [passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/login'
        })]
    },
    {
        path: '/auth/linkedin',
        httpMethod: 'GET',
        middleware: [passport.authenticate('linkedin')]
    },
    {
        path: '/auth/linkedin/callback',
        httpMethod: 'GET',
        middleware: [passport.authenticate('linkedin', {
            successRedirect: '/',
            failureRedirect: '/login'
        })]
    },

    // Local Auth
    {
        path: '/register',
        httpMethod: 'POST',
        middleware: [AuthCtrl.register]
    },
    {
        path: '/login',
        httpMethod: 'POST',
        middleware: [AuthCtrl.login]
    },
    {
        path: '/logout',
        httpMethod: 'POST',
        middleware: [AuthCtrl.logout]
    },
	
    // Tasks resource
    {
        path: '/tasks',
        httpMethod: 'GET',
        middleware: [TaskCtrl.index],
        accessLevel: accessLevels.user
    },
	
	{	
		path: '/ForAdmin',
		httpMethod: 'GET',
		middleware: [TaskCtrl.foradmin],
		accessLevel: accessLevels.admin
	},
	{	
		path: '/task/:id',
		httpMethod: 'PUT',
		middleware: [TaskCtrl.updatetask],
		accessLevel: accessLevels.user    // User resource
	},	
	{	
		path: '/unAssignTask',
		httpMethod: 'GET',
		middleware: [TaskCtrl.unassigntask],
		accessLevel: accessLevels.admin    // User resource
	},
	/*/addtask*/
	{	
		path: '/addtask',
		httpMethod: 'POST',
		middleware: [TaskCtrl.addtask],
		accessLevel: accessLevels.admin    // User resource
	},	
	{	
		path: '/assignTask',
		httpMethod: 'GET',
		middleware: [TaskCtrl.assigntask],
		accessLevel: accessLevels.admin    // User resource
	},	
    {
        path: '/users',
        httpMethod: 'GET',
        middleware: [UserCtrl.index],
        accessLevel: accessLevels.admin
    },

    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function(req, res) {
            var role = userRoles.public, username = '', name='';
            if(req.user) {
                role = req.user.role;
                username = req.user.username;
				name = req.user.name;
            }
            res.cookie('user', JSON.stringify({
                'username': username,
				'name':name,
                'role': role
            }));
			//console.log('trying to show index  page... -user is ' ,role.title)
            res.render('index');
        }]
    }
];

module.exports = function(app) {

    _.each(routes, function(route) {
        route.middleware.unshift(ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);
        //console.log('args-',args)
        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
			   
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
}

function ensureAuthorized(req, res, next) {
    var role;
    if(!req.user){
	    //console.log('ensureAuthorized --user is null')
		role = userRoles.public;
	}
    else { 
      //	console.log('ensureAuthorized req.user.role-' ,req.user.role);
	    role = req.user.role;
	}

    var accessLevel = _.findWhere(routes, { path: req.route.path }).accessLevel || accessLevels.public;
   // console.log('accessLevel-',accessLevel)
	
    if(!(accessLevel.bitMask & role.bitMask)){ 
	    console.log('no role...')
		return res.send(403);
	}
    return next();
}