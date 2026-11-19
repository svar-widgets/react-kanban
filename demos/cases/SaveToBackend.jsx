import { useState, useEffect } from 'react';
import { Kanban, Editor, RestDataProvider } from '../../src/index.js';
import { getBoardURL, server } from '../custom/backend.js';
import { DemoPage, Message } from '../ui/index.js';

function SaveToBackend() {
  const [board, setBoard] = useState(null);
  const [failed, setFailed] = useState(false);
  const [api, setApi] = useState(null);

  // load the board, then every change is sent to the server by the provider
  useEffect(() => {
    let cancelled = false;
    getBoardURL('save-to-backend')
      .then(async (url) => {
        const provider = new RestDataProvider(url);
        const state = await fetch(url).then((r) => r.json());
        const columns = state.columns;
        // the demo server seeds cards with a lane field; drop it, lanes are Pro
        const cards = provider
          .parseCards(state.cards)
          // eslint-disable-next-line no-unused-vars
          .map(({ swimlane: _, ...card }) => card);
        return { provider, columns, cards };
      })
      .then((value) => {
        if (!cancelled) setBoard(value);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DemoPage>
      {board && (
        <>
          <Kanban
            init={(value) => {
              setApi(value);
              value.setNext(board.provider);
            }}
            cards={board.cards}
            columns={board.columns}
          />
          {api && <Editor api={api} />}
        </>
      )}
      {failed && (
        <Message
          type="danger"
          title="Backend is not available"
          text={`Start the kanban-go backend at ${server}`}
        />
      )}
    </DemoPage>
  );
}

export default SaveToBackend;
