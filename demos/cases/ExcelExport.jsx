import { useState } from 'react';
import { card, getData } from '../data.js';
import { Kanban, Editor } from '../../src/index.js';
import { downloadBlob, writeWorkbook } from 'xlsx-writer-lite';
import { DemoPage, ToolbarGroup, Button } from '../ui/index.js';

const { columns, cards } = getData();

// sheet columns: card field, header and width
const sheet = [
  { label: 'Title', id: 'label', width: 30 },
  { label: 'Status', id: 'column' },
  { label: 'Deadline', id: 'deadline' },
  { label: 'Description', id: 'description', width: 50 },
];

function ExcelExport() {
  const [api, setApi] = useState(null);

  async function toExcel() {
    if (!api) return;
    const blob = await writeWorkbook(api.getCards(), sheet, { header: true });
    downloadBlob(blob, 'cards.xlsx');
  }

  return (
    <DemoPage
      toolbar={
        <ToolbarGroup>
          <Button type="primary" onClick={toExcel}>
            Export to Excel
          </Button>
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

export default ExcelExport;
