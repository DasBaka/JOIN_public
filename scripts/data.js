// Safety Data to easily reset them for the backend.
// After changing storage.js to data.js inside one HTML-document:
// => setItem(key, dataArray) to upload one of these default data.

let users = [
   {
      name: 'Anton Mayer',
      id: 'u0001',
      mail: 'antom@gmail.com',
      color: '#000000',
      phone: '',
      password: '',
   },
   {
      name: 'Anja Schulz',
      id: 'u0002',
      mail: 'schulz@hotmail.com',
      color: '#000000',
      phone: '',
      password: '',
   },
   {
      name: 'Michael Mustermann',
      id: 'u0003',
      mail: 'mm@mm.mm',
      color: '#ffffff',
      phone: '',
      password: 'mm',
   },
   {
      name: 'Benedikt Ziegler',
      id: 'u0004',
      mail: 'benedikt@gmail.com',
      color: '#000000',
      phone: '',
      password: '',
   },
   {
      name: 'David Eisenberg',
      id: 'u0005',
      mail: 'davidberg@gmail.com',
      color: '#000000',
      phone: '',
      password: '',
   },
   {
      name: 'Eva Fischer',
      id: 'u0006',
      mail: 'eva@gmail.com',
      color: '#000000',
      phone: '',
      password: '',
   },
   {
      name: 'Emmanuel Maurer',
      id: 'u0007',
      mail: 'emmanuelma@gmail.com',
      color: '#ffffff',
      phone: '',
      password: '',
   },
   {
      name: 'Marcel Bauer',
      id: 'u0008',
      mail: 'bauer@gmail.com',
      color: '#ffffff',
      phone: '',
      password: '',
   },

   {
      name: 'Jonas Holl',
      id: 'u0009',
      mail: 'jh1234@gmail.com',
      color: '#ffffff',
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
      color: '#ffffff',
      phone: '',
      password: '',
   },
   {
      name: 'Stefanie Sauer',
      id: 'u0012',
      mail: 'sauermachtlustig@gmail.com',
      color: '#ffffff',
      phone: '',
      password: '',
   },
];

let tasks = [
   {
      id: 't0001',
      title: 'Website redesign',
      description: 'Modify the contents of the main website...',
      category: 'Design',
      assignees: ['anton mayer', 'johannes baum', 'benedikt ziegler'],
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
      category: 'Sales',
      assignees: ['anton mayer', 'anja schulz', 'benedikt ziegler', 'stefanie sauer'],
      due_date: '2023-04-01',
      priority: 'medium',
      status: 'to-do',
      subtasks: [],
   },
   {
      id: 't0003',
      title: 'Accounting invoices',
      description: 'Write open invoices for customer',
      category: 'Backoffice',
      assignees: [
         'anton mayer',
         'anja schulz',
         'benedikt ziegler',
         'stefanie sauer',
         'david eisenberg',
      ],
      due_date: '2023-04-02',
      priority: 'urgent',
      status: 'awaiting-feedback',
      subtasks: [],
   },
   {
      id: 't0004',
      title: 'Video cut',
      description: 'Edit the new company video',
      category: 'Media',
      assignees: ['benedikt ziegler'],
      due_date: '2023-04-01',
      priority: 'medium',
      status: 'awaiting-feedback',
      subtasks: [],
   },
   {
      id: 't0005',
      title: 'Social media strategy',
      description: 'Develop an ad campaign for brand positioning',
      category: 'Marketing',
      assignees: ['anja schulz', 'benedikt ziegler'],
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

let statuses = [
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

let categories = [
   {
      name: 'Sales',
      id: 'c001',
      color: 'fuchsia',
   },
   {
      name: 'Design',
      id: 'c002',
      color: 'orangered',
   },
   {
      name: 'Backoffice',
      id: 'c003',
      color: 'deepskyblue',
   },
   {
      name: 'Media',
      id: 'c004',
      color: 'orange',
   },
   {
      name: 'Marketing',
      id: 'c005',
      color: 'blue',
   },
];

let priorites = [
   {
      name: 'urgent',
      icon_path: 'assets/img/priority-urgent.svg',
      color: 'darkred',
   },
   {
      name: 'medium',
      icon_path: 'assets/img/priority-medium.svg',
      color: 'darkorange',
   },
   {
      name: 'low',
      icon_path: 'assets/img/priority-low.svg',
      color: 'darkgreen',
   },
];
