import { useState } from 'react';
import { card, getData } from '../data.js';
import { Kanban, Editor } from '../../src/index.js';
import { DemoPage, ToolbarGroup, Hint, useDialogs } from '../ui/index.js';

const data = getData();
const cards = data.cards;
// wipLimit is a custom column field; the board itself ignores it
const columns = data.columns.map((c) =>
  c.id === 'doing' ? { ...c, label: 'In Progress (max 3)', wipLimit: 3 } : c,
);

// moves that skip a stage are not allowed
const forbidden = { todo: 'done' };

function Rules() {
  const { notice } = useDialogs();
  const [api, setApi] = useState(null);

  function init(value) {
    setApi(value);

    // returning false cancels the action
    value.intercept('move-card', (ev) => {
      const { id, column: to } = ev;
      const all = value.getCards();
      const from = all.find((c) => c.id === id)?.column;
      if (!to || to === from) return;

      if (forbidden[from] === to) {
        notice('Move the card to In Progress first', 'warning');
        return false;
      }
      const limit = columns.find((c) => c.id === to)?.wipLimit;
      if (limit && all.filter((c) => c.column === to).length >= limit) {
        notice(`Only ${limit} cards are allowed in this column`, 'warning');
        return false;
      }
    });

    // intercept can also change the payload before the action runs
    value.intercept('add-card', (ev) => {
      const { card } = ev;
      card.priority ??= 2;
    });
  }

  return (
    <DemoPage
      toolbar={
        <ToolbarGroup>
          <Hint>
            To Do cannot go straight to Done; In Progress takes at most 3 cards;
            new cards get medium priority.
          </Hint>
        </ToolbarGroup>
      }
    >
      <Kanban init={init} cards={cards} columns={columns} card={card} />
      {api && <Editor api={api} />}
    </DemoPage>
  );
}

export default Rules;
