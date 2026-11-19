import './ToolbarGroup.css';

// Related controls with an optional caption. Groups after the first are
// separated by a divider; align="right" pushes the group to the end.
function ToolbarGroup({ label, align = 'left', children }) {
  return (
    <div className={`wx-demo-group${align === 'right' ? ' wx-right' : ''}`}>
      {label ? <span className="wx-demo-group-label">{label}</span> : null}
      {children}
    </div>
  );
}

export default ToolbarGroup;
