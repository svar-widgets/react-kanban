import { useState } from 'react';
import { card, getData } from '../data.js';
import { Kanban, Editor, getEditorItems } from '../../src/index.js';
import { DemoPage, ToolbarGroup, Choice, Toggle, Hint } from '../ui/index.js';

import './EditorPlacement.css';

const { columns, cards } = getData();

const placements = [
  { id: 'sidebar', label: 'Sidebar' },
  { id: 'modal', label: 'Modal' },
  { id: 'inline', label: 'Inline' },
  { id: 'fullscreen', label: 'Fullscreen' },
];

// in the columns layout, text fields go left and the rest right
const items = getEditorItems(card).map((item) => ({
  ...item,
  column: item.key === 'label' || item.key === 'description' ? 'left' : 'right',
}));

function EditorPlacement() {
  const [api, setApi] = useState(null);
  const [placement, setPlacement] = useState('sidebar');
  const [columnsLayout, setColumnsLayout] = useState(false);

  return (
    <DemoPage
      toolbar={
        <>
          <ToolbarGroup label="Placement">
            <Choice
              options={placements}
              value={placement}
              onChange={({ value }) => setPlacement(value)}
            />
          </ToolbarGroup>
          <ToolbarGroup>
            <Toggle
              label="Columns layout"
              value={columnsLayout}
              onChange={({ value }) => setColumnsLayout(value)}
            />
          </ToolbarGroup>
          <ToolbarGroup>
            <Hint>Click a card to open the editor</Hint>
          </ToolbarGroup>
        </>
      }
    >
      <div className="area">
        <Kanban
          init={(obj) => setApi(obj)}
          cards={cards}
          columns={columns}
          card={card}
        />
        {api && (
          <Editor
            key={placement}
            api={api}
            items={items}
            placement={placement}
            layout={columnsLayout ? 'columns' : 'default'}
          />
        )}
      </div>
    </DemoPage>
  );
}

export default EditorPlacement;
