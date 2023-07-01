/**
 * Start of the user authentification -> Generates a check-object.
 * @param {boolean} mailNeeded - Is registered mail needed?
 * @param {boolean} pwCheck - Has the script to check for password?
 */
function login(mailNeeded, pwCheck) {
   let check = {
      loginMail: document.getElementById('form-email') || '',
      pw: document.getElementById('form-password') || '',
      form: document.getElementById('login-form') || '',
   };
   prepareUserCheck(check, mailNeeded, pwCheck);
}

/**
 * Determines the method of user verification.
 * @param {object} check - form data
 * @param {boolean} mailNeeded - Is registered mail needed?
 * @param {boolean} pwCheck - Has the script to check for password?
 */
function prepareUserCheck(check, mailNeeded, pwCheck) {
   for (let i = 0; i < users.length; i++) {
      let e = users[i];
      let limit = i == users.length - 1;
      if (mailNeeded) {
         // leads to either "forget password" or "login"
         if (checkUser(e, check, pwCheck, limit)) {
            break;
         }
      } else if (!mailNeeded) {
         // leads to "sign up"
         if (prepareSignUpCheck(e, check, limit)) {
            break;
         }
      }
   }
}

/**
 * Determines, if the given data is eligible for creating a new account.
 * @param {object} e - checked user data
 * @param {object} check - form data
 * @param {boolean} limit - End of user array reached?
 * @returns - If duplicate -> returns true to break the for-loop of the parent-function.
 */
function prepareSignUpCheck(e, check, limit) {
   if (isMailCorrect(e, check)) {
      // leads to "user already exists"
      isDuplicate(check);
      return true;
   } else if (limit) {
      // no user (duplicate) found -> eligible to create a new account
      createNewUser();
      return true;
   }
}

/**
 * Reports invalid form data.
 * @param {object} check - form data
 */
function isDuplicate(check) {
   check.loginMail.setCustomValidity('Mail does already exist!');
   check.form.reportValidity();
}

/**
 * Resets custom form validation.
 */
function resetFormValidation() {
   document.getElementById('form-email').setCustomValidity('');
   document.getElementById('form-password').setCustomValidity('');
}

/**
 * Determines further the method of user verification.
 * @param {object} user - checked user data
 * @param {object} check - form data
 * @param {boolean} pwCheck - Has the script to check for password?
 * @param {boolean} limit - End of user array reached?
 * @returns - If duplicate -> returns true to break the for-loop of the parent-function.
 */
function checkUser(user, check, checkPW, limit) {
   if (isMailCorrect(user, check) && checkPW) {
      // mail is registerd & need to check the corresponding user password
      checkPassword(user, check);
      return true;
   } else if (!checkPW) {
      // no need to check password (because user has forgotten his password...)
      if (isMailCorrect(user, check)) {
         // mail is registered
         document.getElementById('modal').showModal(); // Opens Modal with dummy-message ("An E-Mail has been sent to you") and redirects to password-reset on close.
         return true;
      } else userNotFoundResponse(check, limit); // no registered mail found
   } else userNotFoundResponse(check, limit); // no registered mail found
}

/**
 * Redirects for password reset with the given user informations.
 */
function redirectForReset() {
   let query = new URLSearchParams();
   query.append('mail', encodeURI(document.getElementById('form-email').value));
   location.href = 'reset-password.html?' + query.toString();
}

/**
 * Resets the user password (aka saves a new one), only if the verification does not fail.
 */
function resetPassword() {
   let pw = document.getElementById('form-password');
   let check = document.getElementById('form-password-confirmation');
   if (pw.value == check.value) {
      let mail = decodeURIComponent(window.location.search.split('?mail=')[1]);
      let id = getIndexOfValue(users, 'mail', mail);
      users[id].password = pw.value;
   } else {
      check.setCustomValidity('Does not match');
      document.getElementById('login-form').reportValidity();
   }
}

/**
 * Reports invalid form data (if user array end is reached)
 * @param {object} check - form data
 * @param {boolean} limit - End of user array reached?
 */
function userNotFoundResponse(check, limit) {
   if (limit) {
      check.loginMail.setCustomValidity('User not found');
      check.form.reportValidity();
   }
}

/**
 * Returns, if mail input were found inside the user array.
 * @param {object} user - checked user data
 * @param {object} check - form data
 * @returns - true/false
 */
function isMailCorrect(user, check) {
   return user.mail == check.loginMail.value;
}

/**
 * Either let the user login on correct user verification or reports invalidation.
 * @param {object} user - checked user data
 * @param {object} check - form data
 */
function checkPassword(user, check) {
   if (user.password == check.pw.value) {
      loginData = user;
      window.location.href = 'summary.html'; // success
   } else {
      check.pw.setCustomValidity('Wrong password');
      check.form.reportValidity(); // wrong password
   }
}

/**
 * Creates a new user.
 */
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
   formSuccess(regBtn);
}

/**
 * Resets sign-up-form and gives a visual feedback.
 * @param {id} regBtn - id for visual feedback
 */
function formSuccess(regBtn) {
   document.getElementById('login-form').reset();
   regBtn.innerHTML = 'Done!';
   regBtn.disabled = false;
   setTimeout(() => {
      window.location.href = 'log-in.html';
   }, 500);
}

/**
 * Redo the visual feedback of the sign-up-form.
 */
function refreshButton() {
   if (document.getElementById('sign-up-btn').disabled != true) {
      document.getElementById('sign-up-btn').innerHTML = 'Sign up';
   }
}
