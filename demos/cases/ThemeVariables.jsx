import { useState } from 'react';
import { card, getData } from '../data.js';
import { Kanban, Editor } from '../../src/index.js';
import { DemoPage, Choice } from '../ui/index.js';

import './ThemeVariables.css';

const { columns, cards } = getData();

const options = [
  { id: 'default', label: 'Default' },
  { id: 'custom', label: 'Custom' },
];

function ThemeVariables() {
  const [api, setApi] = useState(null);
  const [theme, setTheme] = useState('custom');

  return (
    <DemoPage
      toolbar={
        <Choice
          options={options}
          value={theme}
          onChange={({ value }) => setTheme(value)}
        />
      }
    >
      {/* --wx-kanban-* variables set on any ancestor of the board win over the theme */}
      <div
        className={`theme-board${theme === 'custom' ? ' custom-board' : ''}`}
      >
        <Kanban
          init={(obj) => setApi(obj)}
          cards={cards}
          columns={columns}
          card={card}
        />
        {api && <Editor api={api} />}
      </div>
    </DemoPage>
  );
}

export default ThemeVariables;
