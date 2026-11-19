import { useContext, useMemo } from 'react';
import { context } from '@svar-ui/react-core';
import { dateToString } from '@svar-ui/lib-dom';
import Avatar from './Avatar.jsx';
import CardMenuButton from './CardMenuButton.jsx';
import { getPriorityOptions } from '../defaults.js';
import './Card.css';

const scope = 'wx-aaeD6bcf';

function countOf(v) {
  if (typeof v === 'number') return v;
  if (Array.isArray(v)) return v.length;
  return 0;
}

function configOf(shape) {
  return typeof shape === 'object' && shape !== null ? shape : undefined;
}

function itemID(value) {
  if (typeof value === 'string' || typeof value === 'number') return value;
  const id = value?.id;
  if (typeof id === 'string' || typeof id === 'number') return id;
  return null;
}

function fallbackLabel(value) {
  const id = itemID(value);
  if (id != null) return String(id);
  return String(value?.label ?? value?.name ?? '');
}

function findItem(collection, id) {
  return collection?.find((item) => item.id === id);
}

function resolveItem(value, collection) {
  const id = itemID(value);
  if (id == null) return null;

  const match = findItem(collection, id);
  if (match) return match;

  return {
    id,
    label: fallbackLabel(value),
  };
}

function resolveItems(values, collection, max) {
  if (!Array.isArray(values)) return [];
  const items = values
    .map((value) => resolveItem(value, collection))
    .filter((item) => item !== null);

  return typeof max === 'number' && Number.isFinite(max)
    ? items.slice(0, Math.max(0, max))
    : items;
}

// string formats use the wx locale tokens ("%m/%d/%Y"); default is the locale dateFormat
function formatDeadline(i18n, value, format) {
  if (!(value instanceof Date)) return null;
  if (typeof format === 'function') return format(value);
  const { calendar, formats } = i18n.getRaw();
  return dateToString(format || formats.dateFormat, calendar)(value);
}

function Card(props) {
  const { card, cardShape } = props;

  const i18n = useContext(context.i18n);
  const _ = i18n.getGroup('kanban');

  const priorityConfig = useMemo(
    () => configOf(cardShape.priority),
    [cardShape.priority],
  );
  const tagConfig = useMemo(() => configOf(cardShape.tags), [cardShape.tags]);
  const userConfig = useMemo(
    () => configOf(cardShape.users),
    [cardShape.users],
  );
  const deadlineConfig = useMemo(
    () => configOf(cardShape.deadline),
    [cardShape.deadline],
  );
  const progressConfig = useMemo(
    () => configOf(cardShape.progress),
    [cardShape.progress],
  );
  const progressPercent = useMemo(
    () => Math.round(Math.max(0, Math.min(1, card.progress ?? 0)) * 100),
    [card.progress],
  );
  const priority = useMemo(
    () =>
      cardShape.priority
        ? resolveItem(
            card.priority,
            priorityConfig?.data ?? getPriorityOptions(),
          )
        : null,
    [cardShape.priority, card.priority, priorityConfig],
  );
  const tags = useMemo(
    () =>
      cardShape.tags
        ? resolveItems(card.tags, tagConfig?.data, tagConfig?.max)
        : [],
    [cardShape.tags, card.tags, tagConfig],
  );
  const users = useMemo(
    () =>
      cardShape.users
        ? resolveItems(card.users, userConfig?.data, userConfig?.max)
        : [],
    [cardShape.users, card.users, userConfig],
  );
  const avatarUsers = useMemo(
    () => users.map((u) => ({ id: u.id, name: u.label, avatar: u.img })),
    [users],
  );
  const deadline = useMemo(
    () =>
      cardShape.deadline
        ? formatDeadline(i18n, card.deadline, deadlineConfig?.format)
        : null,
    [i18n, cardShape.deadline, card.deadline, deadlineConfig],
  );

  return (
    <>
      {card.cover && cardShape.cover && (
        <div
          className={`wx-cover ${scope}`}
          style={{
            backgroundImage: `url(${card.cover})`,
          }}
        ></div>
      )}

      {(priority || deadline) && (
        <div className={`wx-header ${scope}`}>
          {priority && (
            <span className={`wx-priority ${priority.css ?? ''} ${scope}`}>
              {_(priority.label)}
            </span>
          )}
          {deadline && (
            <span className={`wx-deadline ${scope}`}>{deadline}</span>
          )}
          {cardShape.menu && <CardMenuButton card={card} />}
        </div>
      )}

      <div className={`wx-body ${scope}`}>
        <div className={`wx-title-row ${scope}`}>
          {card.label && (
            <div className={`wx-title ${scope}`}>
              {card.label}

              {cardShape.menu && !priority && !deadline && (
                <CardMenuButton card={card} />
              )}
            </div>
          )}
        </div>
        {card.description && cardShape.description && (
          <p className={`wx-description ${scope}`}>{card.description}</p>
        )}
        {tags.length > 0 && (
          <div className={`wx-tags ${scope}`}>
            {tags.map((tag) => (
              <span key={tag.id} className={`wx-tag ${tag.css ?? ''} ${scope}`}>
                {tag.label}
              </span>
            ))}
          </div>
        )}
        {card.progress > 0 && cardShape.progress && (
          <div className={`wx-progress-row ${scope}`}>
            <div className={`wx-progress ${scope}`} aria-label={_('Progress')}>
              <div
                className={`wx-progress-fill ${scope}`}
                style={{
                  width: `${progressPercent}%`,
                }}
              ></div>
            </div>
            {progressConfig?.showLabel && (
              <span className={`wx-progress-label ${scope}`}>
                {progressPercent}%
              </span>
            )}
          </div>
        )}
      </div>

      {(users.length > 0 ||
        (countOf(card.attachments) > 0 && cardShape.attachments) ||
        (countOf(card.comments) > 0 && cardShape.comments)) && (
        <div className={`wx-footer ${scope}`}>
          {avatarUsers.length > 0 && <Avatar value={avatarUsers} size={24} />}
          <div className={`wx-counters ${scope}`}>
            {countOf(card.attachments) > 0 && cardShape.attachments && (
              <span
                className={`wx-counter ${scope}`}
                aria-label={_('Attachments')}
              >
                <i className={`wx-icon wxi-paperclip ${scope}`}></i>
                {countOf(card.attachments)}
              </span>
            )}
            {countOf(card.comments) > 0 && cardShape.comments && (
              <span
                className={`wx-counter ${scope}`}
                aria-label={_('Comments')}
              >
                <i className={`wx-icon wxi-message ${scope}`}></i>
                {countOf(card.comments)}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Card;
