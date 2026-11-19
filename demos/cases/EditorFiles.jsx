import { useState, useEffect } from 'react';
import { card } from '../data.js';
import {
  Kanban,
  Editor,
  getEditorItems,
  registerEditorItem,
  RestDataProvider,
} from '../../src/index.js';
import { Attachments } from '@svar-ui/react-editor';
import { getBoardURL, server } from '../custom/backend.js';
import { DemoPage, Message } from '../ui/index.js';

registerEditorItem('files', Attachments);

function EditorFiles() {
  const [board, setBoard] = useState(null);
  const [failed, setFailed] = useState(false);
  const [api, setApi] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getBoardURL('editor-files')
      .then(async (url) => {
        const provider = new RestDataProvider(url);
        const state = await fetch(url).then((r) => r.json());
        const columns = state.columns;
        // the demo server seeds cards with a lane field; drop it, lanes are Pro
        const cards = provider
          .parseCards(state.cards)
          // eslint-disable-next-line no-unused-vars
          .map(({ swimlane: _, ...card }) => card);

        const items = [
          ...getEditorItems(card),
          {
            comp: 'files',
            key: 'attachments',
            label: 'Attachments',
            // the server stores the binary and returns { id, name, size, url };
            // the editor saves that metadata with the card through update-card
            uploadURL: `${url}/files`,
          },
        ];
        return { provider, columns, cards, items };
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

  // open the first card, so the attachments field is in view
  function init(value, cards) {
    setApi(value);
    if (cards.length) value.exec('select-card', { id: cards[0].id });
  }

  return (
    <DemoPage>
      {board && (
        <>
          <Kanban
            init={(value) => {
              value.setNext(board.provider);
              init(value, board.cards);
            }}
            cards={board.cards}
            columns={board.columns}
            card={card}
          />
          {api && <Editor api={api} items={board.items} />}
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

export default EditorFiles;
