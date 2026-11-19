import { useState } from 'react';
import { getData } from '../data.js';
import { Kanban, Editor, CardActionMenu } from '../../src/index.js';
import CustomCard from '../custom/CustomCard.jsx';
import { DemoPage } from '../ui/index.js';

const { columns, cards } = getData();

function CardTemplate() {
  const [api, setApi] = useState(null);

  return (
    <DemoPage>
      {/* CustomCard renders the whole card body; its CardMenuButton
          opens this CardActionMenu */}
      <CardActionMenu api={api}>
        <Kanban
          init={(obj) => setApi(obj)}
          cards={cards}
          columns={columns}
          cardContent={CustomCard}
        />
      </CardActionMenu>
      {api && <Editor api={api} />}
    </DemoPage>
  );
}

export default CardTemplate;
