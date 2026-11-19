import { createContext, useContext } from 'react';
import './CardListEnd.css';

// provided by the CardListSlots sample: () => Kanban instance api
export const CardListDemoApiContext = createContext(() => undefined);

function CardListEnd({ column, swimlane, readonly }) {
  const getApi = useContext(CardListDemoApiContext);
  function add() {
    void getApi()?.exec('add-card', {
      card: { label: 'New task', column: column.id, team: swimlane?.id },
    });
  }

  return (
    <button className="card-list-end-add" disabled={readonly} onClick={add}>
      + Add card
    </button>
  );
}

export default CardListEnd;
