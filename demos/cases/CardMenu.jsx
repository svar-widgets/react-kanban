import { useState } from 'react';
import { card, getData } from '../data.js';
import {
  Kanban,
  CardActionMenu,
  CardContextMenu,
  Editor,
  getMenuOptions,
} from '../../src/index.js';
import { DemoPage, useDialogs } from '../ui/index.js';

const { columns, cards } = getData();

const options = [
  ...getMenuOptions(),
  { id: 'my-action', text: 'My action', icon: 'wxi-empty' },
];

function CardMenu() {
  const { notice } = useDialogs();
  const [api, setApi] = useState(null);

  function onClick({ action }) {
    if (action.id === 'my-action') {
      notice('`My action` clicked', 'success');
    }
  }

  return (
    <DemoPage>
      {/* right click anywhere on a card, or the card ⋯ button */}
      <CardContextMenu api={api} options={options} onClick={onClick}>
        <CardActionMenu api={api} options={options} onClick={onClick}>
          <Kanban
            init={(obj) => setApi(obj)}
            cards={cards}
            columns={columns}
            card={{ ...card, menu: true }}
          />
        </CardActionMenu>
      </CardContextMenu>
      {api && <Editor api={api} />}
    </DemoPage>
  );
}

export default CardMenu;
