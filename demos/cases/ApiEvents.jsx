import { useState, useRef } from 'react';
import { card, getData } from '../data.js';
import { Kanban, Editor } from '../../src/index.js';
import {
  DemoPage,
  ToolbarGroup,
  Button,
  EventLog,
  useEventLog,
} from '../ui/index.js';

const data = getData();
// cards are added from the toolbar only
const columns = data.columns.map((c) => ({ ...c, addCard: false }));
const { cards } = data;

function ApiEvents() {
  const log = useEventLog();
  const [api, setApi] = useState(null);
  const count = useRef(0);

  // api.on subscribes after the action ran
  function init(value) {
    setApi(value);
    value.on('add-card', (ev) => {
      const { card } = ev;
      log.add(`api.on("add-card"): "${card.label}"`);
    });
  }

  // on<action> props receive the same payload
  function onMoveCard(ev) {
    log.add(`onMoveCard: card ${ev.id} to "${ev.column}"`);
  }

  function addCard() {
    api?.exec('add-card', {
      card: { label: `New card ${++count.current}`, column: 'todo' },
    });
  }

  function moveCard() {
    const card = api.getCards().find((c) => c.column === 'todo');
    if (card) api.exec('move-card', { id: card.id, column: 'doing' });
    else log.add('no cards left in To Do');
  }

  function selectCard() {
    api?.exec('select-card', { id: 1 });
  }

  return (
    <DemoPage
      toolbar={
        <ToolbarGroup label="api.exec">
          <Button onClick={addCard}>Add card</Button>
          <Button onClick={moveCard}>Move first To Do card</Button>
          <Button onClick={selectCard}>Open card 1</Button>
        </ToolbarGroup>
      }
      bottom={<EventLog log={log} />}
    >
      <Kanban
        init={init}
        cards={cards}
        columns={columns}
        card={card}
        onMoveCard={onMoveCard}
      />
      {api && <Editor api={api} />}
    </DemoPage>
  );
}

export default ApiEvents;
