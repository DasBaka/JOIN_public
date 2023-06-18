let categoryList = {
   id: 'category-inputs',
   arr: categories,
   preText: 'Select task category',
   sufText: 'New category',
};

let assigneeList = {
   id: 'assignee-inputs',
   arr: users,
   preText: 'Select contacs to assign',
   sufText: 'Invite new contact',
};

let assigneeArray = [];
let subTasksArray = [];

let currentCategory;
let currentStatus = 'to-do';

function initAddTaskForm() {
   renderCategoryList();
   renderAssigneeList();
   renderPriorityButtons();
}

function renderCategoryList() {
   let div = document.getElementById(categoryList.id);
   let arr = categoryList.arr;
   div.innerHTML = categoryListBeginning();
   initList('category-list', arr, categoryList);
}

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

function caseCategory(id, arr, listName, list) {
   list.innerHTML += emptyRadioButtonTemplate(id);
   for (let i = 0; i < arr.length; i++) {
      list.innerHTML += radioButtonTemplate(id, arr[i]);
   }
   list.innerHTML += categoryListEnd(id, listName.sufText);
}

function caseAssignee(id, arr, list) {
   for (let i = 0; i < arr.length; i++) {
      list.innerHTML += checkboxTemplate(id, arr[i]);
   }
}

function renderAssigneeList() {
   let div = document.getElementById(assigneeList.id);
   let arr = assigneeList.arr;
   div.innerHTML = `<summary><div id="assignee-summary">${assigneeList.preText}</div><img src="assets/img/sort-down.png"/></summary><div class="list-wrapper" id="assignee-list"></div>`;
   initList('assignee-list', arr, assigneeList);
}

function chosenCategory(id, el) {
   if (id == false) {
      document.getElementById('category-summary').value = '';
      document.getElementById('category-summary-label').innerHTML = categoryList.preText;
   } else {
      let item = JSON.parse(
         document
            .getElementById(id + '-' + el)
            .getAttribute('file-json')
            .replace(/'/g, '"')
      );
      document.getElementById('category-summary').value = 'categoryListItemTemplate(item)';
      document.getElementById('category-summary-label').innerHTML = categoryListItemTemplate(item);
   }
   document.getElementById('category-inputs').open = false;
}

function toggleAddField(id, outerDivId) {
   document.getElementById(id).classList.toggle('display-none');
   document.getElementById(outerDivId).classList.toggle('display-none');
}

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

function renderAssigneePreview() {
   let preview = document.getElementById('assignees');
   preview.innerHTML = '';
   assigneeArray.forEach((el, index) => {
      let initials = initialLettersUpperCase(el);
      preview.innerHTML += userPreviewBoardIconTemplate(index, initials, false);
   });
}

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

function changePreview() {
   let icon = document.getElementById('new-category-icon');
   icon.color = getFormValue('color-input-task');
   icon.setAttribute('style', colorContactIcon(icon).slice(7, -2));
}

function renderSubtasks() {
   let content = document.getElementById('subtasks-list');
   content.innerHTML = '';
   for (let i = 0; i < subTasksArray.length; i++) {
      const subTask = subTasksArray[i];
      content.innerHTML += subtaskPreviewTemplate(subTask);
   }
}

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

function removeSubTask(taskId) {
   let id = getIndexOfValue(subTasksArray, 'id', taskId);
   subTasksArray.splice(id, 1);
   renderSubtasks();
}

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

function emptyInput(id) {
   document.getElementById(id).value = '';
}

function resetCategoryInput() {
   emptyInput('form-input-category');
   chosenCategory(false);
   toggleAddField('new-category-input', 'category-inputs');
}

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

function resetAddTaskForm() {
   document.getElementById('add-task-form').reset();
   assigneeArray = [];
   subTasksArray = [];
   initAddTaskForm();
   closeModal();
}

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

function categoryValidityCheck() {
   if (document.getElementById('category-summary').childElementCount != 2) {
      document.getElementById('category-summary').setCustomValidity('Please select a category!');
   }
}

function newTaskTemplate() {
   return {
      id: findFreeId(tasks, 't', 4),
      title: getFormValue('form-input-title'),
      description: getFormValue('form-input-description') || '',
      category: document.getElementById('category-summary').lastElementChild?.innerHTML || '',
      assignees: getAssignees(),
      due_date: getFormValue('form-input-dueDate'),
      priority: getPriority(),
      status: currentStatus,
      subtasks: subTasksArray,
   };
}

function getPriority() {
   let btns = document.getElementsByName('priority');
   for (let i = 0; i < btns.length; i++) {
      if (btns[i].checked) {
         return btns[i].value;
      }
   }
}

function getAssignees() {
   let userIds = [];
   assigneeArray.forEach((el) => {
      userIds.push(el.id);
   });
   return userIds;
}
