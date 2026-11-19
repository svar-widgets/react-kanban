import { useState } from 'react';
import { Kanban } from '../../src/index.js';
import {
  Willow,
  WillowDark,
  FilterBuilder,
  createFilter,
  getOptionsMap,
} from '@svar-ui/react-filter';
import { DemoPage, ToolbarGroup } from '../ui/index.js';
import { card, getData } from '../data.js';

const { columns, cards } = getData();

const fields = [
  { id: 'label', label: 'Title', type: 'text' },
  { id: 'description', label: 'Description', type: 'text' },
  { id: 'priority', label: 'Priority', type: 'number' },
  { id: 'deadline', label: 'Deadline', type: 'date' },
];

// values offered for each field, collected from the cards
const options = getOptionsMap(cards, fields);

function FilterBuilderDemo() {
  const [api, setApi] = useState(null);

  function applyFilter({ value }) {
    api?.exec('filter-cards', { filter: createFilter(value, {}, fields) });
  }

  return (
    <>
      <Willow />
      <WillowDark />

      <DemoPage
        toolbar={
          <ToolbarGroup>
            <FilterBuilder
              fields={fields}
              options={options}
              type="line"
              onChange={applyFilter}
            />
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

export default FilterBuilderDemo;
