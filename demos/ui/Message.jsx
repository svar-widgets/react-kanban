import './Message.css';

// Centered box for states that replace the widget: empty board,
// server not reachable. Actions go into children.
function Message({ title, text, icon = 'wxi-alert', type = 'info', children }) {
  return (
    <div className="wx-demo-message">
      <div className="wx-demo-message-box">
        <div className={`wx-demo-message-icon wx-${type}`}>
          <i className={icon}></i>
        </div>
        <div className="wx-demo-message-title">{title}</div>
        {text ? <p className="wx-demo-message-text">{text}</p> : null}
        {children ? (
          <div className="wx-demo-message-actions">{children}</div>
        ) : null}
      </div>
    </div>
  );
}

export default Message;
