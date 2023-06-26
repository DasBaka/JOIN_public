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
/**
 * Template for the contact card inside the adress list
 * @param {user} contact - user
 * @param {id} i - group index
 * @param {id} j - contact index
 * @returns - html
 */
function contactCardTemplate(contact, i, j) {
   return /*html*/ `
   <input type="radio" name="contact-list-btns" id="contact-btn-${i}-${j}" class="contact-btn" onclick="showContactCard(${i}, ${j})">
   <label for="contact-btn-${i}-${j}" class="contact-wrapper">
       <div id="user-icon-${i}-${j}" class="user-icon" ${colorContactIcon(contact)}>
       ${initialLettersUpperCase(contact)}</div>
       <div class="contact-details">
           <h4>${contact.name}</h4>
           <h6 style="color: #007cee">${contact.mail}</h6>
       </div>
   </div>
   `;
}

/**
 * Template for the detailed contact view inside the main of contact.html.
 * @param {user} contact - user
 * @param {id} i - group index
 * @param {id} j - contact index
 * @returns - html
 */
function contactDetailsTemplate(contact, i, j) {
   return /*html*/ `
   <div class="contact-wrapper">
     <div id="user-icon-${i}-${j}" class="user-icon user-icon-big" ${colorContactIcon(contact)}>${
      initialLetter(contact, 0) + initialLetter(contact, contact.name.search(' ') + 1)
   }</div>
     <div class="contact-details flex-column contact-details-big">
       <h2>${contact.name}</h2>
       <div class="add-task-for-contact" onclick="addTaskForContact(${i}, ${j})">
         <h5 style="color: #29abe2"><img src="assets/img/blue_cross.png"/>Add Task</h5>
       </div>
     </div>
   </div>
   <div>
     <div class="contact-details-card-title">
       <h4>Contact Information</h4>
       <div class="editable-wrapper">
        <div onclick="deleteContact(${i}, ${j})">
          <img src="assets/img/delete.png" class="editable-image-wrapper"/>
          <span>Delete Contact</span>
        </div>
        <div onclick="editContact(${i}, ${j})">
          <img src="assets/img/edit.png" class="editable-image-wrapper"/>
          <span>Edit Contact</span>
        </div>
        </div>
     </div>
     <div class="contact-details-card">
       <h6><b>Email</b></h6>
       <h6 style="color: #007cee">${contact.mail}</h6>
       <h6><b>Phone</b></h6>
       <h6>${contact.phone}</h6>
     </div>    
   </div>  `;
}

/**
 * Template for the group divider (incl group letter).
 * @param {index} i - group divider index
 * @returns - html
 */
function alphabeticalContactDividerTemplate(i) {
   return /*html*/ `<h4 class="contact-list-divider">${groupedUsers[i]['group']}</h4>`;
}

/**
 * Template for the board columns.
 * @param {string} status - column title (status title)
 * @returns - html
 */
function boardTemplate(status) {
   return /*html*/ `
   <article class="board-column">
     <div>
       <h4>${status['displayName']}</h4>
       <div>
          <button class="add-button" onclick="addTaskForStatus('${status.name}')">+</button>
       </div>
     </div>
     <div id="board-tasks-column-${status['name']}" 
       ondrop="moveElementTo('${status['name']}')"
       ondragover="allowDrop(event); highlightSelectedDragArea('${status['name']}', true)" 
       ondragleave="highlightSelectedDragArea('${status['name']}', false)"></div>
   </article>
   `;
}

/**
 * Template for a task card inside the board.html.
 * @param {object} task - task object
 * @param {index} categoryIndex - category index
 * @param {index} priorityIndex - priority index
 * @returns - html
 */
function taskCardTemplate(task, categoryIndex, priorityIndex) {
   return /*html*/ `
   <div id="task-preview-wrapper-${task.id}" draggable="true" class="task-preview-wrapper grabbable"
     onclick="showTaskDetails('${task.id}')"
     ondragstart="setActiveDragElement('${task.id}'); highlightAvailableDragArea(true); hideOriginalElementOnDrag('${task.id}', true)" 
     ondragend="highlightAvailableDragArea(false); hideOriginalElementOnDrag('${task.id}', false)">
     <div style="background-color: ${categories[categoryIndex].color};"
       class="board-task-category">${categories[categoryIndex].category}</div>
     <h6><b>${task.title}</b></h6>
     <p>${task.description}</p>
     <div id="task-preview-subtask-progress-wrapper-${task.id}" class="task-preview-subtask-progress-wrapper"></div>
     <div class="task-preview-footer-wrapper">
       <div id="assignees-${task.id}" class="board-user-icon-wrapper"></div>
       <img src="${priorites[priorityIndex]['icon_path']}" alt="priority icon ${task.priority}">
     </div>
   </div>`;
}

/**
 * Template for a detailed view of a task inside the modal/dialog.
 * @param {object} task - task object
 * @param {id} taskId - id of the task card
 * @param {index} categoryIndex - category index
 * @param {index} priorityIndex - priority index
 * @returns - html
 */
