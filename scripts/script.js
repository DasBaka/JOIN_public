let users = [
    {
        "firstname": "Anton",
        "lastname": "Mayer",
        "mail": "antom@gmail.com",
        "color": "orange"
    },
    {
        "firstname": "Anja",
        "lastname": "Schulz",
        "mail": "schulz@hotmail.com",
        "color": "violet"
    },
    {
        "firstname": "Benedikt",
        "lastname": "Ziegler",
        "mail": "benedikt@gmail.com",
        "color": "lightgreen"
    },
    {
        "firstname": "David",
        "lastname": "Eisenberg",
        "mail": "davidberg@gmail.com",
        "color": "red"
    },
    {
        "firstname": "Eva",
        "lastname": "Fischer",
        "mail": "eva@gmail.com",
        "color": "lightblue"
    },
    {
        "firstname": "Emmanuel",
        "lastname": "Mauer",
        "mail": "emmanuelma@gmail.com",
        "color": "lightgrey"
    },
    {
        "firstname": "Marcel",
        "lastname": "Bauer",
        "mail": "bauer@gmail.com",
        "color": "lightpink"
    }
];

let login_status = false;

async function initialPageLoad() {
    await includeHTML();
    activeNavElement();
}

function initialRedirect() {
    if (login_status == false) {
        window.location.href = '/log-in.html';
    } else {
        window.location.href = '/summary.html';
    }
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function activeNavElement() {
    let navElements = ['summary', 'board', 'add-task', 'contacts', 'legal-notice'];
    for (let i = 0; i < navElements.length; i++) {
        const element = navElements[i];
        if (window.location.pathname.includes(element)) {
            document.getElementById("nav-element-" + element).classList.add('nav-element-active');
        }
    }
}

function logOutButtonVisibility() {
    let element = document.getElementById('log-out-button').classList;
    if (element.contains('display-none')) {
        element.remove('display-none');
    } else {
        element.add('display-none');
    }
}
