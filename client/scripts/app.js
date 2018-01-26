$(document).ready(function() {
  $('#submit').on('click', function(event) {
    var msg = {
      username: 'poopybutt',
      text: $('#message').val(),
      roomname: 'poopland'
    };
    msg = JSON.stringify(msg);
    app.send(msg);
  });
});
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
    url: url,
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
  var date = new Date('August 19, 1975 23:15:30 UTC');
  date = date.toJSON();
  var url = this.server + '?where={"createdAt":{"$lt":' + date + '}}';
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
  console.log(url);
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',

    //success: ({results}) => {
    success: (data) => {
      console.log(data);

      //console.log(results);
      var newestMsgId = this.messages.length ? this.messages[this.messages.length - 1].objectId : null;
      // console.log(this.messages);
      console.log(newestMsgId);
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
        var $chat = $('<div class = "chat">\
        <div class = "username"></div><div class = "msg"></div></div>');
        $chat.find('.username').text(this.messages[this.messages.length - 1].username);
        $chat.find('.msg').text(this.messages[this.messages.length - 1].text);
        $chat.prependTo($chats);
      }
    }
  });
};
app.init();