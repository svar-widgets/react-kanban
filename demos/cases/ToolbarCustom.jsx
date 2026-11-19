import { useState, useRef, useMemo } from 'react';
import { Kanban, Toolbar, Editor, getToolbarItems } from '../../src/index.js';
import { DemoPage, useDialogs } from '../ui/index.js';
import { getData, getStyledData } from '../data.js';

const { cards } = getStyledData();
const { columns } = getData();

function ToolbarCustom() {
  const [api, setApi] = useState(null);
  const apiRef = useRef(null);
  const { notice } = useDialogs();

  // default items plus host items: a handler replaces the built-in action
  const items = useMemo(
    () => [
      ...getToolbarItems({ add: true, sort: true }),
      { comp: 'spacer' },
      {
        id: 'count',
        comp: 'button',
        text: 'Count cards',
        handler: () =>
          notice(`${apiRef.current.getCards().length} cards on the board`),
      },
    ],
    [notice],
  );

  function init(obj) {
    apiRef.current = obj;
    setApi(obj);
  }

  return (
    <DemoPage>
      <Toolbar api={api} items={items} />
      <Kanban init={init} cards={cards} columns={columns} />
      {api && <Editor api={api} />}
    </DemoPage>
  );
}

export default ToolbarCustom;
