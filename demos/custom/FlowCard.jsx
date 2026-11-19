import './FlowCard.css';

function FlowCard({ card }) {
  return (
    <div className="flow-card">
      <span className="team">{card.team}</span>
      <strong>{card.label}</strong>
      <span className="effort">{card.effort} hours</span>
    </div>
  );
}

export default FlowCard;