function taskCardDetailTemplate(task, taskId, categoryIndex, priorityIndex) {
   return /*html*/ `
     <div id="task-detailed-content" class="task-detailed-content" onclick="event.stopPropagation()">
       <div class="task-detailed-close-button" onclick="closeModal()">
         <img src="assets/img/cross.svg" alt="cross icon">
       </div>
       <div style="background-color: ${categories[categoryIndex]['color']}"
         class="board-task-category"><h4>${categories[categoryIndex].category}</h4></div>
       <h2>${task['title']}</h2>
       <p>${task['description']}</p> 
       <div class="task-detailed-attribute-wrapper">
         <h5>Due Date:</h5>
         <div>${new Date(task['due_date']).toDateString()}</div>
       </div>
       <div class="task-detailed-attribute-wrapper">
         <h5>Priority:</h5>
         <div class="task-detailed-priority" style="background-color: ${
            priorites[priorityIndex]['color']
         }">
           <h6>${capitalizeFirstLetter(task['priority'])}</h6>
           <img src="${priorites[priorityIndex]['icon_path']}" alt="priority icon ${
      task['priority']
   }">
         </div>
       </div>
       <div>
         <h5>Assigned to:</h5>
         <div id="assignees-detailed"></div>
       </div>
       <button class="button-primary task-edit-button" onclick="editTaskDetails('${taskId}', true)">
         <img src="assets/img/edit.svg" alt="edit pencil icon">
       </button>
     </div>`;
}

/**
 * Template for a detailed view of a task and to edit it inside the modal/dialog.
 * @param {object} task - task object
 * @param {id} taskId - id of the task card
 * @returns - html
 */
function editTaskTemplate(task, taskId) {
   return /*html*/ `
   <div id="task-detailed-wrapper" class="task-detailed-wrapper" onclick="event.stopPropagation()">
     <div id="task-detailed-content" class="task-detailed-content">
       <div class="task-edit-wrapper">
         <div class="task-detailed-close-button" onclick="closeModal()">
           <img src="assets/img/cross.svg" alt="cross icon">
         </div>
         <div class="task-edit-form-item-wrapper">
           <h6>Title</h6>
           <input id="task-edit-from-input-title" type="text" placeholder="Enter a Title" value="${task['title']}" class="form-default-input task-edit-heading-gap task-edit-form-input">
         </div>
         <div class="task-edit-form-item-wrapper">
           <h6>Description</h6>
           <textarea id="task-edit-from-input-description" rows="4" placeholder="Enter a Description" class="form-default-input task-edit-heading-gap task-edit-form-input" style="font-size: 1rem">${task['description']}</textarea>
         </div>
         <div class="task-edit-form-item-wrapper">
           <h6>Due date</h6>
           <input id="task-edit-from-input-dueDate" type="date" value="${task['due_date']}" class="form-default-input task-edit-heading-gap task-edit-form-input" style="font-size: 1rem; cursor: pointer;">
         </div>
         <div class="task-edit-form-item-wrapper">
           <h6>Prio</h6>
           <div id="form-pb" class="task-edit-priority-buttons task-edit-heading-gap"></div>
         </div>
         <div id="task-edit-form-item-assignees" class="task-edit-form-item-wrapper">
           <h6>Assigned to</h6>
           <div id="task-edit-assignee-selection" class="form-default-input task-edit-heading-gap task-edit-form-input task-edit-assignee-select-wrapper"></div>
           <div id="task-edit-assignee-contact-invite" class="task-edit-assignee-contact-invite-wrapper display-none">
             <input type="text" placeholder="Contact email" class="form-default-input task-edit-heading-gap task-edit-form-input" style="font-size: 1rem;">
             <div class="task-edit-assignee-contact-invite-icons-wrapper">
               <img style="transform: rotate(45deg);" src="assets/img/cross.svg" alt="cross icon" onclick="assigneeSelectionInviteContact()">
               <div class="grey-divider-div"></div>
               <img src="assets/img/check-black.png" alt="check icon" onclick="">
             </div>
           </div>
           <div id="task-edit-assignee-preview" class="task-edit-assignee-preview"></div>
         </div>
         <button class="button-primary task-edit-button" onclick="applyEditTask('${taskId}'); closeModal()">
           <h6>Ok</h6>
           <img src="assets/img/check-white.png" alt="Checkmark">
         </button>
       </div>
     </div>
     <div class="task-detailed-background" onclick="showTaskDetails(null, false)"></div>
   </div>`;
}

function taskEditAssigneeSelecTemplate(taskId, state) {
   return /*html*/ `
   <div class="task-edit-assignee-selection-item" onclick="renderTaskAssigneeSelection('${taskId}', 'task-edit-assignee-selection', ${state})">
     <h6>Select contacts to assign</h6>
     <img src="assets/img/sort-down.png" alt="triangular down icon">
   </div>`;
}

