window.addEventListener("load", function () {
  
  var storageForm = document.forms['storage-form'];
  var chatInput = storageForm.elements['storagedata'];
  var submitButton = storageForm.elements['submitbutton'];
  var clearButton = storageForm.elements['clearbutton'];
  
  window.addEventListener('storage', function(e) {
    console.dir(e);
  });
  
  function setStorageData(event){
    event.preventDefault();
    console.log('SET');
    var text = chatInput.value;
    localStorage.setItem('superpower', text);
    event.target.reset();
  }
  
  storageForm.addEventListener("submit", setStorageData);
  clearButton.addEventListener("click", function (event) {
    console.log('CLEAR');
    localStorage.clear();
  });
});