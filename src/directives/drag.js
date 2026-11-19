import {
  cellDestinations,
  dropCell,
  resolveDropTarget,
  sameTarget,
} from '../layout/target.js';
import { getID } from '@svar-ui/lib-dom';

const DRAG_THRESHOLD_PX = 4;

export function cardDrag(node, initial) {
  let params = initial;
  let startX = 0;
  let startY = 0;
  let pending = false;
  let started = false;
  let active = null;
  let scrollFrame = 0;
  let hovered = null;

  // Retarget a still pointer only when the hovered cell itself scrolled, moved or
  // rewrapped. A cell that arrives under the pointer because a placeholder resized
  // a lane waits for the next move; retargeting it would bounce the placeholder
  // between lanes every frame.
  const inert = () => !!(params.readonly || params.disabled);

  function refreshStationary(
    a,
    force,
    hit = document.elementFromPoint(a.dnd.pointer.x, a.dnd.pointer.y),
  ) {
    const cell = hit?.closest('[data-kanban-column-cards]');
    const key = cell ? cellKey(cell) : '';
    const changed =
      !!cell &&
      hovered !== null &&
      hovered.cell === cell &&
      hovered.key !== key;
    hovered = cell ? { cell, key } : null;
    if (force || changed)
      updateTarget(a.dnd.pointer.x, a.dnd.pointer.y, a, hit);
  }

  function autoScroll() {
    if (!started || !active) return;
    const { x, y } = active.dnd.pointer;
    let scrolled = false;
    const scroll = node.querySelector('.wx-scroll');
    if (scroll) {
      const rect = scroll.getBoundingClientRect();
      const inset = node.querySelector('.wx-lane-columns')?.offsetHeight ?? 0;
      const speed = (position, start, end) =>
        position < start + 36 ? -12 : position > end - 36 ? 12 : 0;
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        const previousLeft = scroll.scrollLeft;
        const previousTop = scroll.scrollTop;
        const speedX = speed(x, rect.left, rect.right);
        const speedY = node.classList.contains('wx-scroll-board')
          ? speed(y, rect.top + inset, rect.bottom)
          : 0;

        if (speedX) scroll.scrollLeft += speedX;
        if (speedY) scroll.scrollTop += speedY;
        scrolled =
          scroll.scrollLeft !== previousLeft ||
          scroll.scrollTop !== previousTop;
      }
    }
    const hit = document.elementFromPoint(x, y);
    const cell = hit?.closest('[data-kanban-column-cards]');
    if (cell && !node.classList.contains('wx-scroll-board')) {
      const rect = cell.getBoundingClientRect();
      if (y < rect.top + 36) cell.scrollTop -= 12;
      else if (y > rect.bottom - 36) cell.scrollTop += 12;
    }
    // Pointer moves retarget in onPointerMove; between moves only on changes.
    refreshStationary(active, scrolled, hit);
    scrollFrame = requestAnimationFrame(autoScroll);
  }

  function onPointerDown(e) {
    if (e.button !== 0 || inert() || !params.dnd || !params.store) return;

    const target = e.target;
    const cardEl = target ? target.closest('[data-kanban-card-id]') : null;
    if (!cardEl || !node.contains(cardEl)) return;

    const columnEl = cardEl.closest('[data-kanban-column-cards]');
    if (!columnEl) return;

    const id = getID(cardEl, 'data-kanban-card-id');
    const columnId = getID(columnEl, 'data-kanban-column-cards');
    if (id == null || columnId == null) return;

    const { viewData } = params.store.getState();
    const column = viewData.columns.find((c) => c.id === columnId);
    const cardRec = column?.cards.find((c) => c.id === id);
    if (!column || !cardRec || cardRec.id == null) return;

    active = {
      dnd: params.dnd,
      store: params.store,
      id: cardRec.id,
      column: column.id,
      swimlane: getID(columnEl, 'data-kanban-swimlane') ?? undefined,
      cardEl,
      root: node,
    };

    pending = true;
    started = false;
    startX = e.clientX;
    startY = e.clientY;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKeyDown);
  }

  function onPointerMove(e) {
    if (!pending || !active) return;
    if (inert()) {
      cancelActiveDrag();
      return;
    }

    if (!started) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (dx * dx + dy * dy < DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) return;
      beginDrag(e, active);
    }
    active.dnd.pointer = { x: e.clientX, y: e.clientY };
    active.dnd._notify?.();
    updateTarget(e.clientX, e.clientY, active);
  }

  function onPointerUp() {
    teardownListeners();
    if (started && active) {
      // Catch changes made after the last frame, e.g. a rewrap just before release.
      refreshStationary(active, false);
      commitDrop(active);
      active.dnd.reset();
      document.body.style.userSelect = '';
      suppressNextClick();
    }
    pending = false;
    started = false;
    active = null;
  }

  function onKeyDown(e) {
    if (e.key !== 'Escape' || !started || !active) return;
    cancelActiveDrag();
  }

  function beginDrag(e, a) {
    const rect = a.cardEl.getBoundingClientRect();
    a.dnd.width = rect.width;
    a.dnd.height = rect.height;
    a.dnd.offset = { x: startX - rect.left, y: startY - rect.top };
    a.dnd.pointer = { x: e.clientX, y: e.clientY };
    a.dnd.cardId = a.id;
    a.dnd.sourceColumn = a.column;
    a.dnd.target = { column: a.column, swimlane: a.swimlane, before: null };
    a.dnd.active = true;
    document.body.style.userSelect = 'none';
    started = true;
    hovered = null;
    a.dnd._notify?.();
    scrollFrame = requestAnimationFrame(autoScroll);
  }

  function teardownListeners() {
    cancelAnimationFrame(scrollFrame);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('keydown', onKeyDown);
  }

  function cancelActiveDrag() {
    teardownListeners();
    if (started && active) {
      active.dnd.reset();
      document.body.style.userSelect = '';
    }
    pending = false;
    started = false;
    active = null;
  }

  node.addEventListener('pointerdown', onPointerDown);

  return {
    update(next) {
      params = next;
      if (inert() && (pending || started)) cancelActiveDrag();
    },
    destroy() {
      node.removeEventListener('pointerdown', onPointerDown);
      cancelActiveDrag();
    },
  };
}

