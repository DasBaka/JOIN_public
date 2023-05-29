//setURL("http://f015901e@gruppenarbeit-493-join.developerakademie.net/smallest_backend_ever-master');
let groupedContacts;
groupAndSortContacts();

function groupAndSortContacts() {
   sort(contacts, 'name');
   addGroup();
   groupedContacts = Object.values(groupItems(contacts, 'letter'));
}

/**
 * Render function for the contact list.
 */
function renderContacts() {
   let list = 'contact-list-wrapper';
   initContainer(list);
   groupAndSortContacts();
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
 * Adds the "letter"-group.
 */
function addGroup() {
   contacts.forEach((element) => {
      element['letter'] = initialLetter(element, 0);
   });
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

function newContactForm() {
   let modal = document.getElementById('modal');
   modal.showModal();
}

function changePreview() {
   let icon = document.getElementById('new-user-icon');
   let name = document.getElementById('form-name');
   name.name = name.value;
   icon.color = getFormValue('color-input');
   icon.setAttribute('style', colorContactIcon(icon).slice(7, -2));
   if (name.name != '') {
      icon.innerHTML = initialLettersUpperCase(name);
   } else {
      icon.innerHTML = 'AA';
   }
}

function createNewContact() {
   let newContact = {
      name: getFormValue('form-name'),
      mail: getFormValue('form-email'),
      color: getFormValue('color-input'),
      phone: getFormValue('form-phone'),
   };
   contacts.push(newContact);
   document.getElementById('new-contact-form').reset();
   document.getElementById('new-user-icon').innerHTML = 'AA';

   renderContacts();
}
