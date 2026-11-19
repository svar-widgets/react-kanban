import { useState } from 'react';
import { card, getData } from '../data.js';
import {
  Kanban,
  Editor,
  CardContextMenu,
  ColumnActionMenu,
  ColumnContextMenu,
  getColumnMenuOptions,
} from '../../src/index.js';
import { DemoPage, useDialogs } from '../ui/index.js';

const data = getData();
const cards = data.cards;
// the header ⋯ button is per column; right click works on every header
const columns = data.columns.map((c) => ({ ...c, menu: true, addCard: false }));

// called on every open, so items follow the current column content
function columnOptions(ctx) {
  const items = getColumnMenuOptions();
  if (ctx.cards.length) {
    items.push(
      { comp: 'separator' },
      {
        id: 'clear-column',
        text: `Delete ${ctx.cards.length} card(s)`,
        icon: 'wxi-delete',
      },
    );
  }
  if (ctx.column.id === 'done') {
    items.push({ id: 'archive', text: 'Archive done', icon: 'wxi-empty' });
  }
  return items;
}

function ColumnMenu() {
  const { notice } = useDialogs();
  const [api, setApi] = useState(null);

  function onColumnClick({ action, context }) {
    if (action.id === 'clear-column') {
      context.cards.forEach((c) => api.exec('delete-card', { id: c.id }));
    } else if (action.id === 'archive') {
      notice('`Archive done` clicked', 'success');
    }
  }

  return (
    <DemoPage>
      {/* menus nest: each opens only for its own targets */}
      <CardContextMenu api={api}>
        <ColumnContextMenu
          api={api}
          options={columnOptions}
          onClick={onColumnClick}
        >
          <ColumnActionMenu
            api={api}
            options={columnOptions}
            onClick={onColumnClick}
          >
            <Kanban
              init={(obj) => setApi(obj)}
              cards={cards}
              columns={columns}
              card={card}
            />
          </ColumnActionMenu>
        </ColumnContextMenu>
      </CardContextMenu>
      {api && <Editor api={api} />}
    </DemoPage>
  );
}

export default ColumnMenu;
