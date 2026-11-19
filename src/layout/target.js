import { getID } from '@svar-ui/lib-dom';

// Drop resolution for a cell that lays cards out itself (e.g. a card grid):
// { before(x, y, source) => CardID | null, layout() => string }, where
// `layout` changes when the cell's layout changes (rewrap or new card size).
// Retained cell shells provide current geometry and O(1) indexed ID resolution.
export const cellDestinations = new WeakMap();

/** Card cell of this board under the hit element; cells of other boards are ignored. */
export function dropCell(root, hit) {
  const cell = hit?.closest('[data-kanban-column-cards]') ?? null;
  return cell && root.contains(cell) ? cell : null;
}

/**
 * Destination under a viewport point, shared by internal moves and external
 * projections. Pure: returns null outside an expanded, rendered cell and never
 * keeps a previous result. `exclude` is the internally dragged card, if any.
 */
export function resolveDropTarget(
  root,
  model,
  x,
  y,
  exclude,
  hit = document.elementFromPoint(x, y),
) {
  const cell = dropCell(root, hit);
  if (!cell) return null;

  const columnId = getID(cell, 'data-kanban-column-cards');
  if (columnId == null) return null;
  const column = model.columns.find((c) => c.id === columnId);
  if (!column || column.collapsed) return null;

  const laneId = getID(cell, 'data-kanban-swimlane');
  const lane = model.swimlanes.find((l) => l.id === laneId);
  if (model.swimlanes.length > 0 && (!lane || lane.collapsed)) return null;
  const swimlane = lane?.id;

  const cards = lane
    ? (lane.cells.find((c) => c.column === column.id)?.cards ?? [])
    : column.cards;

  // Slots refer to the full area, even when no cards are currently rendered.
  if (hit?.closest('.wx-card-list-start'))
    return {
      column: column.id,
      swimlane,
      before: cards.find((c) => c.id !== exclude)?.id ?? null,
    };
  if (hit?.closest('.wx-card-list-end'))
    return { column: column.id, swimlane, before: null };

  const custom = cellDestinations.get(cell);
  if (custom)
    return {
      column: column.id,
      swimlane,
      before: custom.before(x, y, exclude),
    };

  // Stack: insert before the first rendered card whose midpoint is below y.
  for (const cardEl of Array.from(
    cell.querySelectorAll('[data-kanban-card-id]'),
  )) {
    const id = getID(cardEl, 'data-kanban-card-id');
    if (id === exclude) continue;
    const rect = cardEl.getBoundingClientRect();
    if (y < rect.top + rect.height / 2) {
      const before = renderedCardId(cards, id);
      if (before != null) return { column: column.id, swimlane, before };
      break;
    }
  }

  // Below the rendered slice of a virtual list: before the next unrendered card.
  const before = renderedCardId(
    cards,
    getID(cell, 'data-kanban-after-rendered-before-id'),
  );
  return { column: column.id, swimlane, before };
}

export function sameTarget(a, b) {
  if (!a || !b) return !a && !b;
  return (
    a.column === b.column && a.swimlane === b.swimlane && a.before === b.before
  );
}

function renderedCardId(cards, id) {
  if (id == null) return null;
  return cards.find((card) => card.id === id)?.id ?? null;
}
