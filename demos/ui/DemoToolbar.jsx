import './DemoToolbar.css';

// A row of ToolbarGroup blocks. Groups line up on the left; one group
// may use align="right" to sit at the far end.
function DemoToolbar({ children }) {
  return <div className="wx-demo-toolbar">{children}</div>;
}

export default DemoToolbar;
