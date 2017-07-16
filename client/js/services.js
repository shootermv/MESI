'use strict';

angular.module('Mesi')
    .factory('Auth', ['$http', '$cookieStore', function ($http, $cookieStore) {

        var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles
            , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };


        //why to remove?
        $cookieStore.remove('user');

        function changeUser(user) {
            _.extend(currentUser, user);
        };

        return {
            authorize: function (accessLevel, role) {
                if (role === undefined)
                    role = currentUser.role;

                return accessLevel.bitMask & role.bitMask;
            },
            isLoggedIn: function (user) {
                if (user === undefined)
                    user = currentUser;
                return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
            },
            register: function (user, success, error) {
                $http.post('/register', user).then(function (res) {
                    changeUser(res.data);
                    success();
                }, error(error));
            },
            login: function (user, success, error) {
                $http.post('/login', user).then(function (user) {
                    changeUser(user.data);
                    success(user.data);
                }, error(error));
            },
            logout: function (success, error) {
                $http.post('/logout').then(function () {
                    changeUser({
                        username: '',
                        role: userRoles.public
                    });
                    success();
                }, error(error));
            },
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser
        };
    }]);

angular.module('Mesi')
    .factory('Users', ['$http', function ($http) {
        return {
            getAll: function (success, error) {
                $http.get('/users').then(function (res) { success(res.data); }, error(error));
            }
        };
    }]);

angular.module('Mesi')
    .factory('Tasks', ['$http', function ($http/*, Socket*/) {
        return {
            getAllForAdmin: function (success, error) {
                return $http.get('/ForAdmin').then(function (res) {
                    return success(res.data);
                }, function (err) {
                    return error(err);
                });
            },
            getUserTasks: function (success, error) {
                return $http.get('/tasks').then(function (res) {
                    return success(res.data);
                }, function (err) {
                    return error(err);
                });
            },
            unAssignTask: function (data, success, error) {
                return $http.get('/unAssignTask', { params: data }).then(function (res) {
                    return success(res.data);
                }, function (err) {
                    return error(err);
                });
            },
            assignTask: function (data, success, error) {
                return $http.get('/assignTask', { params: data }).then(function (res) {
                    return success(res.data);
                }, function (err) {
                    return error(err);
                });

            },
            addTask: function (newtask, success, error) {

                return $http({ method: 'POST', url: '/addtask', data: newtask }).then(function (res) {
                    return success(res.data);
                }, function (err) {
                    return error(err);
                });
            },
            updateTask: function (task, success, error) {
                console.log('trying to  save status ' + task.status);
                try {
                    return $http.put('/task/' + task._id, task).then(function (res) {
                        return success(res.data);
                    }, function (err) {
                        return error(err);
                    });
                } catch (err) {
                    console.log(err)
                }
            },
            updateTaskSummary: function (task, success, error) {
                console.log('trying to  save status ' + task.status);
                try {
                    return $http.put('/updatetaskSummary/' + task._id, task).then(function (res) {
                        return success(res.data);
                    }, function (err) {
                        return error(err);
                    });
                } catch (err) {
                    console.log(err)
                }
            },
            removeUnassignedTask: function (task, success, error) {
                return $http.delete('/unassignedtask/' + task._id).then(function (res) {
                    return success(res.data);
                }, function (err) {
                    return error(err);
                });
            }
        };
    }]);
//socket
angular.module('Mesi')
    .factory('Socket', ['$rootScope', '$location', function ($rootScope, $location) {
        var socket = io.connect($location.host());
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }
        };

    }]);