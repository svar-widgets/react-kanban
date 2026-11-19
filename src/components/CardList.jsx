import StackCardList from './StackCardList.jsx';

const FlowCardList = StackCardList; // pro feature

function CardList(props) {
  return props.column.cardWidth !== undefined ? (
    <FlowCardList {...props} />
  ) : (
    <StackCardList {...props} />
  );
}

export default CardList;
