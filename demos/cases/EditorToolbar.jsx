import { useState } from 'react';
import { card, getData } from '../data.js';
import { Kanban, Editor } from '../../src/index.js';
import { DemoPage, useDialogs } from '../ui/index.js';

const { columns, cards } = getData();

// the editor's own buttons are replaced: a title on top, actions below
const topBar = {
  items: [
    { comp: 'label', text: 'Edit card' },
    { comp: 'spacer' },
    { comp: 'icon', icon: 'wxi-close', id: 'close' },
  ],
};

function EditorToolbar() {
  const { confirm } = useDialogs();
  const [api, setApi] = useState(null);

  const bottomBar = {
    items: [
      {
        comp: 'button',
        id: 'delete',
        text: 'Delete',
        type: 'danger',
        onClick: handleDelete,
      },
      { comp: 'spacer' },
      { comp: 'button', id: 'close', text: 'Cancel' },
      { comp: 'button', id: 'save', text: 'Done', type: 'primary' },
    ],
  };

  async function handleDelete() {
    const data = api?.getState().editorData;
    if (!data) return;
    if (!(await confirm('Delete card?', 'This action cannot be undone.')))
      return;
    api.exec('delete-card', { id: data.id });
    api.exec('select-card', { id: null });
  }

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
          topBar={topBar}
          bottomBar={bottomBar}
          autoSave={false}
          onAction={onAction}
        />
      )}
    </DemoPage>
  );
}

export default EditorToolbar;
