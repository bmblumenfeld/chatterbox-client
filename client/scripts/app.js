
var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/',
  messages: []
};
app.init = function() {
  setInterval(this.fetch.bind(this), 1000);
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
  // var date = new Date('August 19, 1975 23:15:30 UTC');
  // date = date.toJSON();
  // var url = this.server + '?where={"createdAt":{"$lt":' + date + '}}';
  // var params = {
  //   "createdAt": {
  //     "$all": {}
  //   }
  // };
  // var params = {
  //   "$all": {
  //   }
  // };
  //url += JSON.stringify(params);
  // console.log(url);
  $.ajax({
    url: this.server,
    type: 'GET',
    dataType: 'json',
    data: 'order=-createdAt',
    //success: ({results}) => {
    success: ({results}) => {
      //console.log(data); 

      console.log(results);
      var newestMsgId = this.messages.length ? this.messages[this.messages.length - 1].objectId : null;
      // console.log(this.messages);
      // console.log(newestMsgId);
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
        //gets date in readable format 
        var date = new Date(this.messages[this.messages.length - 1].createdAt);
        date = date.toString();
        date = date.slice(0, 15);
        var message = {
          username: this.messages[this.messages.length - 1].username,
          text: this.messages[this.messages.length - 1].text,
          roomname: this.messages[this.messages.length - 1].roomname,
          date: date   
        };
        this.renderMessage(message);
      }
    }
  });
};
app.renderMessage = function ({username, text, roomname, date}) {
  var $chats = $('#chats');
  var $chat = $('<div class = "chat">\
  <header class = "header"><div class = "username"></div><div class = "date"></div><div class = "roomname"></div></header><div class = "msg"></div></div>');
  $chat.find('.username').text(username);
  $chat.find('.date').text(date);
  $chat.find('.msg').text(text);
  $chat.find('.roomname').text(roomname);
  $chat.prependTo($chats);  
    
};
app.clearMessages = function () {
  $('#chats').empty();  
};

app.renderRoom = function () {
  var $rooms = $('#roomSelect');
  var $room = $('<div class = "room"></div>');
  $rooms.append($room);  
};
app.handleUsernameClick = function () {
  alert("you really made a friend!");  
};
$(document).ready(function() {
  $('#submit').on('click', function(event) {
    var msg = {
      username: 'KevinLamFan',
      text: $('#message').val(),
      roomname: 'All Kevin All The Time'
    };
    msg = JSON.stringify(msg);
    app.send(msg);
  });
  $('#chats').on('click','.username', function(event) {
    app.handleUsernameClick.bind(window);
  }); 
});
app.init();