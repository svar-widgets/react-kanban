import { Kanban } from '../../src/index.js';
import { DemoPage, ToolbarGroup, Hint } from '../ui/index.js';
import { getData } from '../data.js';

const { cards } = getData();

// per-column options: a fixed width, an initially collapsed column and
// columns without the "+" add-card button
const columns = [
  { id: 'backlog', label: 'Backlog', collapsed: true },
  { id: 'todo', label: 'To Do', width: 360 },
  { id: 'doing', label: 'In Progress', addCard: false },
  { id: 'done', label: 'Done', addCard: false },
];

function ColumnOptions() {
  return (
    <DemoPage
      toolbar={
        <ToolbarGroup>
          <Hint>
            &quot;To Do&quot; is 360px wide, &quot;Backlog&quot; starts
            collapsed. Double-click an empty place in any column to add a card;
            addCard: false only hides the &quot;+&quot; button.
          </Hint>
        </ToolbarGroup>
      }
    >
      <Kanban cards={cards} columns={columns} />
    </DemoPage>
  );
}

export default ColumnOptions;
