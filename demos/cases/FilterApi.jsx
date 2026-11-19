import { useState } from 'react';
import { Kanban } from '../../src/index.js';
import { DemoPage, ToolbarGroup, Text, Toggle, Button } from '../ui/index.js';
import { getStyledData } from '../data.js';

const { columns, cards } = getStyledData();

const highPriority = (card) => card.priority === 3;

// filters active on load, one predicate per tag
const filters = new Map([['priority', highPriority]]);

const card = { priority: true, progress: true };

function FilterApi() {
  const [api, setApi] = useState(null);
  const [search, setSearchValue] = useState('');
  const [onlyHigh, setOnlyHigh] = useState(true);

  // each control owns its tag, so the predicates stack
  function setSearch({ value }) {
    const search = String(value);
    setSearchValue(search);
    const text = search.trim().toLowerCase();
    api?.exec('filter-cards', {
      tag: 'search',
      filter: text ? (card) => card.label.toLowerCase().includes(text) : null,
    });
  }

  function setPriority({ value }) {
    setOnlyHigh(value);
    api?.exec('filter-cards', {
      tag: 'priority',
      filter: value ? highPriority : null,
    });
  }

  function clear() {
    setSearchValue('');
    setOnlyHigh(false);
    api?.exec('filter-cards', {});
  }

  return (
    <DemoPage
      toolbar={
        <>
          <ToolbarGroup>
            <Text
              value={search}
              placeholder="Search by title"
              icon="wxi-search"
              onChange={setSearch}
            />
            <Toggle
              label="Only high priority"
              value={onlyHigh}
              onChange={setPriority}
            />
          </ToolbarGroup>
          <ToolbarGroup align="right">
            <Button onClick={clear}>Clear filters</Button>
          </ToolbarGroup>
        </>
      }
    >
      <Kanban
        init={(obj) => setApi(obj)}
        cards={cards}
        columns={columns}
        filters={filters}
        card={card}
      />
    </DemoPage>
  );
}

export default FilterApi;
