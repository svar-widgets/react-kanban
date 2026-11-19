import { useMemo } from 'react';
import { CardMenuButton } from '../../src/index.js';
import './CustomCard.css';

function countOf(value) {
  if (typeof value === 'number') return value;
  if (Array.isArray(value)) return value.length;
  return 0;
}

function progressOf(card) {
  return Math.round(Math.max(0, Math.min(1, card.progress ?? 0)) * 100);
}

function formatDeadline(value) {
  if (
    !(value instanceof Date) &&
    typeof value !== 'string' &&
    typeof value !== 'number'
  ) {
    return '';
  }

  const deadline = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(deadline.getTime())) return '';

  return deadline.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

function CustomCard({ card }) {
  const progress = useMemo(() => progressOf(card), [card]);
  const deadline = useMemo(
    () => formatDeadline(card.deadline),
    [card.deadline],
  );
  const userCount = useMemo(() => countOf(card.users), [card.users]);
  const attachmentCount = useMemo(
    () => countOf(card.attachments),
    [card.attachments],
  );
  const commentCount = useMemo(() => countOf(card.comments), [card.comments]);

  return (
    <div className="custom-card">
      <div className="custom-card-top">
        {card.priority ? (
          <span className="custom-card-priority">P{card.priority}</span>
        ) : null}
        {deadline ? <span className="custom-card-date">{deadline}</span> : null}
        {/* opens the CardActionMenu that wraps <Kanban> */}
        <CardMenuButton card={card} css="custom-card-menu" />
      </div>

      <strong className="custom-card-title">
        {card.label ?? `Card ${card.id}`}
      </strong>

      {card.description && (
        <p className="custom-card-description">{card.description}</p>
      )}

      <div className="custom-card-progress-row">
        <div className="custom-card-progress" aria-label="progress">
          <span style={{ width: progress + '%' }}></span>
        </div>
        <span className="custom-card-progress-value">{progress}%</span>
      </div>

      <div className="custom-card-meta">
        {userCount > 0 && <span>{userCount} users</span>}
        {attachmentCount > 0 && <span>{attachmentCount} files</span>}
        {commentCount > 0 && <span>{commentCount} comments</span>}
      </div>
    </div>
  );
}

export default CustomCard;
