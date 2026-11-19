import { useState } from 'react';
import { getStyledData } from '../data.js';
import { Kanban, Editor } from '../../src/index.js';
import { DemoPage } from '../ui/index.js';
import './CardStyling.css';

// card 7 has a static `css: "card-pinned"`
const { columns, cards } = getStyledData();

// classes computed from card data, re-evaluated on every change
const cardCss = (card) => {
  const priority = card.priority === 3 ? 'card-high' : '';
  const done = (card.progress ?? 0) >= 1 ? 'card-complete' : '';
  return `${priority} ${done}`.trim();
};

function CardStyling() {
  const [api, setApi] = useState(null);

  return (
    <DemoPage>
      <div className="card-styling">
        <Kanban
          init={(obj) => setApi(obj)}
          cards={cards}
          columns={columns}
          cardCss={cardCss}
        />
      </div>
      {api && <Editor api={api} />}
    </DemoPage>
  );
}

export default CardStyling;
