import { useState } from 'react';
import { Kanban } from '../../src/index.js';
import {
  Willow,
  WillowDark,
  FilterBar,
  createFilter,
} from '@svar-ui/react-filter';
import { DemoPage, ToolbarGroup } from '../ui/index.js';
import { card, getData } from '../data.js';

const { columns, cards } = getData();

const fields = [
  {
    type: 'text',
    id: 'label',
    filter: 'contains',
    placeholder: 'Search by title',
  },
  {
    type: 'number',
    id: 'priority',
    placeholder: 'Any priority',
    options: [
      { id: 1, label: 'Low' },
      { id: 2, label: 'Medium' },
      { id: 3, label: 'High' },
    ],
  },
];

function FilterBarDemo() {
  const [api, setApi] = useState(null);

  // the bar returns a rule set; createFilter turns it into a predicate
  function applyFilter({ value }) {
    api?.exec('filter-cards', { filter: createFilter(value) });
  }

  return (
    <>
      <Willow />
      <WillowDark />

      <DemoPage
        toolbar={
          <ToolbarGroup>
            <FilterBar debounce={0} fields={fields} onChange={applyFilter} />
          </ToolbarGroup>
        }
      >
        <Kanban
          init={(obj) => setApi(obj)}
          cards={cards}
          columns={columns}
          card={card}
        />
      </DemoPage>
    </>
  );
}

export default FilterBarDemo;
