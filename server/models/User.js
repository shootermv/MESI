var User
    , _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
   // , TwitterStrategy = require('passport-twitter').Strategy
   // , FacebookStrategy = require('passport-facebook').Strategy
   // , GoogleStrategy = require('passport-google').Strategy
   // , LinkedInStrategy = require('passport-linkedin').Strategy
    , check =           require('validator').check
    , userRoles =       require('../../client/js/routingConfig').userRoles;
	
var mongoose = require('mongoose')
, crypto = require('crypto')
, Schema = mongoose.Schema;
/* role schema */

var RoleSchema = new Schema({
	title: String,
	bitMask:Number
});
var Role  = mongoose.model('Role', RoleSchema);
/* user schema  */
var UserSchema = new Schema({
    name: String,
    hashed_password: String,
	role: { type: Schema.Types.ObjectId, ref: 'Role' },
	salt: String,
	tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
})
UserSchema.statics = {
  load: function (id, cb) {
    console.log('populating tasks');
    this.findOne({ _id : id }).populate('tasks').exec(cb);
  }
};

UserSchema
  .virtual('password')
  .set(function(password) {
   // this._password = password
    this.salt = this.makeSalt()
	console.log('trying to encrypt passwd...')
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password })

UserSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  }, 
  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },
  encryptPassword: function(password) {
    if (!password) return ''		    
		return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
  }
}

  
  
  
var User  = mongoose.model('User', UserSchema);
/* end  of user schema */


