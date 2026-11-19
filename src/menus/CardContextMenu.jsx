// Opens on a right click anywhere on a card.
import { forwardRef } from 'react';
import { getMenuOptions } from '@svar-ui/kanban-store';
import KanbanMenu from './KanbanMenu.jsx';
import { execCardMenuAction, resolveCard } from './helpers.js';

const CardContextMenu = forwardRef(function CardContextMenu(props, ref) {
  const { api = null, ...rest } = props;

  return (
    <KanbanMenu
      {...rest}
      trigger="contextmenu"
      dataKey="id"
      resolve={(id) => resolveCard(api, id)}
      defaults={getMenuOptions}
      builtin={(action, card) => execCardMenuAction(api, action, card)}
      ref={ref}
    />
  );
});

export default CardContextMenu;
