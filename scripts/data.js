let users = [
   {
      name: 'Michael Mustermann',
      mail: 'mm@mm.mm',
      color: '#ffffff',
      phone: '',
      password: 'mm',
   },
];

let contacts = [
   {
      name: 'Anton Mayer',
      mail: 'antom@gmail.com',
      color: '#000000',
      phone: '',
   },
   {
      name: 'Anja Schulz',
      mail: 'schulz@hotmail.com',
      color: '#000000',
      phone: '',
   },
   {
      name: 'Benedikt Ziegler',
      mail: 'benedikt@gmail.com',
      color: '#000000',
      phone: '',
   },
   {
      name: 'David Eisenberg',
      mail: 'davidberg@gmail.com',
      color: '#000000',
      phone: '',
   },
   {
      name: 'Eva Fischer',
      mail: 'eva@gmail.com',
      color: '#000000',
      phone: '',
   },
   {
      name: 'Emmanuel Maurer',
      mail: 'emmanuelma@gmail.com',
      color: '#ffffff',
      phone: '',
   },
   {
      name: 'Marcel Bauer',
      mail: 'bauer@gmail.com',
      color: '#ffffff',
      phone: '',
   },

   {
      name: 'Jonas Holl',
      mail: 'jh1234@gmail.com',
      color: '#ffffff',
      phone: '',
   },

   {
      name: 'Johannes Baum',
      mail: 'treethree@gmail.com',
      color: '#abcdef',
      phone: '',
   },
   {
      name: 'Friedrich Mai',
      mail: 'f82mai@gmail.com',
      color: '#ffffff',
      phone: '',
   },
   {
      name: 'Stefanie Sauer',
      mail: 'sauermachtlustig@gmail.com',
      color: '#ffffff',
      phone: '',
   },
];

let tasks = [
   {
      id: 0,
      title: 'Website redesign',
      description: 'Modify the contents of the main website...',
      category: 'Design',
      assignees: ['anton mayer', 'anja schulz', 'benedikt ziegler'],
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
      id: 1,
      title: 'Call potential clients',
      description: 'Make the product presentation to prospective buyers',
      category: 'Sales',
      assignees: ['anton mayer', 'anja schulz', 'benedikt ziegler', 'stefanie sauer'],
      due_date: '2023-04-01',
      priority: 'urgent',
      status: 'in-progress',
      subtasks: [],
   },
   {
      id: 2,
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
      due_date: '2023-04-01',
      priority: 'medium',
      status: 'awaiting-feedback',
      subtasks: [],
   },
   {
      id: 3,
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
      id: 4,
      title: 'Social media strategy',
      description: 'Develop an ad campaign for brand positioning',
      category: 'Marketing',
      assignees: ['anja schulz', 'benedikt ziegler'],
      due_date: '2023-04-01',
      priority: 'low',
      status: 'done',
      subtasks: [
         {
            id: 0,
            title: 'Subtask 1',
            status: 'done',
         },
         {
            id: 1,
            title: 'Subtask 2',
            status: 'done',
         },
         {
            id: 2,
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
      color: 'fuchsia',
   },
   {
      name: 'Design',
      color: 'orangered',
   },
   {
      name: 'Backoffice',
      color: 'deepskyblue',
   },
   {
      name: 'Media',
      color: 'orange',
   },
   {
      name: 'Marketing',
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

let formDropDown = [
   {
      id: 'form-drop-down-category',
      dataArray: categories,
      heading: 'Select task category',
      elementId: 'name',
      elementName: ['name'],
      multiSelect: false,
      imgSrc: 'assets/img/sort-down.png',
      headingOverwrite: null,
      selectedElements: [],
      expandStatus: false,
   },
   {
      id: 'form-drop-down-assignee',
      dataArray: users,
      heading: 'Select contacts to assign',
      elementId: 'username',
      elementName: ['firstname', 'lastname'],
      multiSelect: true,
      imgSrc: 'assets/img/sort-down.png',
      headingOverwrite: null,
      selectedElements: [],
      expandStatus: false,
   },
];
