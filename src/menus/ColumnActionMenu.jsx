// Opens on a click of the column header ⋯ button (column.menu: true).
import { forwardRef } from 'react';
import { getColumnMenuOptions } from '@svar-ui/kanban-store';
import KanbanMenu from './KanbanMenu.jsx';
import {
  defaultColumnOptions,
  execColumnMenuAction,
  locateLane,
  resolveColumn,
} from './helpers.js';

const ColumnActionMenu = forwardRef(function ColumnActionMenu(props, ref) {
  const { api = null, ...rest } = props;

  return (
    <KanbanMenu
      {...rest}
      trigger="click"
      dataKey="columnMenu"
      resolve={(id, ev) => resolveColumn(api, id, locateLane(ev.target))}
      defaults={(ctx) => defaultColumnOptions(getColumnMenuOptions(), ctx)}
      builtin={(action, ctx) => execColumnMenuAction(api, action, ctx)}
      ref={ref}
    />
  );
});

export default ColumnActionMenu;
