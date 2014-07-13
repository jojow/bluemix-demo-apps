// Cloud Foundry environment variables
var port = process.env.VCAP_APP_PORT || process.env.PORT || 3000;
var services = JSON.parse(process.env.VCAP_SERVICES);
var mongoAddress = services.mongolab[0].credentials.uri;

// Mongo client
var MongoClient = require('mongodb').MongoClient;

// Chat log
var log = function(user, message) {
  MongoClient.connect(mongoAddress, function(err, db) {
    if (err) throw err;

    var collection = db.collection('chatlog');

    collection.insert({ timestamp: new Date().getTime(),
                        user: user,
                        message: message }, function(err, docs) {
      db.close();
    });
  });
}

// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
    log(socket.username, data);
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
    log('SYSTEM', 'user joined: ' + username);
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
    log('SYSTEM', 'user left: ' + socket.username);
  });
});
