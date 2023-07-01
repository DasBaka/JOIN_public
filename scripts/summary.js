const minute = 1000 * 60;
const hour = minute * 60;
const day = hour * 24;
const year = day * 365;

let groupedByStatus;
let groupedByPrio;

/**
 * Initializes the summary.html.
 * Also: redefines the grouped tasks.
 */
function initSummary() {
   groupedByStatus = Object.values(groupItems(tasks, 'status'));
   groupedByPrio = Object.values(groupItems(tasks, 'priority'));
   refreshTasks();
   determineDaytime();
   nextDeadline();
}

/**
 * Renders the summary.
 */
function refreshTasks() {
   let stats = {
      // summary stats/data
      'tasks-in-board': tasks.length,
      'tasks-in-progress': getLengthOfGroup(groupedByStatus, 'in-progress'),
      'awaiting-feedback': getLengthOfGroup(groupedByStatus, 'awaiting-feedback'),
      urgents: getLengthOfGroup(groupedByPrio, 'urgent'),
      'to-do': getLengthOfGroup(groupedByStatus, 'to-do'),
      done: getLengthOfGroup(groupedByStatus, 'done'),
   };
   Object.keys(stats).forEach((e) => {
      // the key tags are chosen to match the corresponding ids!
      let key = String(e);
      document.getElementById(key).innerHTML = stats[key];
   });
}

/**
 * Checks for the daytime and renders the greeting.
 */
function determineDaytime() {
   let greet = document.getElementById('greeting');
   let time = new Date();
   time = time.getHours();
   if (time < 12) {
      greet.innerHTML = 'Good morning,';
   } else if (time < 18) {
      greet.innerHTML = 'Good day,';
   } else if (time < 24) {
      greet.innerHTML = 'Good evening,';
   }
   greet.nextElementSibling.innerText = loginData.name ?? 'Sofia Müller';
   changeLoggedUser(greet);
}

/**
 * Checks for urgent tasks.
 */
function nextDeadline() {
   let date = document.getElementById('deadline');
   if (getLengthOfGroup(groupedByPrio, 'urgent') == 0) {
      date.innerHTML = 'No Deadlines';
      date.nextElementSibling.innerHTML = '';
   } else {
      date.innerHTML = getNextDeadline();
      date.nextElementSibling.innerHTML = 'Upcoming Deadline';
   }
}

/**
 * Searches the "urgent"-tasks for the next closest deadline.
 * @returns - formatted date (deadline)
 */
function getNextDeadline() {
   const formatter = new Intl.DateTimeFormat('en', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
   });
   let date = formatter.format(
      new Date(
         Object.keys(
            groupItems(
               groupedByPrio[getIndexOfValue(groupedByPrio, 'group', 'urgent')].value,
               'due_date'
            )
         ).sort()[0]
      )
   );
   return date;
}

/**
 * Counts the object amount of a specific group (needs a grouped Array).
 * @param {array} arr - grouped array
 * @param {key} ref - group identifier
 * @returns - object amount
 */
function getLengthOfGroup(arr, ref) {
   let result = arr.findIndex((e) => e.group == ref);
   if (result < 0) {
      return 0;
   } else {
      return arr[result].value.length;
   }
}
