//setURL("http://f015901e@gruppenarbeit-493-join.developerakademie.net/smallest_backend_ever-master');
let groupedContacts;
sortContacts();
addGroup();
groupedContacts = Object.values(groupItems(contacts, 'letter'));

/**
 * Render function for the contact list.
 */
function renderContacts() {
   let list = 'contact-list-wrapper';
   initContainer(list);
   initContactList(list);
}

function initContactList(list) {
   for (let i = 0; i < groupedContacts.length; i++) {
      addIntoContainer(list, alphabeticalContactDividerTemplate(i));
      initContacts(list, i);
   }
}

function initContacts(list, i) {
   let contactArray = groupedContacts[i]['value'];
   for (let j = 0; j < contactArray.length; j++) {
      addIntoContainer(list, contactCardTemplate(contactArray[j], i, j));
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

//Contact-Manipulation and -Interaction
/**
 * Sorts the Contacts array.
 */
function sortContacts() {
   contacts.sort(function (a, b) {
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
 * Adds the "letter"-group.
 */
function addGroup() {
   contacts.forEach((element) => {
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
   let btn = document.getElementById('contact-btn-' + groupId + '-' + contactId);
   if (contactIsChecked(btn)) {
      resetContacts();
   } else if (atLeastOneContactIsChecked()) {
      switchCards(btn, groupId, contactId);
   } else {
      switchCards(btn, groupId, contactId);
      toggleSlideAnimationRight('contact-details', 1);
   }
}

function contactIsChecked(btn) {
   return btn.classList.contains('checked');
}

function atLeastOneContactIsChecked() {
   return document.querySelectorAll('input[type=radio].checked').length > 0;
}

function resetContacts() {
   uncheckBtns();
   toggleSlideAnimationRight('contact-details');
}

function switchCards(btn, groupId, contactId) {
   justRemoveClass();
   implementCard(btn, groupId, contactId);
}

function implementCard(btn, groupId, contactId) {
   addIntoContainer(
      'contact-details',
      contactDetailsTemplate(groupedContacts[groupId]['value'][contactId], groupId, contactId)
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

function toggleSlideAnimationRight(id) {
   document.getElementById(id).classList.toggle('animate-right');
}

function toggleParent(id) {
   document.getElementById(id).parentElement.classList.toggle('display-none');
}

function newContactForm() {
   let modal = document.getElementById('modal');
   modal.showModal();
}
