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
                ondragover="allowDrop(event); dragAreaHighlight('start', '${status['name']}')" ondragleave="dragAreaHighlight('leave', '${status['name']}')"></div>
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
        <div draggable="true" ondragstart="startDraggingElement(${task['id']})" class="task-preview-wrapper">
            <div style="background-color: ${categories[categoryIndex]['color']};" 
                class="board-task-category">${task['category']}</div>
            <h5>${task['title']}</h5>
            <p>${task['description']}</p>
            <div id="assignees-${i}" class="board-user-icon-wrapper"></div>
        </div>
        `;

        for (let j = 0; j < task['assignees'].length; j++) {
            const assignee = task['assignees'][j];
            let assigneeIndex = users.findIndex(key => key.username === assignee);
            let assigneeInitials = users[assigneeIndex]['firstname'].charAt(0) + users[assigneeIndex]['lastname'].charAt(0);
            let assigneeList = document.getElementById(`assignees-${i}`);

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

function startDraggingElement(id) {
    activeDragDropElement = id;
}

function dragAreaHighlight(action, area) {
    for (let i = 0; i < statuses.length; i++) {
        const status = statuses[i];
        document.getElementById('board-tasks-column-' + status['name']).classList.add('dragAreaHighlight');
    }

    if (action == 'start') {
        document.getElementById('board-tasks-column-' + area).classList.add('activeDragAreaHighlight');
    } else if (action == 'leave') {
        document.getElementById('board-tasks-column-' + area).classList.remove('activeDragAreaHighlight');
    }
}
