const minute = 1000 * 60;
const hour = minute * 60;
const day = hour * 24;
const year = day * 365;

let groupedByStatus = Object.values(groupItems(tasks, 'status'));
let groupedByPrio = Object.values(groupItems(tasks, 'priority'));

function initSummary() {
   refreshTasks();
   determineDaytime();
   nextDeadline();
}

function refreshTasks() {
   let stats = {
      'tasks-in-board': tasks.length,
      'tasks-in-progress': getLengthOfGroup(groupedByStatus, 'in-progress'),
      'awaiting-feedback': getLengthOfGroup(groupedByStatus, 'awaiting-feedback'),
      urgents: getLengthOfGroup(groupedByPrio, 'urgent'),
      'to-do': getLengthOfGroup(groupedByStatus, 'to-do'),
      done: getLengthOfGroup(groupedByStatus, 'done'),
   };
   Object.keys(stats).forEach((e) => {
      let key = String(e);
      document.getElementById(key).innerHTML = stats[key];
   });
}

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
}

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
