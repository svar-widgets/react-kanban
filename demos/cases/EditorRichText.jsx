import { useState, useEffect } from 'react';
import { getData } from '../data.js';
import { Kanban, Editor, registerEditorItem } from '../../src/index.js';
import { TinyMCE } from '@svar-ui/react-editor';
import { DemoPage } from '../ui/index.js';

import './EditorRichText.css';

registerEditorItem('tinymce', TinyMCE);

const { columns, cards: rawCards } = getData();

const details = {
  1: `<h3>Kanban spec</h3>
<p>Cover the <strong>model</strong>, the <strong>state</strong> and the <em>data flow</em>.</p>
<p>Keep the public API surface as small as possible.</p>`,
  2: `<p>Cards store with a <strong>reactive projection</strong> that builds the view data.</p>`,
  3: `<p>Theme variables for the card and column layout.</p>`,
};

const cards = rawCards.map((c) => ({
  ...c,
  details: details[c.id] ?? '',
}));

const items = [
  { comp: 'text', key: 'label', label: 'Title', required: true },
  {
    comp: 'tinymce',
    key: 'details',
    label: 'Details',
    toolbar:
      'undo redo | blocks | bold italic underline | alignleft aligncenter alignright',
  },
];

const topBar = {
  items: [
    { comp: 'icon', icon: 'wxi-close', id: 'close' },
    { comp: 'spacer' },
    { comp: 'button', id: 'save', text: 'Save', type: 'primary' },
  ],
};

function EditorRichText() {
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
          css="wx-editor-rich"
        />
      )}
    </DemoPage>
  );
}

export default EditorRichText;
