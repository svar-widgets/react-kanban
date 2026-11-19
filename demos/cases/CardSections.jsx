import { useState, useMemo } from 'react';
import { getData, users } from '../data.js';
import { Kanban, Editor, getEditorItems } from '../../src/index.js';
import { DemoPage, ToolbarGroup, Choice } from '../ui/index.js';

const { columns, cards } = getData();

// section options: own labels for priorities and tags, a date format
const priority = {
  data: [
    { id: 1, label: 'Low', css: 'wx-card-priority-low' },
    { id: 2, label: 'Normal', css: 'wx-card-priority-medium' },
    { id: 3, label: 'Urgent', css: 'wx-card-priority-high' },
  ],
};
const tags = {
  data: [
    { id: 'spec', label: 'Spec' },
    { id: 'docs', label: 'Docs' },
    { id: 'store', label: 'Store' },
    { id: 'ui', label: 'UI' },
    { id: 'editor', label: 'Editor' },
  ],
};
const deadline = { format: '%M %d' };

const levels = [
  { id: 1, label: 'XS' },
  { id: 2, label: 'S' },
  { id: 3, label: 'M' },
  { id: 4, label: 'L' },
  { id: 5, label: 'XL' },
];

// each level turns on more CardShape sections
const shapes = {
  1: {
    priority: false,
    progress: false,
    deadline: false,
    tags: false,
    description: false,
  },
  2: {
    priority,
    users,
    progress: false,
    deadline: false,
    tags: false,
    description: false,
  },
  3: {
    priority,
    users,
    progress: true,
    deadline,
    tags: false,
    description: false,
  },
  4: {
    priority,
    users,
    progress: { showLabel: true },
    deadline,
    tags,
    attachments: true,
    comments: true,
    description: false,
  },
  5: {
    cover: true,
    priority,
    users,
    progress: { showLabel: true },
    deadline,
    tags,
    attachments: true,
    comments: true,
    description: true,
  },
};
// the editor shows every field with the same priority and tag labels
const items = getEditorItems(shapes[5]);

function CardSections() {
  const [api, setApi] = useState(null);
  const [level, setLevel] = useState(3);

  const card = useMemo(() => shapes[Number(level)], [level]);

  return (
    <DemoPage
      toolbar={
        <ToolbarGroup label="Card size">
          <Choice
            options={levels}
            value={level}
            onChange={({ value }) => setLevel(value)}
          />
        </ToolbarGroup>
      }
    >
      <Kanban
        init={(obj) => setApi(obj)}
        cards={cards}
        columns={columns}
        card={card}
      />
      {api && <Editor api={api} items={items} />}
    </DemoPage>
  );
}

export default CardSections;
