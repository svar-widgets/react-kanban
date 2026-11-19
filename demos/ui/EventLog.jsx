import { Button } from '@svar-ui/react-core';
import './EventLog.css';

// Bottom panel listing what a sample reports (events, API calls).
function EventLog({ log, title = 'Event log', height = '140px' }) {
  return (
    <div className="wx-demo-log" style={{ height }}>
      <div className="wx-demo-log-header">
        <span className="wx-demo-log-title">{title}</span>
        <Button type="link" onClick={() => log.clear()}>
          Clear
        </Button>
      </div>
      <div className="wx-demo-log-body">
        {log.entries.length ? (
          log.entries.map((entry) => (
            <div className="wx-demo-log-entry" key={entry.id}>
              <span className="wx-demo-log-time">{entry.time}</span>
              <span>{entry.text}</span>
            </div>
          ))
        ) : (
          <div className="wx-demo-log-empty">Nothing yet</div>
        )}
      </div>
    </div>
  );
}

export default EventLog;
