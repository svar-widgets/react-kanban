import { useState, useEffect, useRef } from 'react';
import { Kanban, Editor } from '../../src/index.js';
import {
  RestDataProvider,
  CARDS,
  KanbanEventBridge,
} from '@svar-ui/kanban-provider';
import { getData } from '../data.js';
import { DemoPage, Message, Button } from '../ui/index.js';

const { columns } = getData();
// a hosted board server shared by every open tab
const server = 'https://kanban-users-backend.svar.dev';
const storageKey = 'kanban-multiuser-board';

// used to store the board id in localStorage
function store(id) {
  try {
    if (id) localStorage.setItem(storageKey, id);
    else localStorage.removeItem(storageKey);
  } catch {
    // the board still works, it is just not reused on reload
  }
}
function stored() {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function MultiUser() {
  // unique per tab, so a client skips the echo of its own changes; not auth
  const [clientId] = useState(() => window.crypto.randomUUID());
  const [board, setBoard] = useState(null);
  const [api, setApi] = useState(null);
  const bridge = useRef(null);

  function closeBridge() {
    bridge.current?.close();
    bridge.current = null;
  }
  useEffect(() => closeBridge, []);

  async function open(id) {
    const provider = new RestDataProvider(`${server}/boards/${id}`);
    provider.setHeaders({ 'X-Client-Id': clientId });
    try {
      const cards = await provider.getData();
      if (!Array.isArray(cards)) throw new Error('Invalid board data');
      store(id);
      setBoard({ id, provider, cards });
    } catch {
      // the board is gone or the server is unreachable: start over
      store(null);
      setBoard(null);
    }
  }

  async function create() {
    const response = await fetch(`${server}/boards`, { method: 'POST' });
    const { id } = await response.json();
    await open(id);
  }

  function init(value) {
    if (!board) return;
    setApi(value);
    // changes made in other tabs arrive through the event stream
    closeBridge();
    bridge.current = new KanbanEventBridge(
      `${server}/boards/${board.id}/events`,
      clientId,
      value,
      board.provider,
      {
        'update-card': CARDS,
        'add-card': CARDS,
        'delete-card': CARDS,
        'move-card': CARDS,
      },
    );
    value.setNext(board.provider);
  }

  useEffect(() => {
    const saved = stored();
    if (saved) void open(saved);
  }, []);

  return (
    <DemoPage>
      {board ? (
        <>
          <Kanban
            key={board.id}
            init={init}
            cards={board.cards}
            columns={columns}
          />
          {api && <Editor api={api} />}
        </>
      ) : (
        <Message
          icon="wxi-plus"
          title="No board yet"
          text="Create a shared board and open this page in another tab to see changes sync between clients in real time."
        >
          <Button type="primary" icon="wxi-plus" onClick={create}>
            Create board
          </Button>
        </Message>
      )}
    </DemoPage>
  );
}

export default MultiUser;
