let activeDragElement;
let activeTaskPriority;
let activeTaskAssignees;

function initBoard() {
   renderColumns();
   renderTasks();
}

function allowDrop(event) {
   event.preventDefault();
}

function moveElementTo(status) {
   tasks[activeDragElement]['status'] = status;
   initBoard();
}

function setActiveDragElement(taskId) {
   activeDragElement = taskId;
}

function applyEditTask(taskId) {
   let task = tasks[taskId];

   task['title'] = document.getElementById('task-edit-from-input-title').value;
   task['description'] = document.getElementById('task-edit-from-input-description').value;
   task['due_date'] = document.getElementById('task-edit-from-input-dueDate').value;
   task['priority'] = activeTaskPriority;
   task['assignees'] = activeTaskAssignees;
   editTaskDetails(taskId, false);
   initBoard();
}

function highlightSelectedDragArea(area, highlight) {
   let boardTasksColumn = document.getElementById('task-shadow-wrapper-' + area);
   if (tasks[activeDragElement]['status'] == area) {
      return;
   }
   if (highlight) {
      boardTasksColumn.classList.add('task-shadow-wrapper-highlighted');
   } else {
      boardTasksColumn.classList.remove('task-shadow-wrapper-highlighted');
   }
}

function hideOriginalElementOnDrag(taskId, action) {
   let activeTask = document.getElementById('task-preview-wrapper-' + taskId);
   if (action) {
      activeTask.classList.add('hide-original-drag-element');
   } else {
      activeTask.classList.remove('hide-original-drag-element');
   }
}

function highlightAvailableDragArea(action) {
   let activeDragElementHeight = document.getElementById(
      'task-preview-wrapper-' + activeDragElement
   ).offsetHeight;

   for (let i = 0; i < statuses.length; i++) {
      const status = statuses[i];
      let activeDragElementShadow = document.getElementById(
         'task-shadow-wrapper-' + status['name']
      );
      let activeDragElementColumn = document.getElementById('board-tasks-column-' + status['name']);

      if (action) {
         if (tasks[activeDragElement]['status'] == status['name']) {
            continue;
         }
         activeDragElementColumn.innerHTML += /*html*/ `
      <div id="task-shadow-wrapper-${status['name']}" class="task-shadow-wrapper" 
        style="height: ${activeDragElementHeight}px;"></div>`;
      } else {
         if (!!activeDragElementShadow) {
            activeDragElementShadow.remove();
         }
      }
   }
}

function assigneeCheckboxSelection(HTMLElementId) {
   let checkbox = document.getElementById('task-edit-assignee-selection-checkbox-' + HTMLElementId);

   if (!checkbox.classList.contains('task-edit-assignee-selection-checkbox-filled')) {
      checkbox.classList.add('task-edit-assignee-selection-checkbox-filled');
   } else {
      checkbox.classList.remove('task-edit-assignee-selection-checkbox-filled');
   }
}

function assigneeSelectionInviteContact() {
   let assigneeSelection = document.getElementById('task-edit-assignee-selection');
   let contactInvite = document.getElementById('task-edit-assignee-contact-invite');

   if (contactInvite.classList.contains('display-none')) {
      assigneeSelection.classList.add('display-none');
      contactInvite.classList.remove('display-none');
   } else {
      assigneeSelection.classList.remove('display-none');
      contactInvite.classList.add('display-none');
   }
}

function renderColumns() {
   let board = document.getElementById('board-wrapper');
   board.innerHTML = '';

   for (let i = 0; i < statuses.length; i++) {
      const status = statuses[i];
      board.innerHTML += boardTemplate(status);
      columnId(status['name']).innerHTML = '';
   }
}

function columnId(id) {
   return document.getElementById('board-tasks-column-' + id);
}

function filterTasksViaSearch(task) {
   let searchInput = document.getElementById('searchInput').value.toLowerCase();

   return (
      searchInput &&
      !(
         task['title'].toLowerCase().includes(searchInput) ||
         task['description'].toLowerCase().includes(searchInput)
      )
   );
}

function renderTasks() {
   for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      if (filterTasksViaSearch(task)) {
         continue;
      }

      let content = columnId(task['status']);
      let categoryIndex = getIndexOfValue(categories, 'name', task['category']);
      let priorityIndex = getIndexOfValue(priorites, 'name', task['priority']);

      content.innerHTML += taskCardTemplate(task, categoryIndex, priorityIndex);

      renderSubtaskProgress(task);
      renderTaskAssignees(task['assignees'], `assignees-${task['id']}`, true, 3);
   }
}

function renderSubtaskProgress(task) {
   let wrapper = document.getElementById(`task-preview-subtask-progress-wrapper-${task['id']}`);
   let doneSubtasksCount = 0;

   if (task['subtasks'].length == 0) {
      return;
   }

   for (let i = 0; i < task['subtasks'].length; i++) {
      const subtask = task['subtasks'][i];
      if (subtask['status'] == 'done') {
         doneSubtasksCount += 1;
      }
   }

   let doneSubtasksPercentage = (doneSubtasksCount / task['subtasks'].length) * 100;
   wrapper.innerHTML = /*html*/ `
    <div class="task-preview-subtask-progress-bar">
      <div class="task-preview-subtask-progress-bar-done" style="width: ${doneSubtasksPercentage}%"></div>
    </div>
    <div>${doneSubtasksCount}/${task['subtasks'].length} Done</div>`;
}

