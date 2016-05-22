var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    usernames = [];
    
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');

server.listen(app.get('port'), app.get('ip'), function() {
    console.log('Express Server listening on port ' + app.get('port'));
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    function updateUserNames() {
        io.sockets.emit('usernames', usernames);
    }
    
    socket.on('new user', function(data, callback) {
        if(usernames.indexOf(data) != -1) {
            callback({
                isValid: false,
                message: 'This username is already taken!'
            });
        } else if(data !== '') {
            callback({
                isValid: true,
                message: 'Succesfully logged in!'
            });
            socket.username = data;
            usernames.push(socket.username);
            updateUserNames();
        } else {
            callback({
                isValid: false,
                message: 'This username is invalid!'
            });
        }
    });
    
    socket.on('send message', function(data) {
        io.sockets.emit('new message', {
            msg: data,
            user: socket.username
        });
    });
    
    socket.on('disconnect', function(data) {
        if(!socket.username) {
            return;
        }
        
        usernames.splice(usernames.indexOf(socket.username), 1);
        updateUserNames();
    });
});