import { useState } from 'react';
import { card, getData } from '../data.js';
import { Kanban, Editor, getEditorItems } from '../../src/index.js';
import { DemoPage } from '../ui/index.js';

const { columns, cards } = getData();

function BasicInit() {
  const [api, setApi] = useState(null);

  const items = getEditorItems(card);

  return (
    <DemoPage>
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

export default BasicInit;
