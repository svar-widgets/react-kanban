import { useState, useEffect } from 'react';
import { getData } from '../data.js';
import {
  Kanban,
  Editor,
  getEditorItems,
  registerEditorItem,
} from '../../src/index.js';
import { Comments } from '@svar-ui/react-comments';
import { Tasklist } from '@svar-ui/react-tasklist';
import { DemoPage } from '../ui/index.js';

// any component with a value/onChange pair can be an editor item
registerEditorItem('comments', Comments);
registerEditorItem('tasks', Tasklist);

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Carol' },
];

const { columns, cards: rawCards } = getData();

const daysAgo = (days, h) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(h, 0, 0, 0);
  return d;
};

const cards = rawCards.map((c) => ({
  ...c,
  comments:
    c.id === 1
      ? [
          { id: 1, user: 2, content: 'Agenda is ready.', date: daysAgo(1, 10) },
          {
            id: 2,
            user: 3,
            content: "I'll review the draft.",
            date: daysAgo(1, 14),
          },
        ]
      : [],
  tasks:
    c.id === 1
      ? [
          { id: 1, content: 'Outline data flow', status: 1 },
          { id: 2, content: 'Add diagrams', status: 0 },
        ]
      : [],
}));

const items = [
  ...getEditorItems(),
  { key: 'tasks', comp: 'tasks', label: 'Checklist' },
  {
    key: 'comments',
    comp: 'comments',
    label: 'Comments',
    users,
    activeUser: 1,
  },
];

function EditorCustomItems() {
  const [api, setApi] = useState(null);

  useEffect(() => {
    if (api) api.exec('select-card', { id: 1 });
  }, [api]);

  return (
    <DemoPage>
      <Kanban init={(obj) => setApi(obj)} cards={cards} columns={columns} />
      {api && <Editor api={api} items={items} />}
    </DemoPage>
  );
}

export default EditorCustomItems;
