let users = [
    {
        "username": "anton.meyer",
        "firstname": "Anton",
        "lastname": "Mayer",
        "mail": "antom@gmail.com",
        "color": "orange"
    },
    {
        "username": "anja.schulz",
        "firstname": "Anja",
        "lastname": "Schulz",
        "mail": "schulz@hotmail.com",
        "color": "violet"
    },
    {
        "username": "benedikt.ziegler",
        "firstname": "Benedikt",
        "lastname": "Ziegler",
        "mail": "benedikt@gmail.com",
        "color": "lightgreen"
    },
    {
        "username": "david.eisenberg",
        "firstname": "David",
        "lastname": "Eisenberg",
        "mail": "davidberg@gmail.com",
        "color": "red"
    },
    {
        "username": "eva.fischer",
        "firstname": "Eva",
        "lastname": "Fischer",
        "mail": "eva@gmail.com",
        "color": "lightblue"
    },
    {
        "username": "emmanuel.mauer",
        "firstname": "Emmanuel",
        "lastname": "Mauer",
        "mail": "emmanuelma@gmail.com",
        "color": "lightgrey"
    },
    {
        "username": "marcel.bauer",
        "firstname": "Marcel",
        "lastname": "Bauer",
        "mail": "bauer@gmail.com",
        "color": "lightpink"
    }
];

let tasks = [
    {
        "id": 0,
        "title": "Website redesign",
        "description": "Modify the contents of the main website...",
        "category": "Design",
        "assignees": [ "anton.meyer", "anja.schulz", "benedikt.ziegler" ],
        "due_date": "2023-04-01",
        "priority": "low",
        "status": "to-do",
        "subtasks": [
            {
                "id": 0,
                "title": "Subtask 1",
                "Status": "open"
            },
            {
                "id": 1,
                "title": "Subtask 2",
                "Status": "open"
            }
        ]
    },
    {
        "id": 1,
        "title": "Call Potential",
        "description": "Make the product presentation to prospective buyers",
        "category": "Sales",
        "assignees": [ "anton.meyer", "anja.schulz", "benedikt.ziegler" ],
        "due_date": "2023-04-01",
        "priority": "high",
        "status": "in-progress",
        "subtasks": []
    },
    {
        "id": 2,
        "title": "Accounting invoices",
        "description": "Write open invoices for customer",
        "category": "Backoffice",
        "assignees": [ "anton.meyer", "anja.schulz", "benedikt.ziegler" ],
        "due_date": "2023-04-01",
        "priority": "medium",
        "status": "awaiting-feedback",
        "subtasks": []
    },
    {
        "id": 3,
        "title": "Video cut",
        "description": "Edit the new company video",
        "category": "Media",
        "assignees": [ "anton.meyer", "anja.schulz", "benedikt.ziegler" ],
        "due_date": "2023-04-01",
        "priority": "medium",
        "status": "awaiting-feedback",
        "subtasks": []
    },
    {
        "id": 4,
        "title": "Social media strategy",
        "description": "Develop an ad campaign for brand positioning",
        "category": "Marketing",
        "assignees": [ "anton.meyer", "anja.schulz", "benedikt.ziegler" ],
        "due_date": "2023-04-01",
        "priority": "low",
        "status": "done",
        "subtasks": [
            {
                "id": 0,
                "title": "Subtask 1",
                "Status": "open"
            },
            {
                "id": 1,
                "title": "Subtask 2",
                "Status": "open"
            },
            {
                "id": 2,
                "title": "Subtask 3",
                "Status": "open"
            }
        ]
    }
]

let statuses = [
    {
        "name": "to-do",
        "displayName": "To Do"
    },
    {
        "name": "in-progress",
        "displayName": "In Progress"
    },
    {
        "name": "awaiting-feedback",
        "displayName": "Awaiting Feedback"
    },
    {
        "name": "done",
        "displayName": "Done"
    }
]

let categories = [
    {
        "name": "Sales",
        "color": "fuchsia",
    },
    {
        "name": "Design",
        "color": "orangered",
    },
    {
        "name": "Backoffice",
        "color": "deepskyblue",
    },
    {
        "name": "Media",
        "color": "orange",
    },
    {
        "name": "Marketing",
        "color": "blue",
    }
]
