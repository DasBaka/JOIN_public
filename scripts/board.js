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
                <button class="board-column-add-task-button"><img src="assets/img/cross.png" alt="cross"></button>
            </div>
            <div id="board-tasks-column-${status['name']}" class="board-tasks-wrapper" ondrop="moveElementTo('${status['name']}')"
                ondragover="allowDrop(event); activeDragAreaHighlight('start', '${status['name']}')" ondragleave="activeDragAreaHighlight('leave', '${status['name']}')"></div>
        </div>
        `;
        document.getElementById(`board-tasks-column-${status['name']}`).innerHTML = '';
    }
}

function renderTasks() {
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        let content = document.getElementById(`board-tasks-column-${task['status']}`);
        let categoryIndex = categories.findIndex(key => key.name === task['category']);

        content.innerHTML += /*html*/ `
        <div id="task-preview-wrapper-${task['id']}" draggable="true" ondragstart="activeDragElement(${task['id']}), availableDragAreaHighlight('add')" ondragend="availableDragAreaHighlight('remove')" class="task-preview-wrapper">
            <div style="background-color: ${categories[categoryIndex]['color']};" 
                class="board-task-category">${task['category']}</div>
            <h5>${task['title']}</h5>
            <p>${task['description']}</p>
            <div id="task-preview-subtask-progress-wrapper-${task['id']}" class="task-preview-subtask-progress-wrapper"></div>
            <div class="task-preview-footer-wrapper">
                <div id="assignees-${task['id']}" class="board-user-icon-wrapper"></div>
                <img src="assets/img/priority-${task['priority']}.png" alt="">
            </div>
        </div>
        `;

        renderTaskPreviewSubtaskProgress(task);
        renderTaskPreviewAssignees(task);
    }
}

function renderTaskPreviewSubtaskProgress(task) {
    let wrapper = document.getElementById(`task-preview-subtask-progress-wrapper-${task['id']}`);
    let doneSubtasks = 0;

    if (task['subtasks'].length == 0) { return }

    for (let i = 0; i < task['subtasks'].length; i++) {
        const subtask = task['subtasks'][i];
        if (subtask['status'] == 'done') { doneSubtasks += 1; }
    }

    let doneSubtasksPercentage = doneSubtasks / task['subtasks'].length * 100;
    wrapper.innerHTML = /*html*/ `
    <div class="task-preview-subtask-progress-bar">
        <div class="task-preview-subtask-progress-bar-done" style="width: ${doneSubtasksPercentage}%"></div>
    </div>
    <div>${doneSubtasks}/${task['subtasks'].length} Done</div>
    `;
}

function renderTaskPreviewAssignees(task) {
    for (let j = 0; j < task['assignees'].length; j++) {
        const assignee = task['assignees'][j];
        let assigneeIndex = users.findIndex(key => key.username === assignee);
        let assigneeInitials = users[assigneeIndex]['firstname'].charAt(0) + users[assigneeIndex]['lastname'].charAt(0);
        let assigneeList = document.getElementById(`assignees-${task['id']}`);

        if (task['assignees'].length > 3 && j > 1) {
            assigneeList.innerHTML += /*html*/ `
            <div style="background-color: black;" 
                class="board-user-icon">${'+' + (task['assignees'].length - 2)}</div>
            `;
            return
        } else {
            assigneeList.innerHTML += /*html*/ `
            <div style="background-color: ${users[assigneeIndex]['color']};" 
                class="board-user-icon">${assigneeInitials}</div>
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
        if (tasks[activeDragDropElement]['status'] == status['name']) { continue }
        
        if (action == 'add') {
            document.getElementById('board-tasks-column-' + status['name']).innerHTML += /*html*/ `
            <div id="task-shadow-wrapper-${status['name']}" class="task-shadow-wrapper" style="height: 100px; width: 100px"></div>
            `;
        } else if (action == 'remove') {
            document.getElementById('task-shadow-wrapper-' + status['name']).remove();
        }
    }   
}

function activeDragAreaHighlight(action, area) {
    if (action == 'start') {
        if (tasks[activeDragDropElement]['status'] == area) { return }
        document.getElementById('board-tasks-column-' + area).classList.add('active-drag-area-highlight');
    } else if (action == 'leave') {
        document.getElementById('board-tasks-column-' + area).classList.remove('active-drag-area-highlight');
    }
}
