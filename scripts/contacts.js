let users = [
  {
    name: 'Anton Mayer',
    mail: 'antom@gmail.com',
    color: 'orange',
  },
  {
    name: 'Anja Schulz',
    mail: 'schulz@hotmail.com',
    color: 'violet',
  },
  {
    name: 'Benedikt Ziegler',
    mail: 'benedikt@gmail.com',
    color: 'lightgreen',
  },
  {
    name: 'David Eisenberg',
    mail: 'davidberg@gmail.com',
    color: 'red',
  },
  {
    name: 'Eva Fischer',
    mail: 'eva@gmail.com',
    color: 'lightblue',
  },
  {
    name: 'Emmanuel Maurer',
    mail: 'emmanuelma@gmail.com',
    color: 'lightgrey',
  },
  {
    name: 'Marcel Bauer',
    mail: 'bauer@gmail.com',
    color: 'lightpink',
  },

  {
    name: 'Jonas Holl',
    mail: 'jh1234@gmail.com',
    color: 'lightblue',
  },

  {
    name: 'Johannes Baum',
    mail: 'treethree@gmail.com',
    color: 'yellow',
  },
  {
    name: 'Friedrich Mai',
    mail: 'f82mai@gmail.com',
    color: 'blue',
  },
  {
    name: 'Stefanie Sauer',
    mail: 'sauermachtlustig@gmail.com',
    color: 'red',
  },
];

let groupedUsers;

function prepareContacts() {
  sortContacts();
  addGroup();
  groupedUsers = Object.values(groupItems(users, 'letter'));
}

function sortContacts() {
  users.sort(function (a, b) {
    if (a.name.toUpperCase() < b.name.toUpperCase()) {
      return -1;
    }
    if (a.name.toUpperCase() > b.name.toUpperCase()) {
      return 1;
    }
    return 0;
  });
}

function initialLetter(arrObj, pos) {
  return arrObj.name.charAt(pos);
}

function addGroup() {
  users.forEach((element) => {
    element['letter'] = initialLetter(element, 0);
  });
}

function initContainer(id) {
  let container = document.getElementById(id);
  container.innerHTML = '';
}

function addIntoContainer(id, content) {
  let container = document.getElementById(id);
  container.innerHTML += content;
}

function renderContacts() {
  initContainer('contact-list-wrapper');
  for (let i = 0; i < groupedUsers.length; i++) {
    addIntoContainer('contact-list-wrapper', `<h4 class="contact-list-divider">${groupedUsers[i]['group']}</h4>`);
    let contactArray = groupedUsers[i]['value'];
    for (let j = 0; j < contactArray.length; j++) {
      addIntoContainer('contact-list-wrapper', contactCardTemplate(contactArray[j], i, j));
      document.getElementById(`user-icon-${i}-${j}`).style.backgroundColor = contactArray[j].color;
    }
  }
}

function contactCardTemplate(user, i, j) {
  return /*html*/ `
  <input type="radio" name="contact-list-btns" id="contact-btn-${i}-${j}" class="contact-btn">
  <label for="contact-btn-${i}-${j}" class="contact-wrapper">
      <div id="user-icon-${i}-${j}" class="user-icon">${initialLetter(user, 0)}${initialLetter(user, user.name.search(' ') + 1)}</div>
      <div class="contact-details-short">
          <h4>${user.name}</h4>
          <h6 style="color: #007cee">${user.mail}</h6>
      </div>
  </div>

  `;
}

function groupItems(objArray, key) {
  return objArray.reduce((acc, element) => {
    let group = element[key];
    if (!acc[group]) {
      acc[group] = { group, value: [element] };
    } else {
      acc[group].value.push(element);
    }
    return acc;
  }, {});
}