var users = [
    {
        id:         1,
        username:   "user",
        password:   "123",
        role: userRoles.user
    },
    {
        id:         2,
        username:   "admin",
        password:   "123",
        role:   userRoles.admin
    }
];
//console.log('userRoles.admin',userRoles.admin)
module.exports = {
    addUser: function(username, password, role, callback) {
	    //console.log('addUser - role', role)
		/*
		OLD:
        if(this.findByUsername(username) !== undefined)  return callback("UserAlreadyExists");

        // Clean up when 500 users reached
        if(users.length > 500) {
            users = users.slice(0, 2);
        }

        var user = {
            id:         _.max(users, function(user) { return user.id; }).id + 1,
            username:   username,
            password:   password,
            role:       role
        };
        users.push(user);
		*/
		//find role:
		console.log('add user role-',role)
		Role.findOne({title:role.title},function(err, foundrole){
		    if(!err){
				var newuser= new User({name:username,role:foundrole._id});
				newuser.set('password',password);
				newuser.save(function(err){
					if(!err){
					   
                       	User.findOne({ _id:newuser._id}).populate('role').exec(function (err, _user) {				
					         callback(null, _user);
					    });
					}
					else{
					  console.log('error while create user!')
					 }
				});	
			}else{
				console.log('error while finding role!')
			}
					
		})

    },

    findOrCreateOauthUser: function(provider, providerId) {
        var user = module.exports.findByProviderId(provider, providerId);
        if(!user) {
            user = {
                id: _.max(users, function(user) { return user.id; }).id + 1,
                username: provider + '_user', // Should keep Oauth users anonymous on demo site
                role: userRoles.user,
                provider: provider
            };
            user[provider] = providerId;
            users.push(user);
        }

        return user;
    },

    findAll: function() {
	
        return _.map(users, function(user) { return _.clone(user); });								
		
    },

    findById: function(id) {
        return _.clone(_.find(users, function(user) { return user.id === id }));
    },

    findByUsername: function(username) {
        return _.clone(_.find(users, function(user) { return user.username === username; }));
    },

    findByProviderId: function(provider, id) {
        return _.find(users, function(user) { return user[provider] === id; });
    },

    validate: function(user) {
        check(user.username, 'Username must be 1-20 characters long').len(1, 20);
        check(user.password, 'Password must be 5-60 characters long').len(5, 60);
        check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

        // TODO: Seems node-validator's isIn function doesn't handle Number arrays very well...
        // Till this is rectified Number arrays must be converted to string arrays
        // https://github.com/chriso/node-validator/issues/185
        var stringArr = _.map(_.values(userRoles), function(val) { return val.toString() });
        check(user.role, 'Invalid user role given').isIn(stringArr);
    },

    localStrategy: new LocalStrategy(
        function(username, password, done) {
		   
             /*
            var user = module.exports.findByUsername(username);
        
            if(!user) {
                done(null, false, { message: 'Incorrect username.' });
            }
            else if(user.password != password) {
                done(null, false, { message: 'Incorrect username.' });
            }
            else {
                return done(null, user);
            }			
			*/
			User.findOne({ name: username }).populate('role').exec(function (err, user) {
				if (err) {    
                     console.log('error occurred during authentication...');			
					return done(err) 
				}
				if (!user) {
                   	console.log('no user '+username+' exists...')		
				   return done(null, false, { message: 'Unknown user' })
				}
				if (!user.authenticate(password)) {					   
				  return done(null, false, { message: 'Invalid password' })
				}
				//console.log('user is '+user.name)
				
				return done(null, user);			    

			});
			
        }
    ),

    twitterStrategy: function() {
        if(!process.env.TWITTER_CONSUMER_KEY)    throw new Error('A Twitter Consumer Key is required if you want to enable login via Twitter.');
        if(!process.env.TWITTER_CONSUMER_SECRET) throw new Error('A Twitter Consumer Secret is required if you want to enable login via Twitter.');

        return new TwitterStrategy({
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:8000/auth/twitter/callback'
        },
        function(token, tokenSecret, profile, done) {
            var user = module.exports.findOrCreateOauthUser(profile.provider, profile.id);
            done(null, user);
        });
    },

    facebookStrategy: function() {
        if(!process.env.FACEBOOK_APP_ID)     throw new Error('A Facebook App ID is required if you want to enable login via Facebook.');
        if(!process.env.FACEBOOK_APP_SECRET) throw new Error('A Facebook App Secret is required if you want to enable login via Facebook.');

        return new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:8000/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            var user = module.exports.findOrCreateOauthUser(profile.provider, profile.id);
            done(null, user);
        });
    },

    googleStrategy: function() {

        return new GoogleStrategy({
            returnURL: process.env.GOOGLE_RETURN_URL || "http://localhost:8000/auth/google/return",
            realm: process.env.GOOGLE_REALM || "http://localhost:8000/"
        },
        function(identifier, profile, done) {
            var user = module.exports.findOrCreateOauthUser('google', identifier);
            done(null, user);
        });
    },

    linkedInStrategy: function() {
        if(!process.env.LINKED_IN_KEY)     throw new Error('A LinkedIn App Key is required if you want to enable login via LinkedIn.');
        if(!process.env.LINKED_IN_SECRET) throw new Error('A LinkedIn App Secret is required if you want to enable login via LinkedIn.');

        return new LinkedInStrategy({
            consumerKey: process.env.LINKED_IN_KEY,
            consumerSecret: process.env.LINKED_IN_SECRET,
            callbackURL: process.env.LINKED_IN_CALLBACK_URL || "http://localhost:8000/auth/linkedin/callback"
          },
           function(token, tokenSecret, profile, done) {
            var user = module.exports.findOrCreateOauthUser('linkedin', profile.id);
            done(null,user); 
          }
        );
    },
    serializeUser: function(user, done) {
	    console.log('serializing... '+user.id);
        done(null, user.id);
    },

    deserializeUser: function(id, done) {
	    //console.log('deserializing...');
		//console.log('trying to find user by id- '+id);
		//old:
        /*	
        var user = module.exports.findById(id);

        if(user)    { done(null, user); }
        else        { done(null, false); }
		*/
		
		User.findOne({ _id: id }).populate('role').exec(function(err, user){
		  if(err){
			  console.log('user error!')
		  }
		  
		  //console.log('user.role:',user.role);
		  done(err, user)
		  
		});
		
    }
};