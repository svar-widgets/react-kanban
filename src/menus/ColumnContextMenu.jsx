// Opens on a right click anywhere on a column header.
import { forwardRef } from 'react';
import { getColumnMenuOptions } from '@svar-ui/kanban-store';
import KanbanMenu from './KanbanMenu.jsx';
import {
  defaultColumnOptions,
  execColumnMenuAction,
  locateLane,
  resolveColumn,
} from './helpers.js';

const ColumnContextMenu = forwardRef(function ColumnContextMenu(props, ref) {
  const { api = null, ...rest } = props;

  return (
    <KanbanMenu
      {...rest}
      trigger="contextmenu"
      dataKey="columnId"
      resolve={(id, ev) => resolveColumn(api, id, locateLane(ev.target))}
      defaults={(ctx) => defaultColumnOptions(getColumnMenuOptions(), ctx)}
      builtin={(action, ctx) => execColumnMenuAction(api, action, ctx)}
      ref={ref}
    />
  );
});

export default ColumnContextMenu;
