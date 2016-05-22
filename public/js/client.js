jQuery (function($) {
    var socket = io.connect();
    var $messageBox = $('.messageBox');
    var $yourNameForm = $('#yourName');
    var $userError = $('.userError');
    var $userName = $('#userName');
    var $yourMessage = $('.yourMessage');
    var $users = $('.userBox');
    
    function messageTemplate(data) {
        var messageTemplate = '<div class="chatMessage">';
            messageTemplate += '<div class="chatMessageHeader">';
            messageTemplate += data.user;
            messageTemplate += '</div>';
            messageTemplate += '<div class="chatMessageContent">';
            messageTemplate += data.msg;
            messageTemplate += '</div>';
            messageTemplate += '</div>';
                              
        return messageTemplate;
    }
    
    $yourNameForm.submit(function(e) {
        e.preventDefault();
        socket.emit('new user', $userName.val(), function(data) {
            if(data.isValid) {
                $('#chatLogin').hide();
                $('#chatContent').show();
            } else {
                $userError.html(data.message);
            }
        });
        $userName.val('');
    });
    
    socket.on('usernames', function(data) {
        if(data.length) {
            var html = '';
            
            for(i = 0; i < data.length; i++) {
                html += "<div class='user'>" + data[i] + '</div>';
            }
            
            $users.html(html);
        }
    })
    
    $yourMessage.on('keydown', function(event) {       
        if(event.which === 13 && event.shiftKey === false) {
            event.preventDefault();
            socket.emit('send message', $yourMessage.val());
            $yourMessage.val('');
        }
    });
    
    socket.on('new message', function(data) {
        $messageBox.append(messageTemplate(data));
    })
})
