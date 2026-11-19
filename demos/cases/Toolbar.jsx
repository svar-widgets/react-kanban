import { useState } from 'react';
import { Kanban, Toolbar, Editor } from '../../src/index.js';
import { DemoPage } from '../ui/index.js';
import { getData, getStyledData } from '../data.js';

const { cards } = getStyledData();
const { columns } = getData();

function ToolbarDemo() {
  const [api, setApi] = useState(null);

  // the built-in toolbar: "+" adds a card in the editor, the menu sorts
  return (
    <DemoPage>
      <Toolbar api={api} add={true} sort={true} />
      <Kanban init={(obj) => setApi(obj)} cards={cards} columns={columns} />
      {api && <Editor api={api} />}
    </DemoPage>
  );
}

export default ToolbarDemo;
