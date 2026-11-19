import { useState } from 'react';
import { Kanban } from '../../src/index.js';
import { DemoPage, ToolbarGroup, SelectBox } from '../ui/index.js';
import { getStyledData, users } from '../data.js';

const { columns, cards } = getStyledData();

// a criterion is a { field, dir } pair or a comparator function
const assignedFirst = (a, b) =>
  (b.users?.length ?? 0) - (a.users?.length ?? 0) ||
  a.label.localeCompare(b.label);

const criteria = {
  'priority-desc': { field: 'priority', dir: 'desc' },
  'label-asc': { field: 'label', dir: 'asc' },
  'progress-asc': { field: 'progress', dir: 'asc' },
  'assigned-first': assignedFirst,
  none: null,
};
const options = [
  { id: 'priority-desc', label: 'Priority, high first' },
  { id: 'label-asc', label: 'Title, A to Z' },
  { id: 'progress-asc', label: 'Progress, lowest first' },
  { id: 'assigned-first', label: 'Assigned first (comparator)' },
  { id: 'none', label: 'Source order' },
];

const initial = 'priority-desc';
// the initial criterion; later changes go through the action
const sort = criteria[initial];

const card = { priority: true, progress: true, users };

function Sorting() {
  const [api, setApi] = useState(null);
  const [sortBy, setSortBy] = useState(initial);

  function changeSort({ value }) {
    setSortBy(value);
    api?.exec('sort-cards', { sort: criteria[value] });
  }

  return (
    <DemoPage
      toolbar={
        <ToolbarGroup label="Sort by">
          <SelectBox
            value={sortBy}
            options={options}
            width="240px"
            onChange={changeSort}
          />
        </ToolbarGroup>
      }
    >
      <Kanban
        init={(obj) => setApi(obj)}
        cards={cards}
        columns={columns}
        sort={sort}
        card={card}
      />
    </DemoPage>
  );
}

export default Sorting;
