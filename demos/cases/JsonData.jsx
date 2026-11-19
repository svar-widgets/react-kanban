import { useState } from 'react';
import { card, getData } from '../data.js';
import { Kanban, Editor } from '../../src/index.js';
import { downloadBlob } from 'xlsx-writer-lite';
import {
  DemoPage,
  ToolbarGroup,
  Button,
  FileButton,
  useDialogs,
} from '../ui/index.js';

const data = getData();
const columns = data.columns;

function JsonData() {
  const { notice } = useDialogs();
  const [cards, setCards] = useState(data.cards);
  const [api, setApi] = useState(null);

  // getCards() is the full source snapshot, ready to persist
  function save() {
    if (!api) return;
    const json = JSON.stringify(api.getCards(), null, 2);
    downloadBlob(new Blob([json], { type: 'application/json' }), 'cards.json');
  }

  // a new cards array replaces the board data; JSON keeps dates as strings,
  // so they are turned back into Date objects first
  async function load(file) {
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed)) throw new Error('not an array');
      setCards(
        parsed.map((c) =>
          c.deadline ? { ...c, deadline: new Date(c.deadline) } : c,
        ),
      );
    } catch {
      notice('The file is not a JSON array of cards', 'danger');
    }
  }

  return (
    <DemoPage
      toolbar={
        <ToolbarGroup>
          <Button onClick={save}>Save JSON</Button>
          <FileButton accept=".json,application/json" onFile={load}>
            Load JSON
          </FileButton>
        </ToolbarGroup>
      }
    >
      <Kanban
        init={(obj) => setApi(obj)}
        cards={cards}
        columns={columns}
        card={card}
      />
      {api && <Editor api={api} />}
    </DemoPage>
  );
}

export default JsonData;
