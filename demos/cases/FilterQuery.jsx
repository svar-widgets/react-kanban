import { useState } from 'react';
import { Kanban } from '../../src/index.js';
import {
  Willow,
  WillowDark,
  FilterQuery,
  createFilter,
  getQueryString,
} from '@svar-ui/react-filter';
import { DemoPage, ToolbarGroup, useDialogs } from '../ui/index.js';
import { card, getData } from '../data.js';

import './FilterQuery.css';

const { columns, cards } = getData();

const fields = [
  { id: 'label', label: 'Title', type: 'text' },
  { id: 'description', label: 'Description', type: 'text' },
  { id: 'priority', label: 'Priority', type: 'number' },
  { id: 'deadline', label: 'Deadline', type: 'date' },
];

// free text is turned into a filter by the SVAR text-to-filter service
const url = 'https://filter-backend.svar.dev/text-to-json';

function FilterQueryDemo() {
  const { notice } = useDialogs();
  const [api, setApi] = useState(null);
  const [query, setQuery] = useState('');

  async function textToFilter(text) {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ text, fields }),
    });
    const json = await response.json();
    if (!response.ok) {
      notice(json.error || 'Request failed', 'danger');
      return null;
    }
    return json;
  }

  async function applyQuery(ev) {
    let value = ev.value;
    let error = ev.error;

    if (ev.text) {
      error = null;
      try {
        ev.startProgress();
        value = await textToFilter(ev.text);
        setQuery(value ? getQueryString(value).query : '');
      } catch (e) {
        error = e;
      } finally {
        ev.endProgress();
      }
    }

    if (error) {
      notice(error.message ?? 'Invalid query', 'danger');
      if (error.code !== 'NO_DATA') return;
    }

    api?.exec('filter-cards', {
      filter: value ? createFilter(value, {}, fields) : null,
    });
  }

  return (
    <>
      <Willow />
      <WillowDark />

      <DemoPage
        toolbar={
          <ToolbarGroup>
            <div className="filter-query">
              <FilterQuery
                value={query}
                fields={fields}
                onChange={applyQuery}
                placeholder="Type a query as plain text, e.g. high priority tasks"
              />
            </div>
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

export default FilterQueryDemo;
