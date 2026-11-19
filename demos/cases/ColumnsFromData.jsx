import { useState, useMemo } from 'react';
import { Kanban } from '../../src/index.js';
import { DemoPage, ToolbarGroup, SelectBox, Hint } from '../ui/index.js';

// no columns prop: the board builds one column per distinct "status"
const options = [
  { id: 'initial', label: 'Grouped cards' },
  { id: 'updated', label: 'Other statuses' },
  { id: 'ungrouped', label: 'Without status' },
];
const datasets = {
  initial: [
    { id: 1, label: 'Plan onboarding', status: 'To do' },
    { id: 2, label: 'Build search', status: 'In progress' },
    { id: 3, label: 'Review navigation', status: 'In progress' },
    { id: 4, label: 'Update dependencies', status: 'Done' },
    { id: 5, label: 'Write release notes', status: 'To do' },
    { id: 6, label: 'Publish API guide', status: 'Done' },
  ],
  updated: [
    { id: 1, label: 'Plan onboarding', status: 'In review' },
    { id: 3, label: 'Review navigation', status: 'Done' },
    { id: 7, label: 'Verify help articles', status: 'In review' },
    { id: 8, label: 'Answer customer questions', status: 'Done' },
  ],
  ungrouped: [
    { id: 9, label: 'Capture customer feedback' },
    { id: 10, label: 'Explore new ideas' },
    { id: 11, label: 'Prepare next planning session' },
  ],
};

function ColumnsFromData() {
  const [dataset, setDataset] = useState('initial');
  const cards = useMemo(() => datasets[dataset], [dataset]);

  return (
    <DemoPage
      toolbar={
        <ToolbarGroup label="Data">
          <SelectBox
            value={dataset}
            options={options}
            onChange={({ value }) => setDataset(value)}
          />
          <Hint>Columns are generated from the cards.</Hint>
        </ToolbarGroup>
      }
    >
      <Kanban cards={cards} columnAccessor="status" readonly />
    </DemoPage>
  );
}

export default ColumnsFromData;
