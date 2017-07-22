var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , conn = 'mongodb://localhost/mydb';
mongoose.connect(conn);
/* role schema */
console.log('connected');
console.log('=====================');
var RoleSchema = new Schema({
    title: String,
    bitMask: Number
});
var Role = mongoose.model('roles', RoleSchema);
var User = require('./models/User.js')
var adminRole = new Role({
    title: 'admin',
    bitMask: 4
});
var userRole = new Role({
    title: 'user',
    bitMask: 2
});

adminRole.save(function (err) {
    if (err) {
        console.log('error happen:', err);
    } else {
        console.log('========admin role created=======');
        User.addUser('admin', '12345', { title: 'admin' }, function () {

            userRole.save(function (err) {
                if (err) {
                    console.log('error happen:', err);
                } else {
                    console.log('========user role created=======');
                    User.addUser('shlomo', '12345', { title: 'user' }, function () { });
                    User.addUser('Matt', '12345', { title: 'user' }, function () {
                        User.addUser('Yoav', '12345', { title: 'user' }, function () {
                            console.log('4 users created')
                            process.exit(0);
                        });
                    })
                }
            });


        });
    }
});
