var http = require('http').createServer();
var io = require('socket.io')(http);

var players = [];

io.on('connection', function(socket){
    console.log('[Connect] Incoming connection...');

    // Users login
    socket.on('login', function(data) {
        console.log('[Login] ' + data.username + ' logged in');
        socket.emit('login', {
            sucess: true
        });

        var player = {
            username: data.username,
            x: 0,
            y: 0
        };

        players.push(player);
    });
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});
