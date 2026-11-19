import { useState } from 'react';
import { Kanban } from '../../src/index.js';
import { DemoPage, ToolbarGroup, Button } from '../ui/index.js';
import './ColumnSummaries.css';

// each summary is a tag in the column header: calculate -> format -> css
const summaries = [
  {
    id: 'effort',
    calculate: (cards) =>
      cards.reduce((sum, card) => sum + (card.estimateHours ?? 0), 0),
    format: (value) => (value ? `${value} h` : ''),
    css: (value) => (value > 40 ? 'effort-over-capacity' : ''),
  },
  {
    id: 'blocked',
    calculate: (cards) => cards.filter((card) => card.blocked).length,
    format: (value) => (value ? `${value} blocked` : ''),
    css: () => 'blocked-warning',
  },
  {
    id: 'capacity',
    calculate: (cards) => cards.length,
    format: (value, column) => `${value}/${column.wipLimit}`,
    css: (value, column) =>
      value > column.wipLimit ? 'capacity-exceeded' : '',
  },
];
const columns = [
  { id: 'todo', label: 'To do', wipLimit: 1, summaries },
  { id: 'doing', label: 'Doing', wipLimit: 3, summaries },
  { id: 'done', label: 'Done', wipLimit: 5, summaries },
];
const cards = [
  {
    id: 1,
    column: 'todo',
    label: 'Plan launch',
    estimateHours: 32,
    blocked: true,
  },
  { id: 2, column: 'todo', label: 'Review design', estimateHours: 16 },
  { id: 3, column: 'doing', label: 'Triage requests', estimateHours: 0 },
];

function ColumnSummaries() {
  const [api, setApi] = useState(null);

  // summaries are recalculated after every card change
  function updateEstimate() {
    api?.exec('update-card', {
      id: 1,
      card: { estimateHours: 8, blocked: false },
    });
  }

  return (
    <DemoPage
      toolbar={
        <ToolbarGroup>
          <Button onClick={updateEstimate}>
            Update &quot;Plan launch&quot;
          </Button>
        </ToolbarGroup>
      }
    >
      <div className="summary-demo">
        <Kanban init={(obj) => setApi(obj)} cards={cards} columns={columns} />
      </div>
    </DemoPage>
  );
}

export default ColumnSummaries;
