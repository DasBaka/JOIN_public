let login_status = false;
let formDropDownConfig = [];

/**
 * Prepares and renders templates
 */
async function initialPageLoad() {
   await includeHTML().then(() => {
      if (isTaskJSneeded()) {
         // Promise needed, to "init" "add-task-form" AFTER it is loaded/included.
         // task.js is needed to render the "add-task-form", but is not necessary for other loaded sites.
         initAddTaskForm();
      }
   });
   activeNavElement();
}

/**
 * Checks, if the add-task-form is needed.
 * @returns - true/false
 */
function isTaskJSneeded() {
   return document.querySelectorAll("[include-html='templates/add-task-form.html']").length > 0;
}

function initialRedirect() {
   if (login_status == false) {
      window.location.href = 'log-in.html';
   } else {
      window.location.href = 'summary.html';
   }
}

/**
 * Repeats the includeHTML-function (normally after the initialPageLoad) to display a template inside the modal.
 * @param {string/link} link - link to the HTML-file
 */
async function repeatPageLoadForModal(link) {
   let modal = document.getElementById('modal');
   if (link) {
      modal.setAttribute('include-html', link);
   }
   await includeHTML();
}

/**
 * Searches for a not-used id inside an array (-> to fill gaps after deleting an object inside this array).
 * @param {array} arr - target array
 * @param {letter} prefix - each array has a specific id-prefix to identify them
 * @param {num} pad - padding: determines the maximum id number and the padding to format it with filler-zeros
 * @returns - free id
 */
function findFreeId(arr, prefix, pad) {
   let limit = Math.pow(10, pad) - 1;
   for (let i = 1; i < limit; i++) {
      let id = prefix + String(i).padStart(pad, '0');
      if (getIndexOfValue(arr, 'id', id) == -1) {
         return id;
      }
   }
}

/**
 * Includes html templates.
 */
async function includeHTML() {
   let includeElements = document.querySelectorAll('[include-html]');
   for (let i = 0; i < includeElements.length; i++) {
      const element = includeElements[i];
      file = element.getAttribute('include-html');
      let resp = await fetch(file);
      if (resp.ok) {
         element.innerHTML = await resp.text();
      } else {
         element.innerHTML = 'Page not found';
      }
   }
}

/**
 * Highlightes the current site inside the navigation bar.
 */
function activeNavElement() {
   let navElements = ['summary', 'board', 'add-task', 'contacts', 'legal-notice'];
   for (let i = 0; i < navElements.length; i++) {
      const element = navElements[i];
      if (window.location.pathname.includes(element)) {
         document.getElementById('nav-element-' + element).classList.add('nav-element-active');
      }
   }
}

/**
 * Toggles the logout screen.
 */
function logOutButtonVisibility() {
   let element = document.getElementById('log-out-button').classList;
   element.toggle('display-none');
}
/**
 * Capitalizes the first letter of a string.
 * @param {string} string
 * @returns - string (1 character)
 */
function capitalizeFirstLetter(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Returns the inital Letter of a name or surname.
 * @param {string} name - user
 * @param {number} pos - Position (most: 0)
 * @returns string (1 character)
 */
function initialLetter(name, pos) {
   return name.name.charAt(pos);
}

/**
 * Returns the first character of the first and second string/user.name in UpperCase.
 * @param {string} name - user
 * @returns - string (2 characters)
 */
function initialLettersUpperCase(name) {
   let rename = name;
   rename.name = replacer(rename.name);
   let result = initialLetter(rename, 0); // firstname
   if (rename.name.search(' ') + 1 != 0) {
      result += initialLetter(name, name.name.search(' ') + 1); // lastname
   }
   return result.toUpperCase();
}

/**
 * Deletes leading spaces.
 * @param {string} txt
 * @returns - same string without leading spaces
 */
function replacer(txt) {
   return txt.replace(/^\s+/g, '');
}

//Color-Interaction
/**
 * Changes the (text) color based on the background-color. Recommended threshhold: 145 - 190;
 * @param {HEXcolor} bgColor - color as HEX-format
 * @returns - Returns "white" or "black" as HEX-color
 */
function responsiveColor(bgColor) {
   let colorRGB = hexToRgb(bgColor);
   let threshhold = 150;
   if (colorRGB.r * 0.299 + colorRGB.g * 0.587 + colorRGB.b * 0.114 > threshhold) {
      return '#000000';
   } else {
      return '#ffffff';
   }
}

/**
 * Formats and splits HEX-color into RGB-values
 * @param {HEXcolor} hex - color as HEX-format
 * @returns - returns values for red, green and blue.
 */
function hexToRgb(hex) {
   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   return result
      ? {
           r: parseInt(result[1], 16),
           g: parseInt(result[2], 16),
           b: parseInt(result[3], 16),
        }
      : null;
}

/**
 * Renders the contact icon of an user.
 * @param {JSON-Object} user - user-data
 * @returns - style
 */
function colorContactIcon(user) {
   return (
      `style="background-color:` +
      user.color +
      `; color:` +
      responsiveColor(user.color) +
      `; border-color:` +
      responsiveColor(user.color) +
      `";`
   );
}

/**
 * Sorts the an array (most: users).
 */
function sort(arr, key) {
   arr.sort(function (a, b) {
      if (a[key].toUpperCase() < b[key].toUpperCase()) {
         return -1;
      }
      if (a[key].toUpperCase() > b[key].toUpperCase()) {
         return 1;
      }
      return 0;
   });
}

/**
 * Returns an index within the desired preferences.
 * @param {array} array - array to search in
 * @param {key} key - key identifier to specify the search
 * @param {*} value - search value to search for
 * @returns - index/number
 */
function getIndexOfValue(array, key, value) {
   return array.findIndex((k) => k[key] === value);
}

/**
 * Returns an index within the desired preferences.
 * @param {array} array - array to search in
 * @param {key} key - key identifier to specify the search
 * @param {*} ref - search value to search for
 * @returns - index/number
 */
function getIndexOfValueLowerCase(array, key, ref) {
   return array.findIndex((e) => e[key].toLowerCase() == ref);
}

/**
 * Return the value of a form input.
 * @param {id} id - input id
 * @returns - value
 */
function getFormValue(id) {
   return document.getElementById(id).value;
}

/**
 * Changes the value of a form input.
 * @param {id} id - id
 * @param {*} content - new value (most: "")
 */
function letFormValue(id, content) {
   document.getElementById(id).value = content;
}

/**
 * Short: Changes the innerHTML of the id.
 * @param {id} id - id
 * @param {html} content - HTML or template to insert.
 */
function letInnerHTML(id, content) {
   document.getElementById(id).innerHTML = content;
}

/**
 * Closes the modal (dialog).
 */
function closeModal() {
   let modal = document.getElementById('modal');
   if (modal != null) {
      modal.close();
   }
}

/**
 * Groups an arrays based on the desired key/property.
 * @param {array} array - Ungrouped raw array
 * @param {string} key - Desired key/property to group every item in the array.
 * @returns - ! Returns an object. Use Object.values to get an array with the form {group: ..., values: ...} !
 */
function groupItems(array, key) {
   return array.reduce((acc, element) => {
      let group = element[key];
      if (!acc[group]) {
         acc[group] = { group, value: [element] };
      } else {
         acc[group].value.push(element);
      }
      return acc;
   }, {});
}

function addModalCloseButton() {
   document.getElementById('modal').innerHTML += /*html*/ `
   <div class="task-detailed-close-button" onclick="closeModal()">
      <img src="assets/img/cross.svg" alt="cross icon">
   </div>`;
}
