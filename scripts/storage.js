const STORAGE_TOKEN = 'FG7GOEK3SMFKE0RVSTG51MN8UTYEL0P7C9VJDO2G';

const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

window.addEventListener('beforeunload', () => setItems());

async function setItem(key, value) {
   const payload = { key, value, token: STORAGE_TOKEN };
   return fetch(STORAGE_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      keepalive: true,
   }).then((res) => res.json());
}

async function getItem(key) {
   const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;

   return fetch(url)
      .then((res) => res.json())
      .then((res) => res.data.value.replace(/'/g, '"'));
}

let categories;
let priorites;
let users;
let statuses;
let tasks;

async function loadItems() {
   try {
      categories = JSON.parse(await getItem('categories'));
      priorites = JSON.parse(await getItem('priorites'));
      users = JSON.parse(await getItem('users'));
      statuses = JSON.parse(await getItem('statuses'));
      tasks = JSON.parse(await getItem('tasks'));
   } catch (e) {
      console.info(e);
   }
   document.body.style = 'animation-play-state: running; opacity: 1';
}

async function setItems() {
   Promise.all([
      setItem('users', JSON.stringify(users)),
      setItem('categories', JSON.stringify(categories)),
      setItem('priorites', JSON.stringify(priorites)),
      setItem('statuses', JSON.stringify(statuses)),
      setItem('tasks', JSON.stringify(tasks)),
   ]);
}
