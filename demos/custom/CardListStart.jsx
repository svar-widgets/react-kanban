import './CardListStart.css';

function CardListStart({ column, swimlane, cards }) {
  return (
    <div className="intro">
      <strong>
        {column.label}
        {swimlane ? ` / ${swimlane.label}` : ''}
      </strong>
      <span>{cards.length} cards</span>
    </div>
  );
}

export default CardListStart;
