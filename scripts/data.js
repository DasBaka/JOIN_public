// Safety Data to easily reset them for the backend.
// After changing storage.js to data.js inside one HTML-document:
// => setItem(key, dataArray) to upload one of these default data.

let usersSave = [
   {
      name: 'Anton Mayer',
      id: 'u0001',
      mail: 'antom@gmail.com',
      color: '#000300',
      phone: '',
      password: '',
   },
   {
      name: 'Anja Schulz',
      id: 'u0002',
      mail: 'schulz@hotmail.com',
      color: '#004500',
      phone: '',
      password: '',
   },
   // test

   {
      name: 'Michael Mustermann',
      id: 'u0003',
      mail: 'mm@mm.mm',
      color: '#fffa5f',
      phone: '',
      password: 'mm',
   },
   {
      name: 'Benedikt Ziegler',
      id: 'u0004',
      mail: 'benedikt@gmail.com',
      color: '#01f000',
      phone: '',
      password: '',
   },
   {
      name: 'David Eisenberg',
      id: 'u0005',
      mail: 'davidberg@gmail.com',
      color: '#006c00',
      phone: '',
      password: '',
   },
   {
      name: 'Eva Fischer',
      id: 'u0006',
      mail: 'eva@gmail.com',
      color: '#002d00',
      phone: '',
      password: '',
   },
   {
      name: 'Emmanuel Maurer',
      id: 'u0007',
      mail: 'emmanuelma@gmail.com',
      color: '#2d2dff',
      phone: '',
      password: '',
   },
   {
      name: 'Marcel Bauer',
      id: 'u0008',
      mail: 'bauer@gmail.com',
      color: '#ffaaff',
      phone: '',
      password: '',
   },

   {
      name: 'Jonas Holl',
      id: 'u0009',
      mail: 'jh1234@gmail.com',
      color: '#fbbfff',
      phone: '',
      password: '',
   },

   {
      name: 'Johannes Baum',
      id: 'u0010',
      mail: 'treethree@gmail.com',
      color: '#abcdef',
      phone: '',
      password: '',
   },
   {
      name: 'Friedrich Mai',
      id: 'u0011',
      mail: 'f82mai@gmail.com',
      color: '#fddfff',
      phone: '',
      password: '',
   },
   {
      name: 'Stefanie Sauer',
      id: 'u0012',
      mail: 'sauermachtlustig@gmail.com',
      color: '#ffffee',
      phone: '',
      password: '',
   },
];

let tasksSave = [
   {
      id: 't0001',
      title: 'Website redesign',
      description: 'Modify the contents of the main website...',
      category: 'c002',
      assignees: ['u0004', 'u0003', 'u0002'],
      due_date: '2023-04-01',
      priority: 'low',
      status: 'to-do',
      subtasks: [
         {
            id: 0,
            title: 'Subtask 1',
            status: 'open',
         },
         {
            id: 1,
            title: 'Subtask 2',
            status: 'done',
         },
      ],
   },
   {
      id: 't0002',
      title: 'Call potential clients',
      description: 'Make the product presentation to prospective buyers',
      category: 'c001',
      assignees: ['u0001', 'u0003', 'u0005', 'u0007'],
      due_date: '2023-04-01',
      priority: 'medium',
      status: 'to-do',
      subtasks: [],
   },
   {
      id: 't0003',
      title: 'Accounting invoices',
      description: 'Write open invoices for customer',
      category: 'c003',
      assignees: ['u0002', 'u0004', 'u0005', 'u0008', 'u0010'],
      due_date: '2023-04-02',
      priority: 'urgent',
      status: 'awaiting-feedback',
      subtasks: [],
   },
   {
      id: 't0004',
      title: 'Video cut',
      description: 'Edit the new company video',
      category: 'c004',
      assignees: ['u0006'],
      due_date: '2023-04-01',
      priority: 'medium',
      status: 'awaiting-feedback',
      subtasks: [],
   },
   {
      id: 't0005',
      title: 'Social media strategy',
      description: 'Develop an ad campaign for brand positioning',
      category: 'c005',
      assignees: ['u0011', 'u0012'],
      due_date: '2023-04-01',
      priority: 'low',
      status: 'done',
      subtasks: [
         {
            id: 's01',
            title: 'Subtask 1',
            status: 'done',
         },
         {
            id: 's02',
            title: 'Subtask 2',
            status: 'done',
         },
         {
            id: 's03',
            title: 'Subtask 3',
            status: 'open',
         },
      ],
   },
];

let statusesSave = [
   {
      name: 'to-do',
      displayName: 'To Do',
   },
   {
      name: 'in-progress',
      displayName: 'In Progress',
   },
   {
      name: 'awaiting-feedback',
      displayName: 'Awaiting Feedback',
   },
   {
      name: 'done',
      displayName: 'Done',
   },
];

let categoriesSave = [
   {
      category: 'Sales',
      id: 'c001',
      color: 'fuchsia',
   },
   {
      category: 'Design',
      id: 'c002',
      color: 'orangered',
   },
   {
      category: 'Backoffice',
      id: 'c003',
      color: 'deepskyblue',
   },
   {
      category: 'Media',
      id: 'c004',
      color: 'orange',
   },
   {
      category: 'Marketing',
      id: 'c005',
      color: 'blue',
   },
];

let prioritesSave = [
   {
      name: 'urgent',
      icon_path: 'assets/img/priority-urgent.svg',
      active_icon_path: 'assets/img/priority-urgent.png',
      color: 'darkred',
   },
   {
      name: 'medium',
      icon_path: 'assets/img/priority-medium.svg',
      active_icon_path: 'assets/img/priority-medium.png',
      color: 'darkorange',
   },
   {
      name: 'low',
      icon_path: 'assets/img/priority-low.svg',
      active_icon_path: 'assets/img/priority-low.png',
      color: 'darkgreen',
   },
];
