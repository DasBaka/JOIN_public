let activeDragDropElement;

function initBoard() {
  renderColumns();
  renderTasks();
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
          ondragover="allowDrop(event); activeDragAreaHighlight('start', '${status['name']}')" 
          ondragleave="activeDragAreaHighlight('leave', '${status['name']}')"></div>
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
    let categoryIndex = categories.findIndex(key => key.name === task['category']);
    let priorityIndex = priorites.findIndex(key => key.name === task['priority']);

    content.innerHTML += /*html*/ `
    <div id="task-preview-wrapper-${task['id']}" draggable="true" class="task-preview-wrapper grabbable"
      onclick="detailedTaskView('${task['id']}', true)"
      ondragstart="activeDragElement('${task['id']}'); availableDragAreaHighlight('add'); dragHideOriginalElement('${task['id']}', true)" 
      ondragend="availableDragAreaHighlight('remove'); dragHideOriginalElement('${task['id']}', false)">
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
    <div>${doneSubtasksCount}/${task['subtasks'].length} Done</div>
    `;
}

function renderTaskAssignees(taskId, renderType) {
  let task = tasks[taskId];

  for (let j = 0; j < task['assignees'].length; j++) {
    const assignee = task['assignees'][j];
    let assigneeIndex = users.findIndex(key => key.username === assignee);
    let assigneeInitials = users[assigneeIndex]['firstname'].charAt(0) + users[assigneeIndex]['lastname'].charAt(0);
    
    if (renderType == 'preview') {
      let assigneeList = document.getElementById(`assignees-${taskId}`);
      
      if (task['assignees'].length > 3 && j > 1) {
        assigneeList.innerHTML += /*html*/ `
        <div style="background-color: black;" class="board-user-icon">${'+' + (task['assignees'].length - 2)}</div>
        `;
        return
      } else {
        assigneeList.innerHTML += /*html*/ `
        <div style="background-color: ${users[assigneeIndex]['color']};" 
          class="board-user-icon">${assigneeInitials}</div>
        `;
      }
    } else if (renderType == 'detailed') {
      let assigneeList = document.getElementById('assignees-detailed');
      assigneeList.innerHTML += /*html*/ `
      <div class="task-detailed-assignee">
        <div style="background-color: ${users[assigneeIndex]['color']};" class="board-user-icon">${assigneeInitials}</div>
        <div>${users[assigneeIndex]['firstname']} ${users[assigneeIndex]['lastname']}</div>
      </div>
      `;
    }
  }
}

function allowDrop(event) {
  event.preventDefault();
}

function moveElementTo(status) {
  tasks[activeDragDropElement]['status'] = status;
  initBoard();
}

function activeDragElement(id) {
  activeDragDropElement = id;
}

function availableDragAreaHighlight(action) {
  let activeTaskWrapper = document.getElementById('task-preview-wrapper-' + activeDragDropElement);

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];

    if (action == 'add') {
      if (tasks[activeDragDropElement]['status'] == status['name']) { continue }
      document.getElementById('board-tasks-column-' + status['name']).innerHTML += /*html*/ `
        <div id="task-shadow-wrapper-${status['name']}" class="task-shadow-wrapper" 
          style="height: ${activeTaskWrapper.offsetHeight}px;"></div>
        `;
    } else if (action == 'remove') {
      if (!!document.getElementById('task-shadow-wrapper-' + status['name'])) {
        document.getElementById('task-shadow-wrapper-' + status['name']).remove();
      }
    }
  }
}

function activeDragAreaHighlight(action, area) {
  let boardTasksColumn = document.getElementById('task-shadow-wrapper-' + area);
  if (tasks[activeDragDropElement]['status'] == area) { return }
  if (action == 'start') {
    boardTasksColumn.classList.add('task-shadow-wrapper-highlighted');
  } else if (action == 'leave') {
    boardTasksColumn.classList.remove('task-shadow-wrapper-highlighted');
  }
}

function dragHideOriginalElement(taskId, action) {
  let activeTask = document.getElementById('task-preview-wrapper-' + taskId);
  if (action) {
    activeTask.classList.add('dragHideOriginal');
  } else {
    activeTask.classList.remove('dragHideOriginal');
  }
}

function detailedTaskView(taskId, action) {
  let mainWrapper = document.getElementById('main-wrapper');
  let task = tasks[taskId];

  if (action) {
    let categoryIndex = categories.findIndex(key => key.name === task['category']);
    let priorityIndex = priorites.findIndex(key => key.name === task['priority']);

    mainWrapper.innerHTML += /*html*/ `
    <div id="task-detailed-view" class="task-detailed-wrapper">
      <div class="task-detailed-content">
        <div class="task-detailed-close" onclick="detailedTaskView(null, false)">
          <img src="assets/img/cross.svg" alt="cross icon">
        </div>
        <div style="background-color: ${categories[categoryIndex]['color']}; font-size: 25px"
          class="board-task-category">${task['category']}</div>
        <h1>${task['title']}</h1>
        <p>${task['description']}</p> 
        <div class="task-detailed-attribute-wrapper">
          <h6>Due Date:</h6>
          <div>${task['due_date']}</div>
        </div>
        <div class="task-detailed-attribute-wrapper">
          <h6>Priority:</h6>
          <div class="task-detailed-priority" style="background-color: ${priorites[priorityIndex]['color']}">
          ${capitalizeFirstLetter(task['priority'])}
          <img id="task-detailed-priority-icon" src="${priorites[priorityIndex]['icon_path']}" alt="priority icon ${task['priority']}">
          </div>
        </div>
        <div>
          <h6>Assigned to:</h6>
          <div id="assignees-detailed"></div>
        </div>
        <button class="button-primary task-detailed-edit">
          <img src="assets/img/edit.svg" alt="edit pencil icon">
        </button>
      </div>
      <div class="task-detailed-background" onclick="detailedTaskView(null, false)"></div>
    </div>
    `;

    renderTaskAssignees(taskId, 'detailed');

  } else {
    document.getElementById('task-detailed-view').remove();
  }
}