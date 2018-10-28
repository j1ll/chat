
window.addEventListener("load", function () {
  var loginForm = document.forms['login-form'];
  var errorMessage = document.getElementById('error-message');
  function sendData() {
    var XHR = new XMLHttpRequest();
    
    var FD = new FormData(loginForm);
    
    
    XHR.addEventListener("load", function(event) {
      switch (event.target.status){
        case 200:
          // let link = "/api/users/"+event.target.responseText;
          let link = "/chat";
          window.location.href = link;
          break;
        case 403:
          errorMessage.insertAdjacentHTML('afterBegin', JSON.parse(event.target.responseText).message);
          break;
      }
    });
    
    // Define what happens in case of error
    XHR.addEventListener("error", function(event) {
      alert('Oops! Something went wrong.');
    });
    
    // Set up our request
    XHR.open("POST", "/login");
    XHR.setRequestHeader("X-Requested-With","XMLHttpRequest");
    // The data sent is what the user provided in the form
    XHR.send(FD);
  }
  
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    sendData(event);
  });
});