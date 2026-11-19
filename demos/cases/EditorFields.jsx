import { useState } from 'react';
import { card, getData } from '../data.js';
import { Kanban, Editor, getEditorItems } from '../../src/index.js';
import { DemoPage } from '../ui/index.js';

const { columns, cards } = getData();

// the default fields for the card shape, priority made required
const items = [
  ...getEditorItems(card).map((item) =>
    item.key === 'priority' ? { ...item, required: true } : item,
  ),
  { comp: 'text', key: 'estimate', label: 'Estimate, hours' },
];

// with autoSave off, changes are applied by the Save button
const topBar = {
  items: [
    { comp: 'icon', icon: 'wxi-close', id: 'close' },
    { comp: 'spacer' },
    { comp: 'button', id: 'save', text: 'Save', type: 'primary' },
  ],
};

function EditorFields() {
  const [api, setApi] = useState(null);

  function onAction({ item, changes }) {
    if (item.id === 'save' && changes.length === 0)
      api?.exec('select-card', { id: null });
  }

  return (
    <DemoPage>
      <Kanban
        init={(obj) => setApi(obj)}
        cards={cards}
        columns={columns}
        card={card}
      />
      {api && (
        <Editor
          api={api}
          items={items}
          topBar={topBar}
          autoSave={false}
          onAction={onAction}
        />
      )}
    </DemoPage>
  );
}

export default EditorFields;
