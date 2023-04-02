let activeDragElement;

function initBoard() {
  renderColumns();
  renderTasks();
  editTaskDetails(1, true);
}

function allowDrop(event) {
  event.preventDefault();
}

function moveElementTo(status) {
  tasks[activeDragElement]['status'] = status;
  initBoard();
}

function setActiveDragElement(id) {
  activeDragElement = id;
}

function getIndexOfValue(array, key, value) {
  return array.findIndex(k => k[key] === value);
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
          ondragover="allowDrop(event); highlightSelectedDragArea(true, '${status['name']}')" 
          ondragleave="highlightSelectedDragArea(false, '${status['name']}')"></div>
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
    </div>
    `;

    renderSubtaskProgress(task);
    renderTaskAssignees(task['id'], 'preview');
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

function renderTaskAssignees(taskId, renderType) {
  let task = tasks[taskId];

  for (let j = 0; j < task['assignees'].length; j++) {
    const assignee = task['assignees'][j];
    let assigneeIndex = getIndexOfValue(users, 'username', assignee);
    let assigneeInitials = users[assigneeIndex]['firstname'].charAt(0) + users[assigneeIndex]['lastname'].charAt(0);

    if (renderType == 'preview') {
      let assigneeList = document.getElementById(`assignees-${taskId}`);

      if (task['assignees'].length > 3 && j > 1) {
        assigneeList.innerHTML += /*html*/ `
        <div style="background-color: black;" class="board-user-icon">${'+' + (task['assignees'].length - 2)}</div>`;
        return
      } else {
        assigneeList.innerHTML += /*html*/ `
        <div style="background-color: ${users[assigneeIndex]['color']};" 
          class="board-user-icon">${assigneeInitials}</div>`;
      }
    } else if (renderType == 'detailed') {
      let assigneeList = document.getElementById('assignees-detailed');
      assigneeList.innerHTML += /*html*/ `
      <div class="task-detailed-assignee">
        <div style="background-color: ${users[assigneeIndex]['color']};" class="board-user-icon">${assigneeInitials}</div>
        <p>${users[assigneeIndex]['firstname']} ${users[assigneeIndex]['lastname']}</p>
      </div>`;
    }
  }
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
    </div>
    `;

    let priorityWrapper = document.getElementById('task-edit-priority-' + priority['name']);
    if (priority['name'] == activePriority) {
      priorityWrapper.style.backgroundColor = `${priority['color']}`;
      priorityWrapper.style.color = "white";
    } else if (!activePriority && priority['name'] == tasks[taskId]['priority']) {
      priorityWrapper.style.backgroundColor = `${priority['color']}`;
      priorityWrapper.style.color = "white";
    }
  }
  return activePriority;
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
        <div>${task['due_date']}</div>
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
  renderTaskAssignees(taskId, 'detailed');
}

function editTaskDetails(taskId, show) {
  let content = document.getElementById('main-wrapper');
  let task = tasks[taskId];

  if (!!document.getElementById('task-detailed-wrapper')) {
    document.getElementById('task-detailed-wrapper').remove();
    if (!show) return;
  }

  content.innerHTML += /*html*/ `
  <div id="task-detailed-wrapper" class="task-detailed-wrapper">
    <div id="task-detailed-content" class="task-detailed-content">
      <form class="task-edit-wrapper">
        <div class="task-detailed-close-button" onclick="editTaskDetails(null, false)">
          <img src="assets/img/cross.svg" alt="cross icon">
        </div>
        <div class="task-edit-form-item-wrapper">
          <h6>Title</h6>
          <input type="text" placeholder="Enter a Title" value="${task['title']}" class="form-text-input task-edit-heading-gap task-edit-form-text-input">
        </div>
        <div class="task-edit-form-item-wrapper">
          <h6>Description</h6>
          <textarea style="font-size: 1rem; margin: 0px;" rows="4" placeholder="Enter a Description" class="form-text-input task-edit-heading-gap task-edit-form-text-input">${task['description']}</textarea>
        </div>
        <div class="task-edit-form-item-wrapper">
          <h6>Due date</h6>
          <input type="text" placeholder="dd-mm-yyyy" value="${task['due_date']}" class="form-text-input task-edit-heading-gap task-edit-form-text-input">
        </div>
        <div class="task-edit-form-item-wrapper">
          <h6>Prio</h6>
          <div id="task-edit-priority-buttons" class="task-edit-priority-buttons task-edit-heading-gap"></div>
        </div>
        <div class="task-edit-form-item-wrapper">
          <h6>Assigned to</h6>
        </div>
        <button class="button-primary task-edit-button" onclick="">
          <h6>Ok</h6>
          <img src="assets/img/edit.svg" alt="Checkmark">
        </button>
      </form>
    </div>
    <div class="task-detailed-background" onclick="showTaskDetails(null, false)"></div>
  </div>`;

  renderPriorityButtons(taskId, 'task-edit-priority-buttons', null);
}
