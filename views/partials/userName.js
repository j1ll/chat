window.addEventListener("load", function () {
  var usernameTextNode = document.getElementById('username').firstChild;
  localStorage.setItem('username',usernameTextNode.data||'anon');
  
  window.setUser = function(newusername){
    let usernameStr = (JSON.stringify(newusername||'anon').slice(1,-1));
    let currentUsername = localStorage.getItem('username');
    if(currentUsername!==usernameStr){
      localStorage.setItem('username', usernameStr);//имя будет обновлено в остальных вкладках тоже
      usernameTextNode.data = usernameStr;
      return usernameStr;
    }
    return false;
  };
  
  window.addEventListener('storage', function(e) { //при каких-либо изменениях на других вкладках
    let newUsername = localStorage.getItem('username');
    if(!newUsername){
      newUsername = 'anon';
      localStorage.setItem('username',newUsername);
    }
    usernameTextNode.data =newUsername;
  });
});