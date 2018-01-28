
var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/',
  messages: [],
  rooms: {},
  room: null
};
app.getParams = function (name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results === null ? 0 : results[1];
};
app.init = function() {
  var room = this.getParams('room'); 
  console.log('room: ' + room);
  if (room) {
    this.room = room;
    setInterval(this.fetchRoom.bind(this), 1000);
  } else {
    setInterval(this.fetch.bind(this), 1000);
  }
};
app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'POST',
    data: message,
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};
app.fetch = function() {
  $.ajax({
    url: this.server,
    type: 'GET',
    dataType: 'json',
    data: 'order=-createdAt',
    success: ({results}) => {
      //console.log(results);
      var newestMsgId = this.messages.length ? this.messages[this.messages.length - 1].objectId : null;
      var oldestNewMsgIndex = 0;
      if (!newestMsgId) {
        oldestNewMsgIndex = results.length;
      } else {
        while (results[oldestNewMsgIndex].objectId !== newestMsgId) {
          oldestNewMsgIndex++;
        }
      }
      $chats = $('#chats');
      for (var i = oldestNewMsgIndex - 1; i >= 0; i--) {
        this.messages.push(results[i]);
        var room = this.messages[this.messages.length - 1].roomname;
        //console.log(room);
        if (room && !this.rooms[room]) {
          
          this.rooms[room] = room;
          // console.log(this)
          //console.log(room);
          this.renderRoom(room);
        }
        //gets date in readable format 
        var date = new Date(this.messages[this.messages.length - 1].createdAt);
        date = date.toString();
        date = date.slice(0, 15);
        var message = {
          username: this.messages[this.messages.length - 1].username,
          text: this.messages[this.messages.length - 1].text,
          roomname: room,
          date: date   
        };
        this.renderMessage(message);
      }
    }
  });
};
app.fetchRoom = function() {
  $.ajax({
    url: this.server + '?where={"roomname":"' + this.room + '"}',
    type: 'GET',
    dataType: 'json',
    data: 'order=-createdAt',
    success: ({results}) => {
      //console.log(results);
      var newestMsgId = this.messages.length ? this.messages[this.messages.length - 1].objectId : null;
      var oldestNewMsgIndex = 0;
      if (!newestMsgId) {
        oldestNewMsgIndex = results.length;
      } else {
        while (results[oldestNewMsgIndex].objectId !== newestMsgId) {
          oldestNewMsgIndex++;
        }
      }
      $chats = $('#chats');
      for (var i = oldestNewMsgIndex - 1; i >= 0; i--) {
        this.messages.push(results[i]);
        var room = this.messages[this.messages.length - 1].roomname;
        //console.log(room);
        if (room && !this.rooms[room]) {
          
          this.rooms[room] = room;
          // console.log(this)
          //console.log(room);
          this.renderRoom(room);
        }
        //gets date in readable format 
        var date = new Date(this.messages[this.messages.length - 1].createdAt);
        date = date.toString();
        date = date.slice(0, 15);
        var message = {
          username: this.messages[this.messages.length - 1].username,
          text: this.messages[this.messages.length - 1].text,
          roomname: room,
          date: date   
        };
        this.renderMessage(message);
      }
    }
  });
};
app.renderRoom = function (roomname) {
  //console.log('asdfasdgasdgasdgasdgd');
  //console.log('asdfasdgasdgasdgasdgd: ' + roomname);
  roomname = roomname.slice(0, 25);
  var $rooms = $('.roomSelect');
  var $room = $('<a href = "index.html?room=' + roomname + '" class = "room">' + roomname + '</a></br>');
  $room.text(roomname);
  $room.prependTo($rooms);
};
app.renderMessage = function ({username, text, roomname, date}) {
  var $chats = $('#chats');
  
  var $chat = $('<div class = "chat">\
  <header class = "header"><div class = "username"></div><div class = "date"></div><div class = "roomname"></div></header><div class = "msg"></div></div>');
  $chat.find('.username').text(username);
  $chat.find('.date').text(date);
  $chat.find('.msg').text(text.slice(0, 160));
  $chat.find('.roomname').text(roomname);
  $chat.prependTo($chats);  
    
};
app.clearMessages = function () {
  $('#chats').empty();  
};
app.handleUsernameClick = function () {
  console.log("you really made a friend!");  
};
app.handleSubmit = function () {
  var roomname = this.room === null ? 'home' : this.room;
  var msg = {
    username: 'pandasrcool',
    text: $('#message').val(),
    roomname: roomname
  };
  msg = JSON.stringify(msg);
  app.send(msg);
};
$(document).ready(function() {
  $('#submit').on('click', function(event) {
    app.handleSubmit();
  });
  $('body').on('keypress', function(e) {
    var code = e.keyCode || e.which;
    if (code == 13) {
      app.handleSubmit();
    }
  });
  $('#chats').on('click','.username', function(event) {
    app.handleUsernameClick.call(window);
  }); 
});
app.init();