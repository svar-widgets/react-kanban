import './Stat.css';

// Read-only counter: "Requested columns 4".
function Stat({ label, value }) {
  return (
    <span className="wx-demo-stat">
      <span className="wx-demo-stat-label">{label}</span>
      <strong className="wx-demo-stat-value">{value}</strong>
    </span>
  );
}

export default Stat;
