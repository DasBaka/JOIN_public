//setURL("http://f015901e@gruppenarbeit-493-join.developerakademie.net/smallest_backend_ever-master');

let users = [
   {
      name: 'Anton Mayer',
      mail: 'antom@gmail.com',
      color: '#000000',
   },
   {
      name: 'Anja Schulz',
      mail: 'schulz@hotmail.com',
      color: '#000000',
   },
   {
      name: 'Benedikt Ziegler',
      mail: 'benedikt@gmail.com',
      color: '#000000',
   },
   {
      name: 'David Eisenberg',
      mail: 'davidberg@gmail.com',
      color: '#000000',
   },
   {
      name: 'Eva Fischer',
      mail: 'eva@gmail.com',
      color: '#000000',
   },
   {
      name: 'Emmanuel Maurer',
      mail: 'emmanuelma@gmail.com',
      color: '#ffffff',
   },
   {
      name: 'Marcel Bauer',
      mail: 'bauer@gmail.com',
      color: '#ffffff',
   },

   {
      name: 'Jonas Holl',
      mail: 'jh1234@gmail.com',
      color: '#ffffff',
   },

   {
      name: 'Johannes Baum',
      mail: 'treethree@gmail.com',
      color: '#abcdef',
   },
   {
      name: 'Friedrich Mai',
      mail: 'f82mai@gmail.com',
      color: '#ffffff',
   },
   {
      name: 'Stefanie Sauer',
      mail: 'sauermachtlustig@gmail.com',
      color: '#ffffff',
   },
];

let groupedUsers;
sortContacts();
addGroup();
groupedUsers = Object.values(groupItems(users, 'letter'));

function contactListHandler() {
   document
      .getElementById('contact-list-wrapper')
      .addEventListener('click', (event) => {
         clickOnCard(event);
      });
   document
      .getElementById('contact-list-wrapper')
      .addEventListener('click', (event) => {
         console.log(event.target.classList.contains('outside-trigger'));
         if (event.target.classList.contains('outside-trigger')) {
            initContainer('contact-details');
            uncheckBtns();
            toggleSlideAnimationRight('contact-details', 1);
         }
      });
}

function clickOnCard(event) {
   for (let i = 0; i < groupedUsers.length; i++) {
      for (let j = 0; j < groupedUsers[i]['value'].length; j++) {
         if (event.target.id === 'contact-btn-' + i + '-' + j) {
            showContactCard(i, j);
         }
      }
   }
}

/**
 * Render function for the contact list.
 */
function renderContacts() {
   initContainer('contact-list-wrapper');
   for (let i = 0; i < groupedUsers.length; i++) {
      addIntoContainer(
         'contact-list-wrapper',
         `<h4 class="contact-list-divider outside-trigger">${groupedUsers[i]['group']}</h4>`
      );
      let contactArray = groupedUsers[i]['value'];
      for (let j = 0; j < contactArray.length; j++) {
         addIntoContainer(
            'contact-list-wrapper',
            contactCardTemplate(contactArray[j], i, j)
         );
      }
   }
}

//Container-Functions
/**
 * Empties the innerHTML of the desired container.
 * @param {string} id - container id
 */
function initContainer(id) {
   let container = document.getElementById(id);
   container.innerHTML = '';
}

/**
 * Fills the innHTML of the desired container with the chosen input.
 * @param {*} id - container id
 * @param {*} content - HTML input
 */
function addIntoContainer(id, content) {
   let container = document.getElementById(id);
   container.innerHTML += content;
}

//Contact-Manipulation and -Interaction
/**
 * Sorts the users array.
 */
function sortContacts() {
   users.sort(function (a, b) {
      if (a.name.toUpperCase() < b.name.toUpperCase()) {
         return -1;
      }
      if (a.name.toUpperCase() > b.name.toUpperCase()) {
         return 1;
      }
      return 0;
   });
}

/**
 * Returns the inital Letter of a name or surname.
 * @param {string} name - Name
 * @param {number} pos - Position (most: 0)
 * @returns
 */
function initialLetter(name, pos) {
   return name.name.charAt(pos);
}

/**
 * Adds the "letter"-group.
 */
