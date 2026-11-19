import { Kanban } from '../../src/index.js';
import { DemoPage, ToolbarGroup, Hint } from '../ui/index.js';
import { getStyledData } from '../data.js';
import './ColumnStyling.css';

// static column.css ("col-todo", ...) comes with the data; wipLimit is a
// custom column field, passed through to columnCss
const { columns: source, cards } = getStyledData();
const columns = source.map((column) => ({
  ...column,
  wipLimit: column.id === 'doing' ? 2 : 3,
}));

// dynamic column class: highlight a column over its limit
const columnCss = (cards, column) =>
  cards.length > column.wipLimit ? 'col-full' : '';

function ColumnStyling() {
  return (
    <DemoPage
      toolbar={
        <ToolbarGroup>
          <Hint>
            Each column has a static class; &quot;In Progress&quot; is over its
            limit of 2 cards. Move a card out of it to clear the highlight.
          </Hint>
        </ToolbarGroup>
      }
    >
      <div className="styling-demo">
        <Kanban cards={cards} columns={columns} columnCss={columnCss} />
      </div>
    </DemoPage>
  );
}

export default ColumnStyling;
