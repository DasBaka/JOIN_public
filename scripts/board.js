function initBoard() {
    renderTasks();
}

function renderTasks() {
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        let content = document.getElementById(`board-tasks-column-${task['status']}`);
        content.innerHTML += /*html*/ `
        <div class="task-preview-wrapper">
            <div>${task['category']}</div>
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
