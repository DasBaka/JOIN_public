//setURL("http://f015901e@gruppenarbeit-493-join.developerakademie.net/smallest_backend_ever-master');
let groupedUsers;
groupAndSortUser();

let editable;

function groupAndSortUser() {
   sort(users, 'name');
   addGroup();
   groupedUsers = Object.values(groupItems(users, 'letter'));
}

/**
 * Render function for the contact list.
 */
function renderContacts() {
   let list = 'contact-list-wrapper';
   initContainer(list);
   groupAndSortUser();
   initContactList(list);
}

function initContactList(list) {
   for (let i = 0; i < groupedUsers.length; i++) {
      addIntoContainer(list, alphabeticalContactDividerTemplate(i));
      initContacts(list, i);
   }
}

function initContacts(list, i) {
   let contactArray = groupedUsers[i]['value'];
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
   users.forEach((element) => {
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
      contactDetailsTemplate(groupedUsers[groupId]['value'][contactId], groupId, contactId)
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
   changePreview();
   modal.showModal();
}

function resetFormValues(formId) {
   transmuteForm('add');
   letInnerHTML('new-user-icon', 'AA');
   document.getElementById(formId).reset();
}

function changePreview() {
   let icon = document.getElementById('new-user-icon');
   let name = document.getElementById('form-name');
   name.name = name.value;
   icon.color = getFormValue('color-input');
   icon.setAttribute('style', colorContactIcon(icon).slice(7, -2));
   changePreviewName(name, icon);
}

function changePreviewName(name, icon) {
   if (name.name != '') {
      icon.innerHTML = initialLettersUpperCase(name);
   } else {
      icon.innerHTML = 'AA';
   }
}

function submitContactDetails() {
   let state = document.getElementById('modal-submit-btn').innerHTML;
   if (state == 'Add Contact') {
      createNewContact();
   } else if (state == 'Save') {
      modifyContact(...editable);
   }
}

function createNewContact() {
   let newContact = {
      name: getFormValue('form-name'),
      id: '',
      mail: getFormValue('form-email'),
      color: getFormValue('color-input'),
      phone: getFormValue('form-phone'),
      password: '',
   };
   users.push(newContact);
   resetFormValues('new-contact-form');

   renderContacts();
   resetContacts();
}

function transmuteForm(state) {
   let trans = ['contact-modal-h1', 'contact-modal-h2', 'modal-submit-btn'];
   let edit = ['Edit Contact', '', 'Save'];
   let add = ['Add Contact', 'Tasks are better with a team!', 'Add Contact'];

   trans.forEach((el, i) => {
      if (state == 'edit') {
         letInnerHTML(el, edit[i]);
      } else if (state == 'add') {
         letInnerHTML(el, add[i]);
      }
   });
}

function editContact(groupId, contactId) {
   editable = [groupId, contactId];
   let contact = groupedUsers[groupId]['value'][contactId];
   transmuteForm('edit');
   letFormValue('form-name', contact.name);
   letFormValue('form-email', contact.mail);
   letFormValue('color-input', contact.color);
   letFormValue('form-phone', contact.phone);
   newContactForm();
}

function modifyContact(groupId, contactId) {
   let contact = groupedUsers[groupId]['value'][contactId];
   contact.name = getFormValue('form-name');
   contact.mail = getFormValue('form-email');
   contact.color = getFormValue('color-input');
   contact.phone = getFormValue('form-phone');
   renderContacts();
   resetContacts();
   document.getElementById('contact-btn-' + groupId + '-' + contactId).click();
}

function deleteContact(groupId, contactId) {
   let contact = groupedUsers[groupId]['value'][contactId];
   let text = 'Do you want to delete ' + contact.name + '?';
   if (confirm(text) == true) {
      users.splice(
         users.findIndex((e) => e.id == contact.id),
         1
      );
   }
   renderContacts();
   resetContacts();
}

function addTaskForContact(groupId, contactId) {
   let modal = document.getElementById('modal');
   /*    let id = groupedUsers[groupId]['value'][contactId].id;
   console.log(document.getElementById('assignee-list-' + id));
   refreshAssignees('assignee-list', id); */
   modal.showModal();
}
