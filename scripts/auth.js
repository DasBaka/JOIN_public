function logIn() {
   checkLogin();
   return false;
}

function checkLogin() {
   let loginMail = document.getElementById('form-email').value;
   let pw = document.getElementById('form-password').value;
   for (let i = 0; i < users.length; i++) {
      let e = users[i];
      if (e.mail == loginMail) {
         if (e.password == pw) {
            console.log('success');
            window.location.href = 'summary.html';
         } else {
            console.log('wrong pw');
            return false;
         }
      }
   }
   console.log('no match');
   return false;
}
