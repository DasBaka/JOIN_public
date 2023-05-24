/**
 * Fills the innHTML of the desired container with the chosen input.
 * @param {*} id - container id
 * @param {*} content - HTML input
 */
function addIntoContainer(id, content) {
   let container = document.getElementById(id);
   container.innerHTML += content;
}

//Templates
function contactCardTemplate(contact, i, j) {
   return /*html*/ `
   <input type="radio" name="contact-list-btns" id="contact-btn-${i}-${j}" class="contact-btn" onclick="showContactCard(${i}, ${j})">
   <label for="contact-btn-${i}-${j}" class="contact-wrapper">
       <div id="user-icon-${i}-${j}" class="user-icon" ${colorContactIcon(
      contact
   )}>${initialLetter(contact, 0)}${initialLetter(
      contact,
      contact.name.search(' ') + 1
   )}</div>
       <div class="contact-details">
           <h4>${contact.name}</h4>
           <h6 style="color: #007cee">${contact.mail}</h6>
       </div>
   </div>
   `;
}

function contactDetailsTemplate(contact, i, j) {
   return /*html*/ `
   <div class="contact-wrapper">
     <div id="user-icon-${i}-${j}" class="user-icon user-icon-big" ${colorContactIcon(
      contact
   )}>${initialLetter(contact, 0)}${initialLetter(
      contact,
      contact.name.search(' ') + 1
   )}</div>
     <div class="contact-details flex-column contact-details-big">
       <h2>${contact.name}</h2>
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
       <h6 style="color: #007cee">${contact.mail}</h6>
       <h6><b>Phone</b></h6>
       <h6>${contact.phone}</h6>
     </div>    
   </div>  `;
}

function alphabeticalContactDividerTemplate(i) {
   return `<h4 class="contact-list-divider">${groupedContacts[i]['group']}</h4>`;
}
