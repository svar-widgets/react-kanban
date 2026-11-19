import { useState } from 'react';
import { card, getData } from '../data.js';
import { ExcelImport } from '@svar-ui/react-excel-import';
import { Kanban, Editor } from '../../src/index.js';
import { DemoPage, ToolbarGroup, Button } from '../ui/index.js';

const { columns, cards } = getData();

// app fields the user maps the sheet columns to
const fields = [
  { label: 'Title', id: 'label' },
  { label: 'Deadline', id: 'deadline' },
  { label: 'Description', id: 'description' },
];

function ExcelImportDemo() {
  const [api, setApi] = useState(null);
  const [importVisible, setImportVisible] = useState(false);

  // imported rows are upserted into the board; rows without a column go to To Do
  function onImport(rows) {
    const imported = rows.map((row) => ({
      ...row,
      id: row.id,
      column: row.column || 'todo',
    }));
    api?.exec('provide-data', { cards: imported });
    setImportVisible(false);
  }

  return (
    <>
      <DemoPage
        toolbar={
          <ToolbarGroup>
            <Button type="primary" onClick={() => setImportVisible(true)}>
              Import from Excel
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

      {importVisible && (
        <ExcelImport
          fields={fields}
          generateIds={true}
          onImport={onImport}
          onClose={() => setImportVisible(false)}
        />
      )}
    </>
  );
}

export default ExcelImportDemo;
