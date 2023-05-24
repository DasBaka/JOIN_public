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
  if (tasks[activeDragElement]['status'] == area) { return }
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
  let activeDragElementHeight = document.getElementById('task-preview-wrapper-' + activeDragElement).offsetHeight;

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];
    let activeDragElementShadow = document.getElementById('task-shadow-wrapper-' + status['name']);
    let activeDragElementColumn = document.getElementById('board-tasks-column-' + status['name']);

    if (action) {
      if (tasks[activeDragElement]['status'] == status['name']) { continue }
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
  let boardWrapper = document.getElementById('board-wrapper');
  boardWrapper.innerHTML = '';

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];
    boardWrapper.innerHTML += /*html*/ `
      <div class="board-column">
        <div class="board-column-headline">
          <h3>${status['displayName']}</h3>
          <button class="board-column-add-task-button"><img src="assets/img/cross.svg" alt="cross"></button>
        </div>
        <div id="board-tasks-column-${status['name']}" class="board-tasks-wrapper" 
          ondrop="moveElementTo('${status['name']}')"
          ondragover="allowDrop(event); highlightSelectedDragArea('${status['name']}', true)" 
          ondragleave="highlightSelectedDragArea('${status['name']}', false)"></div>
      </div>
      `;
    document.getElementById(`board-tasks-column-${status['name']}`).innerHTML = '';
  }
}

function renderTasks() {
  let searchInput = document.getElementById('searchInput').value.toLowerCase();

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    if (searchInput && !(task['title'].toLowerCase().includes(searchInput) || task['description'].toLowerCase().includes(searchInput))) { continue }

    let content = document.getElementById(`board-tasks-column-${task['status']}`);
    let categoryIndex = getIndexOfValue(categories, 'name', task['category']);
    let priorityIndex = getIndexOfValue(priorites, 'name', task['priority']);

    content.innerHTML += /*html*/ `
    <div id="task-preview-wrapper-${task['id']}" draggable="true" class="task-preview-wrapper grabbable"
      onclick="showTaskDetails('${task['id']}', true)"
      ondragstart="setActiveDragElement('${task['id']}'); highlightAvailableDragArea(true); hideOriginalElementOnDrag('${task['id']}', true)" 
      ondragend="highlightAvailableDragArea(false); hideOriginalElementOnDrag('${task['id']}', false)">
      <div style="background-color: ${categories[categoryIndex]['color']};"
        class="board-task-category">${task['category']}</div>
      <h5>${task['title']}</h5>
      <p>${task['description']}</p>
      <div id="task-preview-subtask-progress-wrapper-${task['id']}" class="task-preview-subtask-progress-wrapper"></div>
      <div class="task-preview-footer-wrapper">
        <div id="assignees-${task['id']}" class="board-user-icon-wrapper"></div>
        <img src="${priorites[priorityIndex]['icon_path']}" alt="priority icon ${task['priority']}">
      </div>
    </div>`;

    renderSubtaskProgress(task);
    renderTaskAssignees(task['assignees'], `assignees-${task['id']}`, true, 3);
  }
}

