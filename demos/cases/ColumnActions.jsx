import { useState, useRef } from 'react';
import { Kanban } from '../../src/index.js';
import {
  DemoPage,
  ToolbarGroup,
  Button,
  EventLog,
  useEventLog,
} from '../ui/index.js';
import { getData } from '../data.js';

const { columns, cards } = getData();

function ColumnActions() {
  const log = useEventLog();

  const [api, setApi] = useState(null);
  const added = useRef(0);

  function columnIds() {
    return api.getState().columns.map((c) => c.id);
  }

  function addColumn() {
    added.current++;
    api.exec('add-column', {
      column: { label: `New column ${added.current}` },
    });
  }

  // moves the last column to the first place
  function moveColumn() {
    const ids = columnIds();
    if (ids.length > 1)
      api.exec('move-column', { id: ids.at(-1), before: ids[0] });
  }

  function renameColumn() {
    const id = columnIds()[0];
    if (id !== undefined)
      api.exec('update-column', { id, column: { label: 'Renamed' } });
  }

  function deleteColumn() {
    const id = columnIds().at(-1);
    if (id !== undefined) api.exec('delete-column', { id });
  }

  return (
    <DemoPage
      toolbar={
        <ToolbarGroup label="Columns">
          <Button onClick={addColumn}>Add</Button>
          <Button onClick={moveColumn}>Move last to first</Button>
          <Button onClick={renameColumn}>Rename first</Button>
          <Button onClick={deleteColumn}>Delete last</Button>
        </ToolbarGroup>
      }
      bottom={<EventLog log={log} />}
    >
      {/* on<action> props report each column action after the store applied it */}
      <Kanban
        init={(obj) => setApi(obj)}
        cards={cards}
        columns={columns}
        onAddColumn={(ev) => log.add(`add-column "${ev.column.label}"`)}
        onUpdateColumn={(ev) => log.add(`update-column ${ev.id}`)}
        onMoveColumn={(ev) =>
          log.add(`move-column ${ev.id} before ${ev.before ?? 'end'}`)
        }
        onDeleteColumn={(ev) => log.add(`delete-column ${ev.id}`)}
      />
    </DemoPage>
  );
}

export default ColumnActions;
