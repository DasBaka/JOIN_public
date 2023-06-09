async function init() {
   loadUsers();
}

async function loadUsers() {
   try {
      users = JSON.parse(await getItem('users'));
   } catch (e) {
      console.info('Could not load users');
   }
}

function login() {
   let loginMail = document.getElementById('form-email').value;
   let pw = document.getElementById('form-password').value;
   for (let i = 0; i < users.length; i++) {
      let e = users[i];
      if (e.mail == loginMail) {
         if (e.password == pw) {
            window.location.href = 'summary.html'; // success
         } else {
            return false; // wrong password
         }
      } // user still not found
   }
   return false; // user not found
}

async function createNewUser() {
   let regBtn = document.getElementById('sign-up-btn');
   regBtn.disabled = true;
   let newUser = {
      name: getFormValue('form-name'),
      mail: getFormValue('form-email'),
      password: getFormValue('form-password'),
      color: '#ffffff',
      phone: '',
   };
   users.push(newUser);
   await setItem('users', JSON.stringify(users));
   formSuccess(regBtn);
}

function formSuccess(regBtn) {
   document.getElementById('sign-up-form').reset();
   regBtn.innerHTML = 'Done!';
   regBtn.disabled = false;
}

function refreshButton() {
   if (document.getElementById('sign-up-btn').disabled != true) {
      document.getElementById('sign-up-btn').innerHTML = 'Sign up';
   }
}
