import { getID, locate } from '@svar-ui/lib-dom';
import { createColumnCard } from '../directives/dblclick.js';

/** Card for a located id; `null` when the card or the api is missing. */
export function resolveCard(api, id) {
  if (!api || id == null) return null;
  return api.getState().cards.getById(id) ?? null;
}

/** Lane id of a stack header under `node`, if any. */
export function locateLane(node) {
  const lane = node && locate(node, 'data-lane-id');
  return lane ? getID(lane, 'data-lane-id') : undefined;
}

/**
 * Projected column with the cards under its header: all column cards, or one
 * lane's when `lane` is set (stack layout). `null` when anything is missing.
 */
export function resolveColumn(api, id, lane) {
  if (!api || id == null) return null;
  const { viewData } = api.getState();
  const column = viewData.columns.find((c) => c.id === id);
  if (!column) return null;
  if (lane === undefined) return { column, cards: column.cards };

  const swimlane = viewData.swimlanes.find((l) => l.id === lane);
  if (!swimlane) return null;
  const cell = swimlane.cells.find((c) => c.column === id);
  return { column, cards: cell?.cards ?? [], swimlane };
}

/** Built-in column menu items: no `add-card` when the column disables it. */
export function defaultColumnOptions(options, { column }) {
  return options.filter((op) => op.id !== 'add-card' || column.addCard);
}

/** Runs built-in card items: `edit-card`, `duplicate-card`, `delete-card`. */
export function execCardMenuAction(api, action, card) {
  if (!api || !action) return;
  const id = card.id;
  if (action.id === 'edit-card') void api.exec('select-card', { id });
  else if (action.id === 'duplicate-card')
    void api.exec('duplicate-card', { id });
  else if (action.id === 'delete-card') void api.exec('delete-card', { id });
}

/** Runs built-in column items: `add-card`, `collapse-column`. */
export function execColumnMenuAction(api, action, { column, swimlane }) {
  if (!api || !action) return;
  if (action.id === 'add-card') {
    const state = api.getState();
    let card = createColumnCard({}, state.columnAccessor, column.id);
    if (swimlane)
      card = createColumnCard(card, state.swimlaneAccessor, swimlane.id);
    void api.exec('add-card', { card, edit: true });
  } else if (action.id === 'collapse-column') {
    void api.exec('update-column', {
      id: column.id,
      column: { collapsed: !column.collapsed },
      skipProvider: true,
    });
  }
}

/** Translates `text` / `subtext` of menu items, including nested `data`. */
export function localizeOptions(options, _) {
  return options.map((op) => {
    op = { ...op };
    if (op.text) op.text = _(op.text);
    if (op.subtext) op.subtext = _(op.subtext);
    if (op.data) op.data = localizeOptions(op.data, _);
    return op;
  });
}
