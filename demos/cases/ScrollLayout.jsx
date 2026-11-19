import { useState, useMemo } from 'react';
import { Kanban } from '../../src/index.js';
import { DemoPage, ToolbarGroup, Toggle } from '../ui/index.js';

// enough cards and columns to scroll in both directions
const columns = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  label: `Column ${i + 1}`,
}));
const cards = Array.from({ length: 300 }, (_, i) => ({
  id: i + 1,
  label: `Card ${i + 1}`,
  column: i % 10,
}));

function ScrollLayout() {
  const [columnScroll, setColumnScroll] = useState(true);
  const [fixedColumnWidth, setFixedColumnWidth] = useState(false);

  const render = useMemo(
    () => ({ columnScroll, fixedColumnWidth }),
    [columnScroll, fixedColumnWidth],
  );

  return (
    <DemoPage
      toolbar={
        <ToolbarGroup>
          <Toggle
            label="Per column scroll"
            value={columnScroll}
            onChange={({ value }) => setColumnScroll(value)}
          />
          <Toggle
            label="Fixed column width"
            value={fixedColumnWidth}
            onChange={({ value }) => setFixedColumnWidth(value)}
          />
        </ToolbarGroup>
      }
    >
      <Kanban cards={cards} columns={columns} render={render} />
    </DemoPage>
  );
}

export default ScrollLayout;
