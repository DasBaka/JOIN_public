let groupedUsers;
let editable;

/**
 * Groups and sorts the users/contacts.
 */
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

/**
 * Initializes the contact list (here: with dividers)
 * @param {arr} list - contact array
 */
function initContactList(list) {
   for (let i = 0; i < groupedUsers.length; i++) {
      addIntoContainer(list, alphabeticalContactDividerTemplate(i));
      initContacts(list, i);
   }
}

/**
 * Initializes the contacts inside the contact list (from before)
 * @param {arr} list - contact group array
 * @param {num} i - group number
 */
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

/**
 * Checks for dummy-class "checked"
 * @param {id} btn - (radio) button id
 * @returns - true/false
 */
function contactIsChecked(btn) {
   return btn.classList.contains('checked');
}

/**
 * Prerequisite for not emptying innerHTML of main.
 * @returns - true/false
 */
function atLeastOneContactIsChecked() {
   return document.querySelectorAll('input[type=radio].checked').length > 0;
}

/**
 * Unchecks Contacts and empties main-innerHTML
 */
function resetContacts() {
   uncheckBtns();
   toggleSlideAnimationRight('contact-details');
}

/**
 * Displays a new contact-card, if a contact-card is already shown.
 * @param {id} btn - button id of the new chosen contact
 * @param {id} groupId - group id
 * @param {id} contactId - contact id inside this group
 */
function switchCards(btn, groupId, contactId) {
   justRemoveClass();
   implementCard(btn, groupId, contactId);
}

/**
 * Display a new contact card inside main-innerHTML. Gives this contact the dummy-class "checked".
 * @param {id} btn - button id of the new chosen contact
 * @param {id} groupId - group id
 * @param {id} contactId - contact id inside this group
 */
function implementCard(btn, groupId, contactId) {
   addIntoContainer(
      'contact-details',
      contactDetailsTemplate(groupedUsers[groupId]['value'][contactId], groupId, contactId)
   );
   btn.classList.add('checked');
}

/**
 * Removes any available "checked"-dummy-class.
 */
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

/**
 * Toggles an animation ("anmiate-right") for a chosen id.
 * @param {id} id - id to add/remove "animate-right" as class
 */
function toggleSlideAnimationRight(id) {
   document.getElementById(id).classList.toggle('animate-right');
}

/**
 * Renders the "new-contact-form" inside the modal and shows the modal.
 * Because this form is saved as a template, you have to "await" before the script can deal with it.
 */
async function newContactForm() {
   await repeatPageLoadForModal('templates/create-new-contact.html').then(() =>
      transmuteForm('add')
   );
   let modal = document.getElementById('modal');
   changePreview();
   modal.showModal();
}

/**
 * Resets the "new-contact-form".
 * @param {id} formId - form id
 */
function resetFormValues(formId) {
   transmuteForm('add');
   letInnerHTML('new-user-icon', 'AA');
   document.getElementById(formId).reset();
}

/**
 * Changes the user icon on input change.
 */
function changePreview() {
   let icon = document.getElementById('new-user-icon');
   let name = document.getElementById('form-name');
   name.name = name.value;
   icon.color = getFormValue('color-input');
   icon.setAttribute('style', colorContactIcon(icon).slice(7, -2));
   changePreviewName(name, icon);
}

/**
 * Changes the shown letters inside the user icon on input change.
 * @param {value} name - the value inside the name input of the new-contact-form
 * @param {id} icon - id of the user icon
 */
function changePreviewName(name, icon) {
   if (name.name != '') {
      icon.innerHTML = initialLettersUpperCase(name);
   } else {
      icon.innerHTML = 'AA';
   }
}

/**
 * On form submit, determines, if a new user were created or just edited.
 */
function submitContactDetails() {
   let state = document.getElementById('modal-submit-btn').innerHTML;
   if (state == 'Add Contact') {
      createNewContact();
   } else if (state == 'Save') {
      modifyContact(...editable);
   }
}

/**
 * Pushes a new user inside the user array.
 */
function createNewContact() {
   let newContact = {
      name: getFormValue('form-name'),
      id: findFreeId(users, 'u', 4),
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

/**
 * Changes/Transmutes the new-contact-form-template for editing or adding.
 * @param {string} state - "add"/"adit"
 */
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

/**
 * Renders the "new-contact-form" inside the modal and shows the modal.
 * Because this form is saved as a template, you have to "await" before the script can deal with it.
 * @param {id} groupId - ´group id
 * @param {id} contactId - contact id inside the group
 */
async function editContact(groupId, contactId) {
   await newContactForm();
   editable = [groupId, contactId];
   let contact = groupedUsers[groupId]['value'][contactId];
   getEditReady(contact);
}

/**
 * Inserts the given contact data inside the editing-form.
 * @param {object} contact - contact object to edit
 */
function getEditReady(contact) {
   transmuteForm('edit');
   letFormValue('form-name', contact.name);
   letFormValue('form-email', contact.mail);
   letFormValue('color-input', contact.color);
   letFormValue('form-phone', contact.phone);
}

/**
 * On form submit, overwrites the contact details of the edited user.
 * @param {id} groupId - group id
 * @param {id} contactId - contact id inside the group
 */
function modifyContact(groupId, contactId) {
   let contact = groupedUsers[groupId]['value'][contactId];
   contact.name = getFormValue('form-name');
   contact.mail = getFormValue('form-email');
   contact.color = getFormValue('color-input');
   contact.phone = getFormValue('form-phone');
   renderContacts();
   resetContacts();
   document.getElementById('contact-btn-' + groupId + '-' + contactId).click(); //Needed to "easy-refresh" the contact details.
}

/**
 * Deletes a contact. Opens a confirm prompt to reconfirm the deletion.
 * @param {id} groupId  - group id
 * @param {id} contactId - contact id inside the group
 */
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

/**
 * Opens a add-task-form with the clicked user preselected as assignee.
 * @param {id} groupId - group id
 * @param {id} contactId - contact id inside the group
 */
async function addTaskForContact(groupId, contactId) {
   await repeatPageLoadForModal('templates/add-task-form.html').then(() => initAddTaskForm());
   let id = groupedUsers[groupId]['value'][contactId].id;
   document.getElementById('assignee-list-' + id).checked = true;
   refreshAssignees('assignee-list', id);
   let modal = document.getElementById('modal');
   modal.showModal();
}
