import { useState } from 'react';
import { Kanban } from '../../src/index.js';
import {
  DemoPage,
  ToolbarGroup,
  RangeInput,
  Button,
  useDialogs,
} from '../ui/index.js';

const render = {
  columnScroll: false,
  virtualizeCards: true,
  virtualizeColumns: true,
};

function getColumnWeight(index) {
  // Deterministic spread keeps the demo stable while avoiding equal-height columns.
  return 0.75 + ((index * 37 + 13) % 51) / 100;
}

function splitCardsByColumn(columnsCount, totalCards) {
  if (columnsCount <= 0) return [];

  const weights = Array.from({ length: columnsCount }, (_, i) =>
    getColumnWeight(i),
  );
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const exactCounts = weights.map(
    (weight) => (totalCards * weight) / totalWeight,
  );
  const counts = exactCounts.map((count) => Math.floor(count));
  const remaining = totalCards - counts.reduce((sum, count) => sum + count, 0);
  const remainders = exactCounts
    .map((count, index) => ({
      index,
      remainder: count - counts[index],
    }))
    .sort((a, b) => b.remainder - a.remainder);

  for (let i = 0; i < remaining; i++) {
    counts[remainders[i].index] += 1;
  }

  return counts;
}

function generate(columnsCount, totalCards) {
  const columns = Array.from({ length: columnsCount }, (_, i) => ({
    id: `col-${i + 1}`,
    label: `Column ${i + 1}`,
  }));
  const cardCounts = splitCardsByColumn(columnsCount, totalCards);
  let nextId = 1;
  const cards = columns.flatMap((column, columnIndex) =>
    Array.from({ length: cardCounts[columnIndex] }, () => {
      const id = nextId++;
      const userId = ((id - 1) % 5) + 1;

      return {
        id,
        label: `Generated card ${id}`,
        description: `Generated card ${id} in ${column.label}`,
        column: column.id,
        priority: ((id - 1) % 3) + 1,
        progress: (((id - 1) % 10) + 1) / 10,
        tags: [`group-${columnIndex + 1}`],
        users: [{ id: userId, name: `User ${userId}` }],
      };
    }),
  );
  return { columns, cards };
}

function Virtualization() {
  const { notice } = useDialogs();

  const [numColumns, setNumColumns] = useState(5);
  const [numCards, setNumCards] = useState(3000);
  const [data, setData] = useState(() => generate(5, 3000));

  function reload() {
    const start = performance.now();
    const newData = generate(numColumns, numCards);
    setData(newData);
    requestAnimationFrame(() => {
      setTimeout(() => {
        const duration = performance.now() - start;
        notice(
          `Kanban render: ${duration.toFixed(2)}ms (${newData.cards.length} cards, ${newData.columns.length} columns)`,
        );
      }, 0);
    });
  }

  return (
    <DemoPage
      toolbar={
        <>
          <ToolbarGroup label="Data">
            <RangeInput
              label="Columns"
              value={numColumns}
              onChange={({ value }) => setNumColumns(value)}
              min={1}
              max={100}
            />
            <RangeInput
              label="Cards"
              value={numCards}
              onChange={({ value }) => setNumCards(value)}
              min={1}
              max={100000}
            />
          </ToolbarGroup>
          <ToolbarGroup align="right">
            <Button type="primary" onClick={reload}>
              Reload
            </Button>
          </ToolbarGroup>
        </>
      }
    >
      <Kanban cards={data.cards} columns={data.columns} render={render} />
    </DemoPage>
  );
}

export default Virtualization;