function renderSubtaskProgress(task) {
  let wrapper = document.getElementById(`task-preview-subtask-progress-wrapper-${task['id']}`);
  let doneSubtasksCount = 0;

  if (task['subtasks'].length == 0) { return }

  for (let i = 0; i < task['subtasks'].length; i++) {
    const subtask = task['subtasks'][i];
    if (subtask['status'] == 'done') { doneSubtasksCount += 1; }
  }

  let doneSubtasksPercentage = doneSubtasksCount / task['subtasks'].length * 100;
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
    <div id="task-edit-priority-${priority['name']}" class="task-edit-priority" onclick="renderPriorityButtons('${taskId}', '${HTMLElementId}', '${priority['name']}')">
      <h6>${capitalizeFirstLetter(priority.name)}</h6>
      <img src="${priority['icon_path']}" alt="priority icon ${priority['name']}">
    </div>`;

    let priorityWrapper = document.getElementById('task-edit-priority-' + priority['name']);
    if (priority['name'] == activePriority) {
      priorityWrapper.style.backgroundColor = `${priority['color']}`;
      priorityWrapper.style.color = "white";
      activeTaskPriority = priority['name'];
    } else if (!activePriority && priority['name'] == tasks[taskId]['priority']) {
      priorityWrapper.style.backgroundColor = `${priority['color']}`;
      priorityWrapper.style.color = "white";
      activeTaskPriority = priority['name'];
    }
  }
}

function renderTaskAssignees(assigneeArray, HTMLElementId, previewListEnabled, previewListLength) {
  let assigneeListWrapper = document.getElementById(HTMLElementId);
  assigneeListWrapper.innerHTML = '';

  for (let j = 0; j < assigneeArray.length; j++) {
    const assignee = assigneeArray[j];
    let assigneeIndex = getIndexOfValue(users, 'username', assignee);
    let assigneeInitials = users[assigneeIndex]['firstname'].charAt(0) + users[assigneeIndex]['lastname'].charAt(0);

    if (previewListEnabled) {
      if (assigneeArray.length > previewListLength && j > 1) {
        assigneeListWrapper.innerHTML += /*html*/ `
        <div style="background-color: black;" class="board-user-icon">${'+' + (assigneeArray.length - 2)}</div>`;
        return
      } else {
        assigneeListWrapper.innerHTML += /*html*/ `
        <div style="background-color: ${users[assigneeIndex]['color']};"
          class="board-user-icon">${assigneeInitials}</div>`;
      }
    } else {
      assigneeListWrapper.innerHTML += /*html*/ `
      <div class="task-detailed-assignee">
        <div style="background-color: ${users[assigneeIndex]['color']};" class="board-user-icon">${assigneeInitials}</div>
        <p>${users[assigneeIndex]['firstname']} ${users[assigneeIndex]['lastname']}</p>
      </div>`;
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
  let task = tasks[taskId];
  let content = document.getElementById(HTMLElementId);

  if (!expandView) {
    content.innerHTML = /*html*/ `
    <div class="task-edit-assignee-selection-item" onclick="renderTaskAssigneeSelection(${taskId}, 'task-edit-assignee-selection', true)">
      <h6>Select contacts to assign</h6>
      <img src="assets/img/sort-down.png" alt="triangular down icon">
    </div>`;
    return
  }

  content.innerHTML = /*html*/ `
  <div class="task-edit-assignee-selection-item" onclick="renderTaskAssigneeSelection(${taskId}, 'task-edit-assignee-selection', false)">
    <h6>Select contacts to assign</h6>
    <img src="assets/img/sort-down.png" alt="triangular down icon">
  </div>`;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    content.innerHTML += /*html*/ `
    <div class="task-edit-assignee-selection-item" onclick="assigneeCheckboxSelection(${i}); changeTaskAsssignee(activeTaskAssignees, '${user['username']}', 'task-edit-assignee-preview',)">
      <h6>${user['firstname']} ${user['lastname']}</h6>
      <div id="task-edit-assignee-selection-checkbox-${i}" class="task-edit-assignee-selection-checkbox"></div>
    </div>`;

    if (tasks[taskId]['assignees'].indexOf(user['username']) > -1) { assigneeCheckboxSelection(i) }
  }

  content.innerHTML += /*html*/ `
  <div class="task-edit-assignee-selection-item" onclick="assigneeSelectionInviteContact(${taskId})">
    <h6>Invite new contact</h6>
    <img src="assets/img/contact-book.png" alt="contact book icon">
  </div>`;
}

function showTaskDetails(taskId, show) {
  let content = document.getElementById('main-wrapper');
  let task = tasks[taskId];

  if (!!document.getElementById('task-detailed-wrapper')) {
    document.getElementById('task-detailed-wrapper').remove();
    if (!show) return;
  }

  let categoryIndex = getIndexOfValue(categories, 'name', task['category']);
  let priorityIndex = getIndexOfValue(priorites, 'name', task['priority']);

  content.innerHTML += /*html*/ `
  <div id="task-detailed-wrapper" class="task-detailed-wrapper">
    <div id="task-detailed-content" class="task-detailed-content">
      <div class="task-detailed-close-button" onclick="showTaskDetails(null, false)">
        <img src="assets/img/cross.svg" alt="cross icon">
      </div>
      <div style="background-color: ${categories[categoryIndex]['color']}"
        class="board-task-category"><h4>${task['category']}</h4></div>
      <h2>${task['title']}</h2>
      <p>${task['description']}</p> 
      <div class="task-detailed-attribute-wrapper">
        <h5>Due Date:</h5>
        <div>${new Date(task['due_date']).toDateString()}</div>
      </div>
      <div class="task-detailed-attribute-wrapper">
        <h5>Priority:</h5>
        <div class="task-detailed-priority" style="background-color: ${priorites[priorityIndex]['color']}">
          <h6>${capitalizeFirstLetter(task['priority'])}</h6>
          <img src="${priorites[priorityIndex]['icon_path']}" alt="priority icon ${task['priority']}">
        </div>
      </div>
      <div>
        <h5>Assigned to:</h5>
        <div id="assignees-detailed"></div>
      </div>
      <button class="button-primary task-edit-button" onclick="editTaskDetails(${taskId}, true)">
        <img src="assets/img/edit.svg" alt="edit pencil icon">
      </button>
    </div>
    <div class="task-detailed-background" onclick="showTaskDetails(null, false)"></div>
  </div>`;

  renderTaskAssignees(task['assignees'], 'assignees-detailed');
}

function editTaskDetails(taskId, show) {
  if (!!document.getElementById('task-detailed-wrapper')) {
    document.getElementById('task-detailed-wrapper').remove();
    if (!show) return;
  }

  let content = document.getElementById('main-wrapper');
  let task = tasks[taskId];
  activeTaskAssignees = task['assignees'].slice();

  content.innerHTML += /*html*/ `
  <div id="task-detailed-wrapper" class="task-detailed-wrapper">
    <div id="task-detailed-content" class="task-detailed-content">
      <div class="task-edit-wrapper">
        <div class="task-detailed-close-button" onclick="editTaskDetails(null, false)">
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
          <div id="task-edit-priority-buttons" class="task-edit-priority-buttons task-edit-heading-gap"></div>
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
        <button class="button-primary task-edit-button" onclick="applyEditTask(${taskId})">
          <h6>Ok</h6>
          <img src="assets/img/check-white.png" alt="Checkmark">
        </button>
      </div>
    </div>
    <div class="task-detailed-background" onclick="showTaskDetails(null, false)"></div>
  </div>`;

  renderPriorityButtons(taskId, 'task-edit-priority-buttons', null);
  renderTaskAssigneeSelection(taskId, 'task-edit-assignee-selection', false);
  renderTaskAssignees(activeTaskAssignees, 'task-edit-assignee-preview', true);
}
