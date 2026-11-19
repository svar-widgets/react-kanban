// Opens on a click of the card ⋯ button (card.menu: true).
import { forwardRef } from 'react';
import { getMenuOptions } from '@svar-ui/kanban-store';
import KanbanMenu from './KanbanMenu.jsx';
import { execCardMenuAction, resolveCard } from './helpers.js';

const CardActionMenu = forwardRef(function CardActionMenu(props, ref) {
  const { api = null, ...rest } = props;

  return (
    <KanbanMenu
      {...rest}
      trigger="click"
      dataKey="cardMenu"
      resolve={(id) => resolveCard(api, id)}
      defaults={getMenuOptions}
      builtin={(action, card) => execCardMenuAction(api, action, card)}
      ref={ref}
    />
  );
});

export default CardActionMenu;
