let categoryList = {
   id: 'category-inputs',
   arr: '',
   preText: 'Select task category',
   sufText: 'New category',
};

let assigneeList = {
   id: 'assignee-inputs',
   arr: '',
   preText: 'Select contacs to assign',
   sufText: 'Invite new contact',
};

let assigneeArray = [];
let subTasksArray = [];

let currentCategory;
let currentStatus = 'to-do';

/**
 * Initializes the add-task-form.
 */
function initAddTaskForm() {
   renderCategoryList();
   renderAssigneeList();
   renderPriorityButtons();
}

/**
 * Renders the category list. //Start
 */
function renderCategoryList() {
   let div = document.getElementById(categoryList.id);
   categoryList.arr = categories;
   let arr = categoryList.arr;
   div.innerHTML = categoryListBeginning();
   initList('category-list', arr, categoryList);
}

/**
 * Renders a list (category or assignee list)
 * @param {id} id - id name for the list
 * @param {array} arr - data array
 * @param {json} listName - json with list data
 */
function initList(id, arr, listName) {
   let list = document.getElementById(id);
   list.innerHTML = '';
   switch (id) {
      case 'category-list':
         caseCategory(id, arr, listName, list);
         break;
      case 'assignee-list':
         caseAssignee(id, arr, list);
         break;
   }
}

/**
 * Renders the category list.
 * @param {id} id - id name for the list
 * @param {array} arr - data array
 * @param {json} listName - json with list data
 * @param {element} list - html element for the list
 */
function caseCategory(id, arr, listName, list) {
   list.innerHTML += emptyRadioButtonTemplate(id);
   for (let i = 0; i < arr.length; i++) {
      list.innerHTML += radioButtonTemplate(id, arr[i]);
   }
   list.innerHTML += categoryListEnd(id, listName.sufText); // End
}

/**
 * Renders the assignee list.
 * @param {id} id - id name for the list
 * @param {array} arr - data array
 * @param {element} list - html element for the list
 */
function caseAssignee(id, arr, list) {
   for (let i = 0; i < arr.length; i++) {
      list.innerHTML += checkboxTemplate(id, arr[i]);
   }
}

/**
 * Renders the assignee list. //Start
 */
function renderAssigneeList() {
   let div = document.getElementById(assigneeList.id);
   assigneeList.arr = users;
   let arr = assigneeList.arr;
   div.innerHTML = `<summary><div id="assignee-summary">${assigneeList.preText}</div><img src="assets/img/sort-down.png"/></summary><div class="list-wrapper" id="assignee-list"></div>`;
   initList('assignee-list', arr, assigneeList);
}

/**
 * Determines the chosen catgegory.
 * Because of the given layout (mockup) it would be difficult to implement a select input.
 * Therefore we had to implement a specific function.
 * @param {id} id - category list name
 * @param {object} el - category object
 */
function chosenCategory(id, el) {
   if (id == false) {
      implementCategory('', false, categoryList.preText);
   } else {
      let item = implementCategoryData(id, el);
      implementCategory(item.name, true, categoryListItemTemplate(item));
   }
   document.getElementById('category-inputs').open = false;
}

/**
 * Renders the chosen category.
 * @param {value} value - input value to change into
 * @param {boolean} checkStatus - check status of the chosen item
 * @param {html} html - html to implement into the category summary
 */
function implementCategory(value, checkStatus, html) {
   document.getElementById('category-summary').value = value;
   document.getElementById('category-summary').checked = checkStatus;
   document.getElementById('category-summary-label').innerHTML = html;
}

/**
 * Implements category data inside the html.
 * @param {id} id - category list name
 * @param {object} el - category object
 * @returns - json
 */
