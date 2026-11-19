import DemoToolbar from './DemoToolbar.jsx';
import './DemoPage.css';

// Frame of a sample: an optional toolbar row, the widget area and an
// optional bottom panel (event log, status line).
function DemoPage({ toolbar, bottom, children }) {
  return (
    <div className="wx-demo-page">
      {toolbar ? <DemoToolbar>{toolbar}</DemoToolbar> : null}
      <div className="wx-demo-content">
        <div className="wx-demo-fill">{children}</div>
      </div>
      {bottom ? bottom : null}
    </div>
  );
}

export default DemoPage;
