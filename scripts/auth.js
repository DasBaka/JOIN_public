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

function login(mailNeeded, pwCheck) {
   let check = {
      loginMail: document.getElementById('form-email') || '',
      pw: document.getElementById('form-password') || '',
      form: document.getElementById('login-form') || '',
   };
   prepareUserCheck(check, mailNeeded, pwCheck);
}

function prepareUserCheck(check, mailNeeded, pwCheck) {
   for (let i = 0; i < users.length; i++) {
      let e = users[i];
      let limit = i == users.length - 1;
      if (mailNeeded) {
         if (checkUser(e, check, pwCheck, limit)) {
            break;
         }
      } else if (!mailNeeded) {
         if (prepareSignUpCheck(e, check, limit)) {
            break;
         }
      }
   }
}

function prepareSignUpCheck(e, check, limit) {
   if (isMailCorrect(e, check)) {
      isDuplicate(check);
      return true;
   } else if (limit) {
      createNewUser();
   }
}

function isDuplicate(check) {
   check.loginMail.setCustomValidity('Mail does already exist!');
   check.form.reportValidity();
}

function resetFormValidation() {
   document.getElementById('form-email').setCustomValidity('');
   document.getElementById('form-password').setCustomValidity('');
}

function checkUser(user, check, checkPW, limit) {
   if (isMailCorrect(user, check) && checkPW) {
      checkPassword(user, check);
      return true;
   } else if (!checkPW) {
      if (isMailCorrect(user, check)) {
         resetPassword();
         return true;
      } else userNotFoundResponse(check, limit);
   } else userNotFoundResponse(check, limit);
}

function resetPassword() {
   confirm('Mail was sent!');
}

function userNotFoundResponse(check, limit) {
   if (limit) {
      check.loginMail.setCustomValidity('User not found');
      check.form.reportValidity();
   }
}

function isMailCorrect(user, check) {
   return user.mail == check.loginMail.value;
}

function checkPassword(user, check) {
   if (user.password == check.pw.value) {
      window.location.href = 'summary.html'; // success
   } else {
      check.pw.setCustomValidity('Wrong password');
      check.form.reportValidity(); // wrong password
   }
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
   document.getElementById('login-form').reset();
   regBtn.innerHTML = 'Done!';
   regBtn.disabled = false;
}

function refreshButton() {
   if (document.getElementById('sign-up-btn').disabled != true) {
      document.getElementById('sign-up-btn').innerHTML = 'Sign up';
   }
}