function implementCategoryData(id, el) {
   let item = JSON.parse(
      document
         .getElementById(id + '-' + el)
         .getAttribute('file-json')
         .replace(/'/g, '"')
   );
   return item;
}

/**
 * Toggles "display: none" for child and parents counter-wise.
 * Used to toggle an input field for more categories / assignees.
 * @param {id} id - child name
 * @param {id} outerDivId - parent id
 */
function toggleAddField(id, outerDivId) {
   document.getElementById(id).classList.toggle('display-none');
   document.getElementById(outerDivId).classList.toggle('display-none');
}

/**
 * Renders the assignee list after chosing an assignee.
 * @param {id} inputId -  assignee list id
 * @param {id} contactId - user id
 */
function refreshAssignees(inputId, contactId) {
   checkCheckedLimit();
   let id = document.getElementById(inputId + '-' + contactId);
   if (id.checked) {
      let arrayId = getIndexOfValue(users, 'id', contactId);
      assigneeArray.push(users[arrayId]);
   } else {
      let arrayId = getIndexOfValue(assigneeArray, 'id', contactId);
      assigneeArray.splice(arrayId, 1);
   }
   sort(assigneeArray, 'name');
   renderAssigneePreview();
}

/**
 * Disables/Enables the assignee-list for a specified assignee limit.
 * Default limit: 8.
 */
function checkCheckedLimit() {
   let id = document.getElementById('assignee-list');
   let checked = id.querySelectorAll('input[type="checkbox"]:checked');
   let unchecked = id.querySelectorAll('input[type="checkbox"]:not(:checked)');
   if (checked.length == 8) {
      unchecked.forEach((el) => (el.disabled = true));
   } else if (checked.length < 8) {
      unchecked.forEach((el) => (el.disabled = false));
   }
}

/**
 * Renders a small assignee preview under the list.
 */
function renderAssigneePreview() {
   let preview = document.getElementById('assignees');
   preview.innerHTML = '';
   assigneeArray.forEach((el, index) => {
      let initials = initialLettersUpperCase(el);
      preview.innerHTML += userPreviewBoardIconTemplate(index, initials, false);
   });
}

/**
 * Renders the priority buttons.
 */
function renderPriorityButtons() {
   let content = document.getElementById('form-pb');
   content.innerHTML = '';
   for (let i = 0; i < priorites.length; i++) {
      const priority = priorites[i];
      let id = 'form-pb-' + priority.name;
      content.innerHTML += priorityBtnTemplate(id, priority);
      if (i == priorites.length - 1) {
         document.getElementById(id).checked = true;
         colorPrioBtn(id, priority.color);
      }
   }
}

/**
 * Colors the priority buttons depending on their checked-status.
 * @param {id} id - button id.
 * @param {color} color - new button color.
 */
function colorPrioBtn(id, color) {
   let btns = document.getElementById('form-pb');
   let priorityButton = btns.querySelectorAll('input');
   priorityButton.forEach((el) => {
      let btn = el.nextSibling.nextSibling;
      if (el.checked & (el.id == id)) {
         btn.style.backgroundColor = `${color}`;
         btn.style.color = 'white';
      } else if (el.id == id) {
         return;
      } else {
         el.checked = false;
         btn.style.backgroundColor = `white`;
         btn.style.color = 'black';
      }
   });
}

/**
 * Colors the icon of a newly defined category.
 */
function changePreview() {
   let icon = document.getElementById('new-category-icon');
   icon.color = getFormValue('color-input-task');
   icon.setAttribute('style', colorContactIcon(icon).slice(7, -2));
}

/**
 * Renders the subtasks.
 */
function renderSubtasks() {
   let content = document.getElementById('subtasks-list');
   content.innerHTML = '';
   for (let i = 0; i < subTasksArray.length; i++) {
      const subTask = subTasksArray[i];
      content.innerHTML += subtaskPreviewTemplate(subTask);
   }
}

function getSubtaskStatus(subtask) {
   switch (subtask.status) {
      case 'open':
         return;
      case 'done':
         return `checked`;
   }
}

/**
 * Adds a subtask.
 */
function addSubTask() {
   checkSubtaskLimit();
   let name = document.getElementById('form-input-subtask').value;
   if (replacer(name) != '') {
      let newTask = {
         id: findFreeId(subTasksArray, 's', 2),
         title: name,
         status: 'open',
      };
      subTasksArray.push(newTask);
      renderSubtasks();
   }
   emptyInput('form-input-subtask');
}

/**
 * Removes a subtask.
 * @param {id} taskId - id of the removing task
 */
function removeSubTask(taskId) {
   let id = getIndexOfValue(subTasksArray, 'id', taskId);
   subTasksArray.splice(id, 1);
   renderSubtasks();
}

/**
 * Sets a limit for subtasks.
 * Default limit: 8.
 */
function checkSubtaskLimit() {
   let id = document.getElementById('subtasks-list');
   let input = document.getElementById('form-input-subtask');
   let tasks = id.getElementsByClassName('subtask-wrapper');
   if (tasks.length == 8) {
      input.disabled = true;
   } else if (tasks.length < 8) {
      input.disabled = false;
   }
}

/**
 * Empties an inputs value.
 * @param {id} id - input id
 */
function emptyInput(id) {
   document.getElementById(id).value = '';
}

/**
 * Resets the category selection to the placeholder.
 */
function resetCategoryInput() {
   emptyInput('form-input-category');
   chosenCategory(false);
   toggleAddField('new-category-input', 'category-inputs');
}

/**
 * Adds a new category.
 */
function addCategory() {
   let name = document.getElementById('form-input-category').value;
   if (replacer(name) != '') {
      let newCategory = {
         id: findFreeId(categories, 'c', 3),
         name: name,
         color: document.getElementById('color-input-task').value,
      };
      categories.push(newCategory);
      renderCategoryList();
      resetCategoryInput();
   }
}

/**
 * Resets the add-task-form.
 */
function resetAddTaskForm() {
   document.getElementById('add-task-form').reset();
   assigneeArray = [];
   subTasksArray = [];
   initAddTaskForm();
   closeModal();
}

/**
 * Creates a new task and redirects then to the board.
 */
function createTask() {
   let form = document.getElementById('add-task-form');
   categoryValidityCheck();
   if (form.reportValidity()) {
      let newTask = newTaskTemplate();
      tasks.push(newTask);
      window.alert('Task ' + newTask.title + ' was created!');
      if (window.location.pathname == '/board.html') {
         closeModal();
         initBoard();
      } else {
         window.location.href = '/board.html';
      }
   }
}

/**
 * Checks form validation with custom validity.
 */
function categoryValidityCheck() {
   if (document.getElementById('category-summary-label').childElementCount != 2) {
      document.getElementById('category-summary').setCustomValidity('Please select a category!');
   }
}

/**
 * JSON of a new task.
 * @returns - json
 */
function newTaskTemplate() {
   return {
      id: findFreeId(tasks, 't', 4),
      title: getFormValue('form-input-title'),
      description: getFormValue('form-input-description') || '',
      category: document.getElementById('category-summary').value,
      assignees: getAssignees(),
      due_date: getFormValue('form-input-dueDate'),
      priority: getPriority(),
      status: currentStatus,
      subtasks: subTasksArray,
   };
}

/**
 * Checks for chosen priority on creating a new task.
 * @returns - priority value
 */
function getPriority() {
   let btns = document.getElementsByName('priority');
   for (let i = 0; i < btns.length; i++) {
      if (btns[i].checked) {
         return btns[i].value;
      }
   }
}

/**
 * Returns an array of the chosen assignees.
 * @returns - array
 */
function getAssignees() {
   let userIds = [];
   assigneeArray.forEach((el) => {
      userIds.push(el.id);
   });
   return userIds;
}
