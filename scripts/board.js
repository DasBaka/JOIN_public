let activeDragElement;
let activeTaskPriority;
let activeTaskAssignees;
let activeSubtasks;

/**
 * Initializes the board.
 */
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

/**
 * Returns the column element of the desired id.
 * @param {id} id - column id name
 * @returns
 */
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
      let categoryIndex = getIndexOfValue(categories, 'id', task['category']);
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
 * @param {Array} assigneeArray - array containing assignees
 * @param {String} HTMLElementId - HTMLElementId of the assignee list wrapper
 * @param {Boolean} previewListEnabled - whether it shall be rendered as Icons or full list
 * @param {Integer} previewListLength - length of assignee icons being rendered in preview
 */
function renderTaskAssignees(assigneeArray, HTMLElementId, previewListEnabled, previewListLength) {
   let assigneeListWrapper = document.getElementById(HTMLElementId);
   assigneeListWrapper.innerHTML = '';

   for (let j = 0; j < assigneeArray.length; j++) {
      let assignee = assigneeArray[j];
      let assigneeIndex = getIndexOfValue(users, 'id', assignee);
      console.log(assigneeIndex, assignee);
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
 * Opens details/edit modal.
 * @param {index} taskId - id of the task
 */
function showTaskDetails(taskId) {
   let modal = document.getElementById('modal');
   let task = tasks[getIndexOfValue(tasks, 'id', taskId)];
   let categoryIndex = getIndexOfValue(categories, 'id', task['category']);
   let priorityIndex = getIndexOfValue(priorites, 'name', task['priority']);
   modal.innerHTML = '';
   modal.innerHTML += taskCardDetailTemplate(task, taskId, categoryIndex, priorityIndex);
   renderTaskAssignees(task['assignees'], 'assignees-detailed');
   modal.showModal();
}

/**
 * Shows edit form for task.
 * @param {index} taskId - id of the task
 */
async function editTaskDetails(taskId) {
   let task = tasks[getIndexOfValue(tasks, 'id', taskId)];
   await repeatPageLoadForModal('templates/add-task-form.html')
      .then(() => initAddTaskForm())
      .then(() => {
         // close button
         addModalCloseButton();
      })
      .then(() => prepareEditView(task));
}

/**
 * Fills and renders the input fields of the add-task-form for edit view.
 * @param {object} task - task object
 */
function prepareEditView(task) {
   prepareFormForEditView(task);
   prepareCategoriesForEditView(task);
   prepareAssigneesForEditView(task);
   prepareSubtasksForEditView(task);
}

/**
 * Renders category list with pre-selected task item.
 * @param {object} task - task object
 */
function prepareCategoriesForEditView(task) {
   let catElement = categories[getIndexOfValue(categories, 'id', task.category)];
   implementCategory(task.category, true, categoryListItemTemplate(catElement));
}

/**
 * Renders assignee list with pre-selected assignees.
 * @param {object} task - task object
 */
function prepareAssigneesForEditView(task) {
   assigneeArray = [];
   task.assignees.forEach((el) => {
      assigneeArray.push(users[getIndexOfValue(users, 'id', el)]);
   });
   assigneeArray.forEach(
      (el) => (document.getElementById('assignee-list-' + el.id).checked = true)
   );
   renderAssigneePreview();
}

/**
 * Renders subtask list with available subtask.
 * @param {object} task - task object
 */
function prepareSubtasksForEditView(task) {
   subTasksArray = [];
   subTasksArray = task['subtasks'].slice();
   renderSubtasks();
}

/**
 * Fills and changes the fields of the add-task-form for edit view.
 * @param {object} task - task object
 */
function prepareFormForEditView(task) {
   document.getElementById('task-form-h1').innerHTML = 'Edit Task';
   prepareButtonsForEditView(task);
   letFormValue('form-input-title', task.title);
   letFormValue('form-input-description', task.description);
   letFormValue('form-input-dueDate', task['due_date']);
   document.getElementById('form-pb-' + task.priority).click();
}

/**
 * Changes button text and functions to match the edit view.
 * @param {object} task - task object
 */
function prepareButtonsForEditView(task) {
   document
      .getElementById('reset-button')
      .setAttribute('onclick', 'deleteTask("' + task.id + '");');
   document.getElementById('reset-button').innerHTML = 'Delete';
   document
      .getElementById('create-button')
      .setAttribute('onclick', 'applyEditTask("' + task.id + '");');
   document.getElementById('create-button').innerHTML = 'Edit';
}

/**
 * Write form values of edited task to the defined task and render board
 * @param {String} taskId - The task id on which task the changes shall be written to
 */
function applyEditTask(taskId) {
   let task = tasks[getIndexOfValue(tasks, 'id', taskId)];
   task.title = getFormValue('form-input-title');
   task.description = getFormValue('form-input-description') || '';
   task.category = document.getElementById('category-summary').value;
   task.assignees = getAssignees();
   task.due_date = getFormValue('form-input-dueDate');
   task.priority = getPriority();
   task.subtasks = subTasksArray;
   initBoard();
   closeModal();
}

/**
 * Deletes the task after confirmation.
 * @param {index} taskId - tasks id
 */
function deleteTask(taskId) {
   /*    let text = 'Do you want to delete this task?'; */
   tasks.splice(taskId, 1);
   initBoard();
   closeModal();
}

/**
 * Function for the "+"-buttons to add a new task (opens modal) for the clicked column.
 * @param {name} name - status name
 */
async function addTaskForStatus(name) {
   await repeatPageLoadForModal('templates/add-task-form.html').then(() => initAddTaskForm());
   currentStatus = name;
   let modal = document.getElementById('modal');
   modal.showModal();
}
