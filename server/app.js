var http = require('http').createServer();
var io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('[Connect] Incoming connection...');
    setTimeout(function() {
        console.log("sending data");
        socket.emit('news', {});
    }, 1000);
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});
