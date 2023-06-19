let activeDragElement;
let activeTaskPriority;
let activeTaskAssignees;

function initBoard() {
   renderColumns();
   renderTasks();
}

/**
 * Allows the drop of an element
 * @param {event} id - event which is allowed to be dropped
 */
function allowDrop(event) {
   event.preventDefault();
}

/**
 * Change task status to move element to another column and render board
 * @param {String} status - new task status
 */
function moveElementTo(status) {
   tasks[getIndexOfValue(tasks, 'id', activeDragElement)]['status'] = status;
   initBoard();
}

/**
 * Set variable which contains the task id of the currently dragged element
 * @param {String} taskId - The task id of the currently dragged element
 */
function setActiveDragElement(taskId) {
   activeDragElement = taskId;
}

/**
 * Write form values of edited task to the defined task and render board
 * @param {String} taskId - The task id on which task the changes shall be written to
 */
function applyEditTask(taskId) {
   let task = tasks[getIndexOfValue(tasks, 'id', taskId)];

   task['title'] = getFormValue('task-edit-from-input-title');
   task['description'] = getFormValue('task-edit-from-input-description');
   task['due_date'] = getFormValue('task-edit-from-input-dueDate');
   task['priority'] = getPriority();
   task['assignees'] = activeTaskAssignees;
   initBoard();
}

/**
 * Highlighting board columns as elements are dragged over it
 * @param {String} area - column (area) which shall be changed
 * @param {Boolean} highlight - whether the highlight of provided column (area) shall be added or removed
 */
function highlightSelectedDragArea(area, highlight) {
   let boardTasksColumn = document.getElementById('task-shadow-wrapper-' + area);
   if (tasks[getIndexOfValue(tasks, 'id', activeDragElement)]['status'] == area) {
      return;
   }
   if (highlight) {
      boardTasksColumn.classList.add('task-shadow-wrapper-highlighted');
   } else {
      boardTasksColumn.classList.remove('task-shadow-wrapper-highlighted');
   }
}

/**
 * Helper function to temporarily hide the original location "shadow" of the currently dragged element
 * @param {String} taskId - task id of the element which shall be changed
 * @param {Boolean} hide - wheather the provided element shall be hidden or displayed
 * TODO:
 */
function hideOriginalElementOnDrag(taskId, hide) {
   let activeTask = document.getElementById('task-preview-wrapper-' + taskId);
   if (hide) {
      activeTask.classList.add('hide-original-drag-element');
   } else {
      activeTask.classList.remove('hide-original-drag-element');
   }
}

/**
 * Highlight all columns (areas) where and element can be dragged to
 * @param {Boolean} action - wheather the available drag areas shall be highlighted
 */
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
         if (tasks[getIndexOfValue(tasks, 'id', activeDragElement)]['status'] == status['name']) {
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

/**
 * xy
 * @param {String} string - xy
 * @returns - xy
 * TODO: Replace function by task dropdown implementation
 */
function assigneeCheckboxSelection(HTMLElementId) {
   let checkbox = document.getElementById('task-edit-assignee-selection-checkbox-' + HTMLElementId);

   if (!checkbox.classList.contains('task-edit-assignee-selection-checkbox-filled')) {
      checkbox.classList.add('task-edit-assignee-selection-checkbox-filled');
   } else {
      checkbox.classList.remove('task-edit-assignee-selection-checkbox-filled');
   }
}

/**
 * xy
 * @param {String} string - xy
 * @returns - xy
 * TODO: Replace function by task dropdown implementation
 */
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

/**
 * Render columns based on statuses array
 */
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

/**
 * Render tasks based on tasks array
 */
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

/**
 * Render a tasks subtask progress
 * @param {Array} task - array containing all subtask infos
 */
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

/**
 * Render task assignees as 'icons' or 'list' based on parameters
 * @param {Array} assigneeArray - xy
 * @param {String} HTMLElementId - xy
 * @param {Boolean} previewListEnabled - xy
 * @param {Integer} previewListLength - xy
 * TODO: rework initial letter comosition
 */
function renderTaskAssignees(assigneeArray, HTMLElementId, previewListEnabled, previewListLength) {
   let assigneeListWrapper = document.getElementById(HTMLElementId);
   assigneeListWrapper.innerHTML = '';

   for (let j = 0; j < assigneeArray.length; j++) {
      let assignee = assigneeArray[j];
      let assigneeIndex = getIndexOfValueLowerCase(users, 'name', assignee);
      let assigneeInitials = initialLettersUpperCase(users[assigneeIndex]);

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

/**
 * Add or remove assignees from the passed assignee array reversed to the current state
 * @param {Array} assigneeArray - array containing a list of assignees
 * @param {String} assignee - the assignee which shall be either added or removed
 * @param {String} HTMLElementId - HTML document id which is being used to rerender task assignees on page
 */
function changeTaskAsssignee(assigneeArray, assignee, HTMLElementId) {
   let assigneeIndex = assigneeArray.indexOf(assignee);

   if (assigneeIndex == -1) {
      assigneeArray.push(assignee);
   } else {
      assigneeArray.splice(assigneeIndex, 1);
   }

   renderTaskAssignees(assigneeArray, HTMLElementId, true);
}

/**
 * +
 * @param {String} string - xy
 * @returns - xy
 */
function renderTaskAssigneeSelection(taskId, HTMLElementId, expandView) {
   let content = document.getElementById(HTMLElementId);

   if (!expandView) {
      content.innerHTML = taskEditAssigneeSelecTemplate(taskId, true);
      return;
   }

   content.innerHTML = taskEditAssigneeSelecTemplate(taskId, false);

   for (let i = 0; i < users.length; i++) {
      const user = users[i];

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

/**
 * xy
 * @param {String} string - xy
 * @returns - xy
 */
function showTaskDetails(taskId) {
   let modal = document.getElementById('modal');
   let task = tasks[getIndexOfValue(tasks, 'id', taskId)];

   let categoryIndex = getIndexOfValue(categories, 'name', task['category']);
   let priorityIndex = getIndexOfValue(priorites, 'name', task['priority']);

   modal.innerHTML = '';
   modal.innerHTML += taskCardDetailTemplate(task, taskId, categoryIndex, priorityIndex);
   renderTaskAssignees(task['assignees'], 'assignees-detailed');
   modal.showModal();
}

/**
 * xy
 * @param {String} string - xy
 * @returns - xy
 */
function editTaskDetails(taskId, show) {
   /*    if (!!document.getElementById('task-detailed-wrapper')) {
      document.getElementById('task-detailed-wrapper').remove();
      if (!show) return;
   } */

   let content = document.getElementById('modal');
   let task = tasks[getIndexOfValue(tasks, 'id', taskId)];
   activeTaskAssignees = task['assignees'].slice();

   content.innerHTML = editTaskTemplate(task, taskId);

   /*    renderPriorityButtons(taskId, 'task-edit-priority-buttons', null); */
   renderPriorityButtons('task-edit-priority-buttons');
   document.getElementById('form-pb-' + task.priority).click();
   renderTaskAssigneeSelection(taskId, 'task-edit-assignee-selection', false);
   renderTaskAssignees(activeTaskAssignees, 'task-edit-assignee-preview', true);
}

async function addTaskForStatus(name) {
   await repeatPageLoadForModal('templates/add-task-form.html').then(() => initAddTaskForm());
   currentStatus = name;
   let modal = document.getElementById('modal');
   modal.showModal();
}
