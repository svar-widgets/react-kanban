import { useState, useMemo } from 'react';
import { Kanban } from '../../src/index.js';
import { DemoPage, ToolbarGroup, SelectBox } from '../ui/index.js';
import { getGroupByData, users } from '../data.js';

const {
  columns: groupColumns,
  cards: sourceCards,
  priorities,
} = getGroupByData();

const options = [
  { id: 'stage', label: 'Stage' },
  { id: 'priority', label: 'Priority' },
  { id: 'user', label: 'Person' },
];

const card = {
  priority: { data: priorities },
  progress: { showLabel: true },
  description: true,
  users,
  tags: true,
};

// a field name or a get/set pair maps cards to columns; moving a card
// between "person" columns writes both fields
const userAccessor = {
  get: (card) => card.user,
  set: (card, value) => ({
    ...card,
    user: value,
    users: [value],
  }),
};

function cloneCards(items) {
  return items.map((card) => ({
    ...card,
    tags: Array.isArray(card.tags) ? [...card.tags] : card.tags,
    users: Array.isArray(card.users) ? [...card.users] : card.users,
  }));
}

function GroupBy() {
  const [api, setApi] = useState(null);
  const [groupBy, setGroupBy] = useState('stage');
  const [cards, setCards] = useState(() => cloneCards(sourceCards));

  const columns = useMemo(() => groupColumns[groupBy], [groupBy]);
  const columnAccessor = useMemo(
    () => (groupBy === 'user' ? userAccessor : groupBy),
    [groupBy],
  );

  function changeGroup({ value }) {
    // keep the edits made under the previous grouping
    setCards(cloneCards(api?.getCards() ?? cards));
    setGroupBy(value);
  }

  return (
    <DemoPage
      toolbar={
        <ToolbarGroup label="Group by">
          <SelectBox value={groupBy} options={options} onChange={changeGroup} />
        </ToolbarGroup>
      }
    >
      <Kanban
        init={(obj) => setApi(obj)}
        cards={cards}
        columns={columns}
        columnAccessor={columnAccessor}
        card={card}
      />
    </DemoPage>
  );
}

export default GroupBy;
