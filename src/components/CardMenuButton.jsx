// Card ⋯ button that opens an outer CardActionMenu; usable inside a custom `cardContent`.
import { useContext, useMemo } from 'react';
import { locale, setID } from '@svar-ui/lib-dom';
import { en } from '@svar-ui/kanban-locales';
import { context } from '@svar-ui/react-core';
import './CardMenuButton.css';

const scope = 'wx-aabqkRRq';

function CardMenuButton(props) {
  const { card, css = '' } = props;

  // rendered inside <Kanban> the kanban locale is in context; fall back for standalone use
  const i18n = useContext(context.i18n);
  const _ = useMemo(
    () => (i18n ?? locale({ ...en })).getGroup('kanban'),
    [i18n],
  );

  // data-action="menu" keeps the click from selecting the card
  return (
    <button
      type="button"
      className={`wx-menu ${css} ${scope}`}
      data-action="menu"
      data-card-menu={setID(card.id)}
      aria-label={_('Card menu')}
      aria-haspopup="menu"
    >
      <i className={`wx-icon wxi-dots-h ${scope}`}></i>
    </button>
  );
}

export default CardMenuButton;
