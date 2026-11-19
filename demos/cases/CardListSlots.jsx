import { useRef, useCallback } from 'react';
import { Kanban } from '../../src/index.js';
import { DemoPage } from '../ui/index.js';
import { getData } from '../data.js';
import CardListStart from '../custom/CardListStart.jsx';
import CardListEnd, { CardListDemoApiContext } from '../custom/CardListEnd.jsx';

const { columns, cards } = getData();

function CardListSlots() {
  // the end slot adds cards through the widget API
  const api = useRef(null);
  const getApi = useCallback(() => api.current, []);

  return (
    // a slot renders once per card list: before the first card and after the last
    <CardListDemoApiContext.Provider value={getApi}>
      <DemoPage>
        <Kanban
          ref={api}
          cards={cards}
          columns={columns}
          cardListStart={CardListStart}
          cardListEnd={CardListEnd}
        />
      </DemoPage>
    </CardListDemoApiContext.Provider>
  );
}

export default CardListSlots;
