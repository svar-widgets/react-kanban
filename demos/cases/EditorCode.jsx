import { useState, useEffect } from 'react';
import { getData } from '../data.js';
import { Kanban, Editor, registerEditorItem } from '../../src/index.js';
import { CodeMirror } from '@svar-ui/react-editor';
import { DemoPage } from '../ui/index.js';

import './EditorCode.css';

registerEditorItem('code-mirror', CodeMirror);

const { columns, cards: rawCards } = getData();

// card descriptions are written in markdown
const descriptions = {
  1: `# Kanban spec

Cover the **model**, the **state** and the *data flow*.

- \`KanbanModel\` - columns and cards
- \`CardsStore\` - CRUD and ordering

> Keep the public API surface as small as possible.`,
  2: `## Store

Cards store with a **reactive projection** that builds the view data.

1. CRUD and ordered insertion
2. \`upsert\` for dynamic hydration`,
  3: `Theme variables for the *card* and *column* layout.`,
};

const cards = rawCards.map((c) => ({
  ...c,
  description: descriptions[c.id] ?? c.description,
}));

const items = [
  { comp: 'text', key: 'label', label: 'Title', required: true },
  {
    comp: 'code-mirror',
    key: 'description',
    label: 'Description',
    language: 'markdown',
  },
];

const topBar = {
  items: [
    { comp: 'icon', icon: 'wxi-close', id: 'close' },
    { comp: 'spacer' },
    { comp: 'button', id: 'save', text: 'Save', type: 'primary' },
  ],
};

function EditorCode() {
  const [api, setApi] = useState(null);

  function handleAction({ item, changes }) {
    if (item.id === 'save' && changes.length === 0)
      api?.exec('select-card', { id: null });
  }

  useEffect(() => {
    if (api) api.exec('select-card', { id: 1 });
  }, [api]);

  return (
    <DemoPage>
      <Kanban init={(obj) => setApi(obj)} cards={cards} columns={columns} />
      {api && (
        <Editor
          api={api}
          items={items}
          topBar={topBar}
          autoSave={false}
          onAction={handleAction}
          css="wx-editor-code"
        />
      )}
    </DemoPage>
  );
}

export default EditorCode;
