import { getData } from '../data.js';
import { Kanban } from '../../src/index.js';
import CardPopup from '../custom/CardPopup.jsx';
import { DemoPage } from '../ui/index.js';

const { columns, cards } = getData();

function CardPopupDemo() {
  return (
    <DemoPage>
      <Kanban cards={cards} columns={columns} cardPopup={CardPopup} />
    </DemoPage>
  );
}

export default CardPopupDemo;
