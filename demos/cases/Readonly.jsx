import { useState } from 'react';
import { card, getData } from '../data.js';
import { Kanban, Editor } from '../../src/index.js';
import { DemoPage, ToolbarGroup, Toggle, Hint } from '../ui/index.js';

const { columns, cards } = getData();

function Readonly() {
  const [api, setApi] = useState(null);
  const [readonly, setReadonly] = useState(true);

  // readonly blocks opening the editor, but keeps an already open one
  // mounted, so the sample closes it when switching readonly on
  function toggle({ value }) {
    setReadonly(value);
    if (value) api?.exec('select-card', { id: null });
  }

  return (
    <DemoPage
      toolbar={
        <ToolbarGroup>
          <Toggle label="Readonly" value={readonly} onChange={toggle} />
          <Hint>Drag, add and edit are blocked; columns still collapse.</Hint>
        </ToolbarGroup>
      }
    >
      <Kanban
        init={(obj) => setApi(obj)}
        cards={cards}
        columns={columns}
        card={card}
        readonly={readonly}
      />
      {api && <Editor api={api} />}
    </DemoPage>
  );
}

export default Readonly;
