var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , conn = 'mongodb://localhost/mydb';
mongoose.connect(conn);

console.log('connected');

require('./models/User.js');
var Role = mongoose.model('Role');
var User = mongoose.model('User');

var adminRole = new Role({
    title: 'admin',
    bitMask: 4
});
var userRole = new Role({
    title: 'user',
    bitMask: 2
});



adminRole.save().then(function (adminRole) {
    return new User({ name: 'admin', password: '12345', role: adminRole._id }).save();
}).then(function () {
    return userRole.save();
}).then(function (userRole) {
    return new User({ name: 'shlomo', password: '12345', role: userRole._id }).save();
    process.exit(0);
})