/** Hovered-cell state that invalidates a target under a still pointer. */
function cellKey(cell) {
  const rect = cell.getBoundingClientRect();
  const layout = cellDestinations.get(cell)?.layout() ?? '';
  return `${layout}|${rect.top}|${rect.left}|${cell.scrollTop}|${cell.scrollLeft}`;
}

function updateTarget(x, y, a, hit = document.elementFromPoint(x, y)) {
  const model = a.store.getState().viewData;
  const next = resolveDropTarget(a.root, model, x, y, a.id, hit);
  const prev = a.dnd.target;
  // Interaction policy: a stack target survives gutters and headers, while
  // invalid cells and stale flow boundaries are dropped.
  if (
    !next &&
    !dropCell(a.root, hit) &&
    !model.columns.some(
      (column) => column.id === prev?.column && column.cardWidth !== undefined,
    )
  )
    return;
  if (!sameTarget(prev, next)) {
    a.dnd.target = next;
    a.dnd._notify?.();
  }
}

function commitDrop(a) {
  const target = a.dnd.target;
  if (!target) return;

  const model = a.store.getState().viewData;
  if (
    model.columns.find((column) => column.id === target.column)?.collapsed !==
    false
  )
    return;
  if (
    model.swimlanes.length > 0 &&
    model.swimlanes.find((lane) => lane.id === target.swimlane)?.collapsed !==
      false
  )
    return;
  const payload = {
    id: a.id,
    column: target.column,
    swimlane: target.swimlane,
  };
  if (target.before != null) payload.before = target.before;

  void a.store.exec('move-card', payload);
}

function suppressNextClick() {
  const handler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.removeEventListener('click', handler, true);
  };
  window.addEventListener('click', handler, true);
  // if no click follows (pointerup without a click event), drop the listener
  // on the next tick so it doesn't swallow a later unrelated click.
  setTimeout(() => window.removeEventListener('click', handler, true), 0);
}