function renderPriorityButtons(taskId, HTMLElementId, activePriority) {
   let content = document.getElementById(HTMLElementId);
   content.innerHTML = '';

   for (let i = 0; i < priorites.length; i++) {
      const priority = priorites[i];
      content.innerHTML += /*html*/ `
    <div id="task-edit-priority-${
       priority['name']
    }" class="task-edit-priority" onclick="renderPriorityButtons('${taskId}', '${HTMLElementId}', '${
         priority['name']
      }')">
      <h6>${capitalizeFirstLetter(priority.name)}</h6>
      <img src="${priority['icon_path']}" alt="priority icon ${priority['name']}">
    </div>`;

      let priorityWrapper = document.getElementById('task-edit-priority-' + priority['name']);
      if (priority['name'] == activePriority) {
         priorityWrapper.style.backgroundColor = `${priority['color']}`;
         priorityWrapper.style.color = 'white';
         activeTaskPriority = priority['name'];
      } else if (!activePriority && priority['name'] == tasks[taskId]['priority']) {
         priorityWrapper.style.backgroundColor = `${priority['color']}`;
         priorityWrapper.style.color = 'white';
         activeTaskPriority = priority['name'];
      }
   }
}

function renderTaskAssignees(assigneeArray, HTMLElementId, previewListEnabled, previewListLength) {
   let assigneeListWrapper = document.getElementById(HTMLElementId);
   assigneeListWrapper.innerHTML = '';

   for (let j = 0; j < assigneeArray.length; j++) {
      let assignee = assigneeArray[j];
      let assigneeIndex = getIndexOfValueLowerCase(contacts, 'name', assignee);
      let assigneeInitials =
         initialLetter(contacts[assigneeIndex], 0) +
         initialLetter(contacts[assigneeIndex], contacts[assigneeIndex].name.search(' ') + 1);

      if (previewListEnabled) {
         if (assigneeArray.length > previewListLength && j > 1) {
            assigneeListWrapper.innerHTML += furtherAssigneeAmountTemplate(assigneeArray);
            return;
         } else {
            assigneeListWrapper.innerHTML += userPreviewBoardIconTemplate(
               assigneeIndex,
               assigneeInitials,
               false
            );
         }
      } else {
         assigneeListWrapper.innerHTML += userPreviewBoardIconTemplate(
            assigneeIndex,
            assigneeInitials,
            true
         );
      }
   }
}

function changeTaskAsssignee(assigneeArray, assignee, HTMLElementId) {
   let assigneeIndex = assigneeArray.indexOf(assignee);

   if (assigneeIndex == -1) {
      assigneeArray.push(assignee);
   } else {
      assigneeArray.splice(assigneeIndex, 1);
   }

   renderTaskAssignees(assigneeArray, HTMLElementId, true);
}

function renderTaskAssigneeSelection(taskId, HTMLElementId, expandView) {
   let content = document.getElementById(HTMLElementId);

   if (!expandView) {
      content.innerHTML = taskEditAssigneeSelecTemplate(taskId, true);
      return;
   }

   content.innerHTML = taskEditAssigneeSelecTemplate(taskId, false);

   for (let i = 0; i < users.length; i++) {
      const user = contacts[i];

      content.innerHTML += assigneeEditTemplate(i, user);

      if (tasks[taskId]['assignees'].indexOf(user['username']) > -1) {
         assigneeCheckboxSelection(i);
      }
   }

   content.innerHTML += /*html*/ `
  <div class="task-edit-assignee-selection-item" onclick="assigneeSelectionInviteContact(${taskId})">
    <h6>Invite new contact</h6>
    <img src="assets/img/contact-book.png" alt="contact book icon">
  </div>`;
}

function showTaskDetails(taskId) {
   let modal = document.getElementById('modal');
   let task = tasks[taskId];

   let categoryIndex = getIndexOfValue(categories, 'name', task['category']);
   let priorityIndex = getIndexOfValue(priorites, 'name', task['priority']);

   modal.innerHTML = '';
   modal.innerHTML += taskCardDetailTemplate(task, taskId, categoryIndex, priorityIndex);
   renderTaskAssignees(task['assignees'], 'assignees-detailed');
   modal.showModal();
}

function editTaskDetails(taskId, show) {
   /*    if (!!document.getElementById('task-detailed-wrapper')) {
      document.getElementById('task-detailed-wrapper').remove();
      if (!show) return;
   } */

   let content = document.getElementById('modal');
   let task = tasks[taskId];
   activeTaskAssignees = task['assignees'].slice();

   content.innerHTML = editTaskTemplate(task, taskId);

   renderPriorityButtons(taskId, 'task-edit-priority-buttons', null);
   renderTaskAssigneeSelection(taskId, 'task-edit-assignee-selection', false);
   renderTaskAssignees(activeTaskAssignees, 'task-edit-assignee-preview', true);
}
