window.addEventListener("load", function () {
  var socket = (io({reconnectionAttempts:3}));
  var chatMessages = document.getElementById('chat-messages');
  function addMessage(message, system) {
    var newElem = document.createElement('li');
    newElem.classList.add(system?'notification-message':'chat-message');
    newElem.appendChild(document.createTextNode(message));
    chatMessages.appendChild(newElem);
  }
 
  
  var chatForm = document.forms['chat-form'];
  var chatInput = chatForm.elements['message1'];
  var submitButton = chatForm.elements['submitbutton'];
  var reconnectButton = document.getElementById('reconnect-button');
  
  function sendSubmittedMessage(event) {
    event.preventDefault();
    if(socket.connected){
      var text = chatInput.value;
      var username = localStorage.getItem('username');
      addMessage("sending:"+text+" as "+ username, true);
      /*socket.emit('checkUsername',function (dbusername) {
      })*/
      function cb(newUsername) {
        if(newUsername){
          addMessage("wasn't sent", true);
          window.setUser(newUsername)
        } else {
          event.target.reset();
        }
      }
      socket.emit('message',username, text, cb);
      //
      
    }
  }

  function handleConnection() {
    addMessage("соединение установлено", true);
    submitButton.removeAttribute('disabled');
    socket.emit('checkUsername',window.setUser);
  }
  function handleDisconnection(reason) {
    addMessage("соединение потеряно", true);
    submitButton.setAttribute('disabled','');
  }
  
  chatForm.addEventListener("submit", sendSubmittedMessage);
  reconnectButton.addEventListener("click", function (event) {
    console.log('reconnect');
    reconnectButton.setAttribute('disabled','');
    socket.open();
  });
  
  socket
  .on('message', (username,message)=>addMessage(username+"> "+message))
  .on('connect',handleConnection)
  .on('disconnect', handleDisconnection)
  .on('reconnect_failed',()=>{
    alert('reconnect_failed'); 
    reconnectButton.removeAttribute("disabled");
  })
/*  .on('confirmUsername',(username,cb)=> {
    let changedUsername = window.setUser(username);
    if(changedUsername) {
      addMessage('now you are '+changedUsername);
      cb(false);
    } else {cb&&cb()}
  })*/
  .on('error',(error)=>{
    console.error(error);
    if (window.confirm(error+". Reload this page?")){
      window.location.reload(true);
    }
  });
});