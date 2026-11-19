export const users = {
  data: [
    { id: 1, label: 'Alice', img: './assets/avatar/909471384.webp' },
    { id: 2, label: 'Bob Damson', img: './assets/avatar/092352563.webp' },
    { id: 3, label: 'Carol Miller' },
  ],
};

export const card = {
  cover: true,
  priority: true,
  progress: true,
  description: true,
  deadline: true,
  tags: true,
  users,
  attachments: true,
  comments: true,
};

export function getData() {
  const columns = [
    { id: 'todo', label: 'To Do' },
    { id: 'doing', label: 'In Progress', addCard: false },
    { id: 'done', label: 'Done', addCard: false },
  ];

  const cards = [
    {
      id: 1,
      label: 'Draft kanban spec',
      description: 'Cover model, state, and data flow',
      column: 'done',
      cover: './assets/cover-njov.webp',
      priority: 2,
      progress: 1,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      tags: ['spec', 'docs'],
      users: [1],
      attachments: 2,
      comments: 3,
      tasks: 5,
    },
    {
      id: 2,
      label: 'Implement store',
      description: 'Cards store + reactive projection',
      column: 'doing',
      priority: 3,
      progress: 0.6,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      tags: ['store'],
      users: [1, 2],
      comments: 4,
      tasks: 8,
    },
    {
      id: 3,
      label: 'Render board',
      description: 'Wire up the widget shell and column layout',
      column: 'doing',
      cover: './assets/cover-nkeo.webp',
      priority: 3,
      progress: 0.3,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      tags: ['ui'],
      users: [1, 2, 3],
      attachments: 1,
    },
    {
      id: 4,
      label: 'Hook up editor',
      description: 'Bind editor form to update-card action',
      column: 'todo',
      priority: 1,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      tags: ['editor'],
      attachments: 3,
      comments: 1,
      tasks: 2,
    },
  ];

  return { columns, cards };
}

const groupByStages = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To Do' },
  { id: 'doing', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

const groupByPriorities = [
  { id: 1, label: 'Low', css: 'wx-card-priority-low' },
  { id: 2, label: 'Medium', css: 'wx-card-priority-medium' },
  { id: 3, label: 'High', css: 'wx-card-priority-high' },
];

export function getGroupByData() {
  const columnDefaults = { addCard: false };
  const columns = {
    stage: groupByStages.map((column) => ({ ...columnDefaults, ...column })),
    priority: groupByPriorities.map(({ id, label }) => ({
      ...columnDefaults,
      id,
      label,
    })),
    user: users.data.map(({ id, label }) => ({
      ...columnDefaults,
      id,
      label,
    })),
  };

  const cards = [
    {
      id: 1,
      label: 'Collect launch feedback',
      description: 'Summarize recurring requests from beta accounts',
      stage: 'backlog',
      priority: 2,
      progress: 0.1,
      user: 1,
      tags: ['research'],
      comments: 2,
    },
    {
      id: 2,
      label: 'Refresh onboarding board',
      description: 'Update default lanes and starter tasks',
      stage: 'todo',
      priority: 1,
      progress: 0.2,
      user: 2,
      tags: ['content'],
      attachments: 1,
    },
    {
      id: 3,
      label: 'Design priority swimlane view',
      description: 'Check card density and column labels',
      stage: 'doing',
      priority: 3,
      progress: 0.5,
      user: 3,
      tags: ['ui'],
      comments: 4,
    },
    {
      id: 4,
      label: 'Review account ownership',
      description: 'Validate that each customer card has one owner',
      stage: 'review',
      priority: 2,
      progress: 0.8,
      user: 1,
      tags: ['ops'],
    },
    {
      id: 5,
      label: 'Ship updated examples',
      description: 'Publish docs after QA signs off',
      stage: 'done',
      priority: 1,
      progress: 1,
      user: 2,
      tags: ['docs'],
      attachments: 3,
    },
    {
      id: 6,
      label: 'Prepare stakeholder review',
      description: 'Pull together screenshots and open questions',
      stage: 'todo',
      priority: 3,
      progress: 0.35,
      user: 3,
      tags: ['review'],
      comments: 1,
    },
    {
      id: 7,
      label: 'Audit release checklist',
      description: 'Confirm owners, deadlines, and rollout notes',
      stage: 'doing',
      priority: 2,
      progress: 0.65,
      user: 1,
      tags: ['release'],
      attachments: 2,
    },
    {
      id: 8,
      label: 'Close stale support threads',
      description: 'Mark resolved issues and escalate blockers',
      stage: 'review',
      priority: 1,
      progress: 0.9,
      user: 2,
      tags: ['support'],
      comments: 3,
    },
  ].map((card) => ({ ...card, users: [card.user] }));

  return { columns, cards, priorities: groupByPriorities };
}

export function getStyledData() {
  const columns = [
    { id: 'todo', label: 'To Do', css: 'col-todo' },
    { id: 'doing', label: 'In Progress', css: 'col-doing' },
    { id: 'done', label: 'Done', css: 'col-done' },
  ];

  const cards = [
    {
      id: 1,
      label: 'Draft kanban spec',
      column: 'done',
      priority: 2,
      progress: 1,
      users: [1],
    },
    {
      id: 2,
      label: 'Implement store',
      column: 'doing',
      priority: 3,
      progress: 0.6,
    },
    {
      id: 3,
      label: 'Render board',
      column: 'doing',
      priority: 3,
      progress: 0.3,
      users: [2],
    },
    {
      id: 4,
      label: 'Hook up editor',
      column: 'doing',
      priority: 1,
      progress: 0,
    },
    {
      id: 5,
      label: 'Review styling',
      column: 'done',
      priority: 2,
      progress: 1,
    },
    {
      id: 6,
      label: 'Polish docs',
      column: 'todo',
      priority: 1,
      progress: 0,
    },
    {
      id: 7,
      label: 'Triage feedback',
      column: 'todo',
      priority: 2,
      progress: 0,
      css: 'card-pinned',
    },
  ];

  return { columns, cards };
}

const generatedColumns = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To Do' },
  { id: 'doing', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

export function getGeneratedData(cardsPerColumn = 25) {
  const columns = generatedColumns.map((column) => ({ ...column }));
  const cards = columns.flatMap((column, columnIndex) =>
    Array.from({ length: cardsPerColumn }, (_, cardIndex) => {
      const id = columnIndex * cardsPerColumn + cardIndex + 1;

      return {
        id,
        label: `Generated card ${id}`,
        description: `Generated card ${cardIndex + 1} in ${column.label}`,
        column: column.id,
        priority: (cardIndex % 3) + 1,
        progress: ((cardIndex % 10) + 1) / 10,
        tags: [
          `group-${columnIndex + 1}`,
          `batch-${Math.floor(cardIndex / 25) + 1}`,
        ],
        users: [(cardIndex % 5) + 1],
      };
    }),
  );

  return { columns, cards };
}
