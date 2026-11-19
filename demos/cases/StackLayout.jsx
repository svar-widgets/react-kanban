import { useState, useMemo } from 'react';
import { Kanban } from '../../src/index.js';
import { DemoPage, ToolbarGroup, Toggle } from '../ui/index.js';

const columns = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'To do' },
  { id: 'doing', label: 'In progress' },
  { id: 'done', label: 'Done', collapsed: true },
];
const cards = Array.from({ length: 450 }, (_, i) => ({
  id: i,
  label: `Task ${i + 1}`,
  column: columns[i % 4].id,
  description: i % 3 ? 'Plan, review, and deliver the next improvement.' : '',
  priority: (i % 3) + 1,
}));

const card = { priority: true, description: true };

function StackLayout() {
  const [stack, setStack] = useState(true);
  const [virtual, setVirtual] = useState(true);

  const render = useMemo(
    () => ({ layout: stack ? 'stack' : 'board', virtualizeCards: virtual }),
    [stack, virtual],
  );

  return (
    <DemoPage
      toolbar={
        <ToolbarGroup>
          <Toggle
            label="Stack layout"
            value={stack}
            onChange={({ value }) => setStack(value)}
          />
          <Toggle
            label="Virtualize cards"
            value={virtual}
            onChange={({ value }) => setVirtual(value)}
          />
        </ToolbarGroup>
      }
    >
      <Kanban cards={cards} columns={columns} card={card} render={render} />
    </DemoPage>
  );
}

export default StackLayout;
