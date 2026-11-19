import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useContext,
} from 'react';
import { flushSync } from 'react-dom';
import { setID } from '@svar-ui/lib-dom';
import { context } from '@svar-ui/react-core';
import { KanbanApiContext, CellViewportContext } from '../context.js';
import { stackGroups } from '../layout/stack.js';
import CardList from './CardList.jsx';
import './Stack.css';

const scope = 'wx-aabDoTQH';

function Stack(props) {
  const {
    model,
    scroll,
    readonly,
    cardContent,
    cardShape,
    virtualizeCards,
    estimatedCardHeight,
    cardOverscan,
    // Gates `request-data` on vertical visibility, as in the board layout.
    virtualizeColumns,
    cardListStart,
    cardListEnd,
    cardCss,
    columnCss,
  } = props;

  const store = useContext(KanbanApiContext);
  const _ = useContext(context.i18n).getGroup('kanban');

  const groups = useMemo(() => stackGroups(model), [model]);
  const byColumn = useMemo(() => {
    const map = new Map();
    for (const column of model.columns) map.set(column.id, []);
    for (const group of groups) map.get(group.column.id).push(group);
    return map;
  }, [model, groups]);

  // Request visibility only. Rendering never depends on it.
  const pendingColumns = useMemo(
    () =>
      model.columns.filter(
        (column) => !column.collapsed && column.dataStatus === 'unknown',
      ),
    [model],
  );
  const [visible, setVisible] = useState(() => new Set());

  // mutable state used by long-lived callbacks
  const m = useRef(null);
  if (!m.current) {
    m.current = {
      sections: new Map(),
      marks: new Map(),
      refs: new Map(),
      frame: 0,
      rangeFrame: 0,
      callbacks: new Set(),
      visible: new Set(),
    };
  }
  m.current.visible = visible;

  const latest = useRef(null);
  latest.current = { scroll, virtualizeColumns, pendingColumns, byColumn };

  /**
   * A column is near the viewport when one of its expanded groups is within one
   * viewport height of it. A column without groups is located by its marker, a
   * zero-height element where its groups would be, so an unloaded empty column
   * can still request its data.
   */
  const updateVisibility = useCallback(() => {
    const { scroll, virtualizeColumns, pendingColumns, byColumn } =
      latest.current;
    const s = m.current;
    if (!scroll || !virtualizeColumns || !pendingColumns.length) return;
    const rect = scroll.getBoundingClientRect();
    const top = rect.top - rect.height;
    const bottom = rect.bottom + rect.height;
    const near = (node) => {
      if (!node) return false;
      const box = node.getBoundingClientRect();
      return box.bottom >= top && box.top <= bottom;
    };

    const next = new Set();
    for (const column of pendingColumns) {
      const own = byColumn.get(column.id) ?? [];
      const hit = own.length
        ? own.some((g) => !g.collapsed && near(s.sections.get(g.key)))
        : near(s.marks.get(column.id));
      if (hit) next.add(column.id);
    }
    if (
      next.size !== s.visible.size ||
      [...next].some((id) => !s.visible.has(id))
    ) {
      s.visible = next;
      setVisible(next);
    }
  }, []);

  // A newly mounted virtual list has no height until its own first frame commits
  // its spacers. Measuring in that frame would see every later column at the
  // top and request them all, so measure one frame later.
  const scheduleVisibility = useCallback(() => {
    const { virtualizeColumns, pendingColumns } = latest.current;
    const s = m.current;
    if (!virtualizeColumns || !pendingColumns.length || s.frame) return;
    s.frame = requestAnimationFrame(() => {
      s.frame = requestAnimationFrame(() => {
        s.frame = 0;
        updateVisibility();
      });
    });
  }, [updateVisibility]);

  // Svelte `use:section` / `use:mark`: stable callback refs per key.
  function register(kind, key) {
    const s = m.current;
    const id = `${kind}:${typeof key}:${key}`;
    let ref = s.refs.get(id);
    if (!ref) {
      const map = kind === 'mark' ? s.marks : s.sections;
      let current = null;
      ref = (node) => {
        if (node) {
          current = node;
          map.set(key, node);
          scheduleVisibility();
        } else {
          if (map.get(key) === current) map.delete(key);
          current = null;
          s.refs.delete(id);
        }
      };
      s.refs.set(id, ref);
    }
    return ref;
  }

  useEffect(() => {
    scheduleVisibility();
  }, [groups, virtualizeColumns, scheduleVisibility]);

  // One range scheduler for every group list. A group moves when an earlier
  // group or the scroll viewport changes size, without any change of its own,
  // so lists refresh together from the shared scroll and resize signals.
  const rootRef = useRef(null);

  const scheduleRanges = useCallback(() => {
    const s = m.current;
    if (s.rangeFrame) return;
    s.rangeFrame = requestAnimationFrame(() => {
      s.rangeFrame = 0;
      // Groups are stacked, so each list's position depends on the spacers of
      // the lists above it. Commit every range before the next list measures;
      // a fresh list has no height yet and would put every later group in view.
      s.callbacks.forEach((callback) => flushSync(callback));
    });
  }, []);

  const viewport = useMemo(
    () => ({
      subscribe(callback) {
        m.current.callbacks.add(callback);
        scheduleRanges();
        return () => {
          m.current.callbacks.delete(callback);
        };
      },
      schedule: scheduleRanges,
      // The sticky header sits inside its own section and occludes nothing.
      inset: () => 0,
    }),
    [scheduleRanges],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!scroll || !root) return;
    const element = scroll;
    const onChange = () => {
      scheduleRanges();
      scheduleVisibility();
    };
    element.addEventListener('scroll', onChange, { passive: true });
    // The root grows or shrinks with any group, including committed spacers.
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(onChange);
    observer?.observe(element);
    observer?.observe(root);
    if (!observer) window.addEventListener('resize', onChange);
    return () => {
      element.removeEventListener('scroll', onChange);
      observer?.disconnect();
      window.removeEventListener('resize', onChange);
    };
  }, [scroll, scheduleRanges, scheduleVisibility]);


  useEffect(() => {
    const s = m.current;
    return () => {
      // reset the ids too: StrictMode remounts reuse this state
      if (s.frame) cancelAnimationFrame(s.frame);
      if (s.rangeFrame) cancelAnimationFrame(s.rangeFrame);
      s.frame = s.rangeFrame = 0;
    };
  }, []);

  function toggleColumn(column) {
    store.exec('update-column', {
      id: column.id,
      column: { collapsed: !column.collapsed },
      skipProvider: true,
    });
  }

  function toggleLane(id, collapsed) {
    store.exec('update-swimlane', { id, swimlane: { collapsed: !collapsed } });
  }

  return (
    <CellViewportContext.Provider value={viewport}>
      <div className={`wx-stack ${scope}`} ref={rootRef}>
        {model.columns.map((column) => [
          <div
            key={`mark:${typeof column.id}:${column.id}`}
            className={`wx-stack-mark ${scope}`}
            ref={register('mark', column.id)}
          ></div>,
          ...(byColumn.get(column.id) ?? []).map((group) => {
            const lane = group.swimlane;
            return (
              <section
                key={group.key}
                className={[
                  'wx-stack-group',
                  column.css ?? '',
                  columnCss?.(group.cards, column) ?? '',
                  group.collapsed ? 'wx-collapsed' : '',
                  scope,
                ]
                  .filter(Boolean)
                  .join(' ')}
                data-stack-column={setID(column.id)}
                data-stack-lane={lane ? setID(lane.id) : undefined}
                ref={register('section', group.key)}
              >
                <header
                  className={`wx-stack-header ${scope}`}
                  data-column-id={setID(column.id)}
                  data-lane-id={lane ? setID(lane.id) : undefined}
                >
                  <button
                    type="button"
                    className={`wx-toggle ${scope}`}
                    onClick={() => toggleColumn(column)}
                    aria-expanded={!column.collapsed}
                    aria-label={
                      column.collapsed
                        ? `${_('Expand column')} ${column.label}`
                        : _('Collapse column')
                    }
                  >
                    <i
                      className={`wx-icon ${column.collapsed ? 'wxi-angle-right' : 'wxi-angle-down'} ${scope}`}
                    ></i>
                  </button>
                  <h3 className={`wx-title ${scope}`}>{column.label}</h3>
                  {lane && (
                    <button
                      type="button"
                      className={`wx-lane-toggle ${scope}`}
                      aria-expanded={!lane.collapsed}
                      aria-label={`${_(lane.collapsed ? 'Expand swimlane' : 'Collapse swimlane')} ${lane.label}`}
                      onClick={() => toggleLane(lane.id, !!lane.collapsed)}
                    >
                      <i
                        className={`wx-icon ${lane.collapsed ? 'wxi-angle-right' : 'wxi-angle-down'} ${scope}`}
                      ></i>
                      <span className={`wx-lane-label ${scope}`}>
                        {lane.label}
                      </span>
                    </button>
                  )}
                  {column.summaries.length > 0 && (
                    <div className={`wx-column-summaries ${scope}`}>
                      {column.summaries.map((summary) => (
                        <span
                          key={summary.id}
                          className={`wx-column-summary ${summary.css ?? ''} ${scope}`}
                          title={summary.text}
                        >
                          {summary.text}
                        </span>
                      ))}
                    </div>
                  )}
                  {column.menu && (
                    <button
                      type="button"
                      className={`wx-column-menu ${scope}`}
                      data-column-menu={setID(column.id)}
                      aria-label={`${_('Column menu')} ${column.label}`}
                      aria-haspopup="menu"
                    >
                      <i className={`wx-icon wxi-dots-h ${scope}`}></i>
                    </button>
                  )}
                </header>
                <div className={`wx-stack-body ${scope}`}>
                  <CardList
                    column={column}
                    cards={group.cards}
                    swimlane={lane?.id}
                    swimlaneView={lane}
                    active={!group.collapsed}
                    readonly={readonly}
                    cardContent={cardContent}
                    cardShape={cardShape}
                    contentVisible={true}
                    virtualizeCards={virtualizeCards}
                    estimatedCardHeight={estimatedCardHeight}
                    cardOverscan={cardOverscan}
                    fixedColumnWidth={true}
                    cardListStart={cardListStart}
                    cardListEnd={cardListEnd}
                    cardCss={cardCss}
                  />
                </div>
              </section>
            );
          }),
        ])}
      </div>
    </CellViewportContext.Provider>
  );
}

export default Stack;
