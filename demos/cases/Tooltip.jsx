import { getData } from '../data.js';
import { Kanban } from '../../src/index.js';
import CardTooltip from '../custom/CardTooltip.jsx';
import { DemoPage } from '../ui/index.js';

const { columns, cards } = getData();

function Tooltip() {
  return (
    <DemoPage>
      <Kanban cards={cards} columns={columns} tooltip={CardTooltip} />
    </DemoPage>
  );
}

export default Tooltip;