function addGroup() {
   users.forEach((element) => {
      element['letter'] = initialLetter(element, 0);
   });
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

//Color-Interaction
/**
 * Changes the (text) color based on the background-color. Recommended threshhold: 145 - 190;
 * @param {HEXcolor} bgColor - color as HEX-format
 * @returns - Returns "white" or "black" as HEX-color
 */
function responsiveColor(bgColor) {
   let colorRGB = hexToRgb(bgColor);
   let threshhold = 150;
   if (
      colorRGB.r * 0.299 + colorRGB.g * 0.587 + colorRGB.b * 0.114 >
      threshhold
   ) {
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

//Button-Functions for Contacts
/**
 * Initialize and renders the contact details of the clicked contact.
 * @param {number} groupId - Identifier of the group (in the grouped array).
 * @param {number} contactId - Identifier of the contact (in the group value).
 */
function showContactCard(groupId, contactId) {
   initContainer('contact-details');
   toggleBoxes(groupId, contactId);
}

/**
 * Toggles a helper class for the checkboxes.
 * @param {number} groupId - Identifier of the group (in the grouped array).
 * @param {number} contactId - Identifier of the contact (in the group value).
 */
function toggleBoxes(groupId, contactId) {
   let btn = document.getElementById(
      'contact-btn-' + groupId + '-' + contactId
   );
   if (btn.classList.contains('checked')) {
      uncheckBtns();
      toggleSlideAnimationRight('contact-details', 1);
   } else if (
      document.querySelectorAll('input[type=radio].checked').length > 0
   ) {
      justRemoveClass();
      implementCard(btn, groupId, contactId);
   } else {
      implementCard(btn, groupId, contactId);
      toggleSlideAnimationRight('contact-details', 1);
   }
}

function implementCard(btn, groupId, contactId) {
   addIntoContainer(
      'contact-details',
      contactDetailsTemplate(
         groupedUsers[groupId]['value'][contactId],
         groupId,
         contactId
      )
   );
   btn.classList.add('checked');
}

function justRemoveClass() {
   let boxes = document.querySelectorAll('input[type=radio]');
   for (let i = 0; i < boxes.length; i++) {
      boxes[i].classList.remove('checked');
   }
}

/**
 * Checks, if the clicked button is checked and unchecks every other checkbox if not.
 * @param {element} btn - Actual contact element.
 * @param {element} boxes - All Checkboxes.
 */
function uncheckBtns() {
   let boxes = document.querySelectorAll('input[type=radio]');
   for (let i = 0; i < boxes.length; i++) {
      boxes[i].classList.remove('checked');
      boxes[i].checked = false;
   }
}

function toggleSlideAnimationRight(id, num) {
   document.getElementById(id).classList.toggle('display-none');
   document.getElementById(id).classList.toggle('animate-right' + num);
}

function toggleParent(id) {
   document
      .getElementById(id)
      .parentElement.classList.toggle('display-none');
}

//Templates
function contactCardTemplate(user, i, j) {
   return /*html*/ `
  <input type="radio" name="contact-list-btns" id="contact-btn-${i}-${j}" class="contact-btn">
  <label for="contact-btn-${i}-${j}" class="contact-wrapper">
      <div id="user-icon-${i}-${j}" class="user-icon" ${colorContactIcon(
      user
   )}>${initialLetter(user, 0)}${initialLetter(
      user,
      user.name.search(' ') + 1
   )}</div>
      <div class="contact-details">
          <h4>${user.name}</h4>
          <h6 style="color: #007cee">${user.mail}</h6>
      </div>
  </div>
  `;
}

function contactDetailsTemplate(user, i, j) {
   return /*html*/ `
  <div class="contact-wrapper">
    <div id="user-icon-${i}-${j}" class="user-icon user-icon-big" ${colorContactIcon(
      user
   )}>${initialLetter(user, 0)}${initialLetter(
      user,
      user.name.search(' ') + 1
   )}</div>
    <div class="contact-details flex-column contact-details-big">
      <h2>${user.name}</h2>
      <div>
        <h5 style="color: #29abe2"><img src="assets/img/blue_cross.png"/>Add Task</h5>
      </div>
    </div>
  </div>
  <div>
    <div class="contact-details-card-title">
      <h4>Contact Information</h4>
      <span><img src="assets/img/edit.png"/>Edit Contact</span>
    </div>
    <div class="contact-details-card">
      <h6><b>Email</b></h6>
      <h6 style="color: #007cee">${user.mail}</h6>
      <h6><b>Phone</b></h6>
      <h6>1234567890</h6>
    </div>    
  </div>  `;
}

function colorContactIcon(user) {
   return (
      `style="background-color:` +
      user.color +
      `; color:` +
      responsiveColor(user.color) +
      `";`
   );
}
