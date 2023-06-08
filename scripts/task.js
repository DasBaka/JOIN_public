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

function initDropDown() {
   renderCategoryList();
   renderAssigneeList();
}

function renderCategoryList() {
   let div = document.getElementById(categoryList.id);
   let arr = categoryList.arr;
   div.innerHTML = `<summary><div id="category-summary">${categoryList.preText}</div><img src="assets/img/sort-down.png"/></summary><div class="list-wrapper" id="category-list"></div>`;
   initList('category-list', arr, categoryList);
}

function initList(id, arr, listName) {
   let list = document.getElementById(id);
   list.innerHTML = '';
   switch (id) {
      case 'category-list':
         for (let i = 0; i < arr.length; i++) {
            list.innerHTML += radioButtonTemplate(id, arr[i]);
         }
         list.innerHTML += categoryListEnd(id, listName.sufText);
         break;
      case 'assignee-list':
         for (let i = 0; i < arr.length; i++) {
            list.innerHTML += checkboxTemplate(id, arr[i]);
         }
         break;
   }
}

function categoryListEnd(id, txt) {
   return /*html*/ `<div><input type="radio" name="${id}" id="${id}-${txt}" class="display-none" value="" onclick="toggleAddField('new-category-input', 'category-inputs')"><label for="${id}-${txt}">${txt}</label></div>`;
}

function renderAssigneeList() {
   let div = document.getElementById(assigneeList.id);
   let arr = assigneeList.arr;
   div.innerHTML = `<summary><div id="assignee-summary">${assigneeList.preText}</div><img src="assets/img/sort-down.png"/></summary><div class="list-wrapper" id="assignee-list"></div>`;
   initList('assignee-list', arr, assigneeList);
}

function radioButtonTemplate(id, el) {
   return /*html*/ `
   <div><input type="radio" name="${id}" id="${id}-${el.id}" class="display-none" onchange="chosenCategory('${el.name}')" value="${el.id}"><label for="${id}-${el.id}">${el.name}</label></div>
   `;
}

function chosenCategory(name) {
   document.getElementById('category-summary').innerHTML = name;
   document.getElementById('category-inputs').open = false;
}

function toggleAddField(id, outerDivId) {
   document.getElementById(id).classList.toggle('display-none');
   document.getElementById(outerDivId).classList.toggle('display-none');
}

function checkboxTemplate(id, el) {
   return /*html*/ `
   <div><label for="${id}-${el.id}">${el.name}</label><input type="checkbox" name="${id}" id="${id}-${el.id}" value="${el.id}" onchange="refreshAssignees('${id}', '${el.id}')"></div>
   `;
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
   let checked = document.querySelectorAll('input[type="checkbox"]:checked');
   let unchecked = document.querySelectorAll('input[type="checkbox"]:not(:checked)');
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
      content.innerHTML += /*html*/ `<div>
      <input type="checkbox" class="display-none" value="${
         priority.name
      }" id="${id}"  onclick="colorPrioBtn('${id}', '${priority.color}')"/>
      <label for="form-pb-${priority.name}" class="form-pb-button">
      <h6>${capitalizeFirstLetter(priority.name)}</h6>
      <img src="${priority['icon_path']}" alt="priority icon ${priority['name']}">
    </div>`;
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
      if (!el.classList.contains('checked') & (el.id == id)) {
         el.classList.toggle('checked');
         btn.style.backgroundColor = `${color}`;
         btn.style.color = 'white';
      } else if (el.id == id) {
         return;
      } else {
         el.classList.remove('checked');
         el.checked = false;
         btn.style.backgroundColor = `white`;
         btn.style.color = 'black';
      }
   });
}

function renderSubtasks(HTMLId, taskId, useTmpTask) {
   let content = document.getElementById(HTMLId);
   let subTasks;

   if (useTmpTask) {
      subTasks = tmpTask;
   } else {
      subTasks = tasks[taskId]['subtasks'];
   }

   content.innerHTML = '';
   for (let i = 0; i < subTasks.length; i++) {
      const subTask = subTasks[i];

      content.innerHTML += /*html*/ `
    <div class="subtask-wrapper">
      <input type="checkbox">
      <p>${subTask['title']}</p>
      <img src="assets/img/cross.svg" style="transform: rotate(45deg); width: 20px; cursor: pointer" onclick="removeSubTask('subtasks-list', ${subTask['id']}, true)">
    </div>`;
   }
}

function addSubTask(formId, HTMLId, taskId, useTmpTask) {
   let name = document.getElementById(formId).value;
   let subTasks;

   if (useTmpTask) {
      subTasks = tmpTask;
      if (tmpTask.length == 0) {
         taskId = 0;
      } else {
         taskId = tmpTask[tmpTask.length - 1]['id'] + 1;
      }
   } else {
      subTasks = tasks[taskId]['subtasks'];
   }

   subTasks.push({
      id: taskId,
      title: name,
      status: 'open',
   });
   renderSubtasks(HTMLId, taskId, useTmpTask);
}

function removeSubTask(HTMLId, taskId, useTmpTask) {
   let subTasks;

   if (useTmpTask) {
      subTasks = tmpTask;
   } else {
      subTasks = tasks[taskId]['subtasks'];
   }

   subTasks.splice(taskId, 1);
   renderSubtasks(HTMLId, taskId, useTmpTask);
}

function changePreview() {
   let icon = document.getElementById('new-category-icon');
   icon.color = getFormValue('color-input-task');
   icon.setAttribute('style', colorContactIcon(icon).slice(7, -2));
}
