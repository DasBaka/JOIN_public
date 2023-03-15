function renderContacts() {
    let content = document.getElementById('contact-list-wrapper');
    content.innerHTML = '';

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        
        content.innerHTML += /*html*/ `
        <div>
            <div id="user-icon-${i}" class="user-icon">${user.firstname.charAt(0)}${user.lastname.charAt(0)}</div>
            <div>
                <h4>${user.firstname} ${user.lastname}</h4>
                <h6>${user.mail}</h6>
            </div>
        </div>
        `;

        document.getElementById(`user-icon-${i}`).style.backgroundColor = user.color;
    }
}