function assigneeEditTemplate(i, user) {
   return /*html*/ `
   <div class="task-edit-assignee-selection-item" onclick="assigneeCheckboxSelection(${i}); changeTaskAsssignee(activeTaskAssignees, '${user['name']}', 'task-edit-assignee-preview',)">
     <h6>${user['name']}</h6>
     <div id="task-edit-assignee-selection-checkbox-${i}" class="task-edit-assignee-selection-checkbox"></div>
   </div>`;
}

function furtherAssigneeAmountTemplate(assigneeArray) {
   return /*html*/ `
  <div style="background-color: black;" class="board-user-icon">${
     '+' + (assigneeArray.length - 2)
  }</div>`;
}

/**
 * Template for the small assignee preview icons on chosing task assignees.
 * @param {id} assigneeIndex - assignee index
 * @param {letters} assigneeInitials - assignee's initials
 * @param {boolean} extra - defines, if the full name is displayed behind the icon or not
 * @returns - html
 */
function userPreviewBoardIconTemplate(assigneeIndex, assigneeInitials, extra) {
   let name = extra ? /*html*/ `<p>${users[assigneeIndex]['name']}</p>` : '';
   return (
      /*html*/ `
  <div ${colorContactIcon(users[assigneeIndex])}
    class="board-user-icon">${assigneeInitials}</div>` + name
   );
}

/**
 * Template for the last item of the category list (inside add task), to further add more categories
 * @param {id} id - category id name
 * @param {string} txt - placeholder text
 * @returns - html
 */
function categoryListEnd(id, txt) {
   return /*html*/ `<div><input type="radio" name="${id}" id="${id}-${txt}" class="display-none" value="" onclick="toggleAddField('new-category-input', 'category-inputs')"><label for="${id}-${txt}">${txt}</label></div>`;
}

/**
 * Template for the category list items.
 * @param {id} id - category id name
 * @param {object}} el - category element
 * @returns - html
 */
function radioButtonTemplate(id, el) {
   let string = JSON.stringify(el).replace(/"/g, "'");
   return /*html*/ `
  <div class="category-list-wrapper" id="${id}-${
      el.id
   }" file-json="${string}" onclick="chosenCategory('${id}', '${el.id}')">
    ${categoryListItemTemplate(el)}
  </div>
  `;
}

/**
 * Template fot the assignee list items.
 * @param {id} id -  assignee list name
 * @param {object} el - assignee element
 * @returns - html
 */
function checkboxTemplate(id, el) {
   return /*html*/ `
  <div><label for="${id}-${el.id}">${el.name}</label><input type="checkbox" name="${id}" id="${id}-${el.id}" value="${el.id}" onchange="refreshAssignees('${id}', '${el.id}')"></div>
  `;
}

/**
 * Template to render the priority buttons inside add-task.
 * @param {id} id - id name for the priority buttons
 * @param {object} priority - priority object
 * @returns - html
 */
function priorityBtnTemplate(id, priority) {
   return /*html*/ `<div>
<input type="checkbox" class="display-none" name="priority" value="${
      priority.name
   }" id="${id}"  onclick="colorPrioBtn('${id}', '${priority.color}')"/>
<label for="form-pb-${priority.name}" class="form-pb-button center ">
<h6>${capitalizeFirstLetter(priority.name)}</h6>
<img src="${priority['icon_path']}" alt="priority icon ${priority['name']}">
</div>`;
}

/**
 * Template to display subtasks.
 * @param {object} subTask - subtask object
 * @returns - html
 */
function subtaskPreviewTemplate(subTask) {
   return /*html*/ `
<div class="subtask-wrapper">
 <input type="checkbox" ${getSubtaskStatus(subTask)}>
 <p>${subTask['title']}</p>
 <img src="assets/img/cross.svg" onclick="removeSubTask('${subTask['id']}')">
</div>`;
}

/**
 * Template for the first item inside the category list (summary!).
 * @returns - html
 */
function categoryListBeginning() {
   return /*html*/ `
   <summary>
      <input type="checkbox" required id="category-summary" value=""/>
      <label id="category-summary-label" for="category-summary">${categoryList.preText}</label>
      <img src="assets/img/sort-down.png"/>
   </summary>
   <div class="list-wrapper" id="category-list"></div>`;
}

/**
 * Template for an empty field as second item inside the category list (empties category)
 * @param {id} id - category list name
 * @returns - html
 */
function emptyRadioButtonTemplate(id) {
   return /*html*/ `
  <div class="category-list-wrapper" onclick="chosenCategory(false)">
    <input type="radio" name="${id}" id="${id}-empty" class="display-none" value="">
    <label for="${id}-empty" class="user-icon user-icon-small edit-user-icon" style="opacity: 0"></label>
    <label for="${id}-empty"></label>
  </div>
  `;
}

/**
 * Template to display the chosen category inside the summary.
 * @param {object} el - category element
 * @returns - html
 */
function categoryListItemTemplate(el) {
   return /*html*/ `    
  <label class="user-icon user-icon-small edit-user-icon" style="background-color: ${el.color}"></label>
  <label id="chosen-category">${el.category}</label> `;
}
