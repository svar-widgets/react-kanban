import { useState, useEffect, useMemo } from 'react';
import { getData } from '../data.js';
import { Kanban, Editor } from '../../src/index.js';
import { DemoPage, ToolbarGroup, Choice } from '../ui/index.js';

import './Responsive.css';

const { columns, cards } = getData();

const options = [
  { id: 'auto', label: 'Auto' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'desktop', label: 'Desktop' },
];

function Responsive() {
  const [api, setApi] = useState(null);
  const [size, setSize] = useState('auto');

  // the widget never detects the viewport: the host owns the breakpoint
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // mobile gets the stacked layout and an editor over the whole widget
  const mobile = size === 'mobile' || (size === 'auto' && narrow);
  const render = useMemo(
    () => ({ layout: mobile ? 'stack' : 'board' }),
    [mobile],
  );

  return (
    <DemoPage
      toolbar={
        <ToolbarGroup label="Screen">
          <Choice
            options={options}
            value={size}
            onChange={({ value }) => setSize(value)}
          />
        </ToolbarGroup>
      }
    >
      <div
        className={`responsive-frame${size === 'mobile' ? ' responsive-phone' : ''}`}
      >
        <Kanban
          init={(obj) => setApi(obj)}
          cards={cards}
          columns={columns}
          render={render}
        />
        {api && (
          <Editor api={api} placement={mobile ? 'fullscreen' : 'sidebar'} />
        )}
      </div>
    </DemoPage>
  );
}

export default Responsive;
