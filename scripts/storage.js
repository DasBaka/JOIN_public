const STORAGE_TOKEN = 'OMI0OIOG54B3Z42BRVLQ1CXTDWQ2R07GL5OWU60B';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

let categories;
let priorites;
let users;
let statuses;
let tasks;

// To save data on screen navigation.
window.addEventListener('beforeunload', () => setItems());

/**
 * Uploads data into the backend.
 * @param {key} key - data name (key)
 * @param {array} value - data array to upload
 * @returns - promise
 */
async function setItem(key, value) {
   const payload = { key, value, token: STORAGE_TOKEN };
   return fetch(STORAGE_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      keepalive: true, // needed to function with the "beforeunload"-eventlistener
   }).then((res) => res.json());
}

/**
 * Fetches data from the backend.
 * @param {key} key - key name to fetch
 * @returns - promise + JSON
 */
async function getItem(key) {
   const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;

   return fetch(url)
      .then((res) => res.json())
      .then((res) => res.data.value.replace(/'/g, '"'));
}

/**
 * Fetches all saved data on the backend.
 */
async function loadItems() {
   try {
      categories = JSON.parse(await getItem('categories'));
      priorites = JSON.parse(await getItem('priorites'));
      users = JSON.parse(await getItem('users'));
      statuses = JSON.parse(await getItem('statuses'));
      tasks = JSON.parse(await getItem('tasks'));
      loginData = JSON.parse(await getItem('loginData'));
   } catch (e) {
      console.info(e);
   }
   document.body.style = 'animation-play-state: running; opacity: 1';
}

/**
 * Saves all data to the backend.
 */
async function setItems() {
   Promise.all([
      setItem('users', JSON.stringify(users)),
      setItem('categories', JSON.stringify(categories)),
      setItem('priorites', JSON.stringify(priorites)),
      setItem('statuses', JSON.stringify(statuses)),
      setItem('tasks', JSON.stringify(tasks)),
      setItem('loginData', JSON.stringify(loginData)),
   ]);
}

/**
 * Debug function in case the original data were altered.
 * Resets backend data to the default data.
 * ONLY USABLE IN LOG-IN.HTML!!
 */
async function resetData() {
   users = usersSave;
   priorites = prioritesSave;
   tasks = tasksSave;
   categories = categoriesSave;
   statuses = statusesSave;
   await setItems();
}
