import { writeMembership } from '@svar-ui/kanban-store';

export function dblclick(node, initial) {
  let params = initial;

  function onDblClick(e) {
    if (params.readonly) return;
    if (e.target !== node) return;

    const base = { label: 'New card' };
    let card = createColumnCard(base, params.columnAccessor, params.column);
    if (params.swimlane !== undefined)
      card = createColumnCard(
        card,
        params.store.getState().swimlaneAccessor,
        params.swimlane,
      );

    void params.store.exec('add-card', { card });
  }

  node.addEventListener('dblclick', onDblClick);

  return {
    update(next) {
      params = next;
    },
    destroy() {
      node.removeEventListener('dblclick', onDblClick);
    },
  };
}

export function createColumnCard(card, accessor, column) {
  return writeMembership(card, accessor, column);
}
