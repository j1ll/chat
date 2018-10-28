
window.addEventListener("load", function () {
  var logoutForm = document.forms['logout-form'];
  var logoutBtn = document.getElementById('logout-btn');
  function sendData() {
    var XHR = new XMLHttpRequest();
    
    XHR.addEventListener("error", function(event) {
      alert('Oops! Something went wrong.');
    });
    XHR.addEventListener("load", function (event) {
      console.dir(event.targer)
    });
    
    XHR.open("POST", "/logout");
    XHR.setRequestHeader("X-Requested-With","XMLHttpRequest");
    XHR.send();
  }
  
  logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();
    // alert("sdfdsf");
    // sendData(event);
    logoutForm.submit();
  });
});