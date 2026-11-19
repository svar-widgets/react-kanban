import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useContext,
} from 'react';
import { delegateClick, hotkeys, locate, locateID } from '@svar-ui/lib-dom';
import { useStore } from '@svar-ui/lib-react';
import { Popup } from '@svar-ui/react-core';
import { context } from '@svar-ui/react-core';

import Column from './Column.jsx';
import Stack from './Stack.jsx';
const Swimlanes = Column; // pro feature, never rendered: MIT has no lanes
const useCardProjection = () => {}; // pro feature
import DragGhost from './DragGhost.jsx';
import { useCardOverlay } from './useCardOverlay.js';
import { cardDrag } from '../directives/drag.js';
import {
  KanbanApiContext,
  DndContext,
  ScrollContainerContext,
} from '../context.js';
import './Layout.css';

const scope = 'wx-aac6Qo5t';

const str2style = (s) => {
  const obj = {};

  s.split(';').forEach((kv) => {
    const [k, v] = kv.split(':');
    if (k && v) obj[k.trim()] = v.trim();
  });
  return obj;
};

function sameSet(a, b) {
  if (a.size !== b.size) return false;
  for (const value of a) {
    if (!b.has(value)) return false;
  }
  return true;
}

function Layout(props) {
  const {
    readonly = false,
    render,
    cardContent,
    cardShape,
    tooltip,
    cardPopup,
    cardListStart,
    cardListEnd,
    cardCss,
    columnCss,
    cardProjection = null,
  } = props;

  const stack = render?.layout === 'stack';
  const fixedColumnWidth = render?.fixedColumnWidth ?? true;
  const virtualizeCards = render?.virtualizeCards ?? false;
  const virtualizeColumns = render?.virtualizeColumns ?? false;
  const estimatedCardHeight = render?.estimatedCardHeight ?? 80;
  const cardOverscan = render?.cardOverscan ?? 5;
  const columnOverscan = render?.columnOverscan ?? 1;

  const store = useContext(KanbanApiContext);
  const viewData = useStore(store, 'viewData');
  const hasSwimlanes = viewData.swimlanes.length > 0;
  // Lanes and the stack layout override the effective scroll mode without
  // touching the caller's value, so leaving either restores the preference.
  const columnScroll =
    !stack && !hasSwimlanes && (render?.columnScroll ?? true);

  const brandmark = useMemo(() => store.getBrandmark(), [store]);

  const locale = useContext(context.i18n);
  const _ = locale.getGroup('kanban');

  const dnd = useContext(DndContext);

  const rootRef = useRef(null);
  const boardRef = useRef(null);
  const scrollRef = useRef(null);
  // the scroll element is also kept in state, so Stack and Swimlanes receive it
  const [scroll, setScroll] = useState(null);
  const scrollCallbackRef = useCallback((node) => {
    scrollRef.current = node;
    setScroll(node);
  }, []);

  const [visibleColumnIds, setVisibleColumnIds] = useState(() => new Set());
  const visibilityFrameRef = useRef(0);
  const columnElementsRef = useRef(new Map());

  // Provide scroll container context
  const getScrollContainer = useCallback(
    () => (columnScroll ? null : (scrollRef.current ?? null)),
    [columnScroll],
  );

  // ---- Column visibility (virtualization) ----

  // latest values for callbacks registered once
  const latest = useRef(null);
  latest.current = {
    stack,
    virtualizeColumns,
    columnOverscan,
    columns: viewData.columns,
    visibleColumnIds,
  };

  const setVisibleColumns = useCallback((next) => {
    if (!sameSet(latest.current.visibleColumnIds, next)) {
      latest.current.visibleColumnIds = next;
      setVisibleColumnIds(next);
    }
  }, []);

  const updateColumnVisibility = useCallback(() => {
    const { stack, virtualizeColumns, columnOverscan, columns } =
      latest.current;
    if (stack) return;
    const scroll = scrollRef.current;
    if (!virtualizeColumns || !scroll) {
      setVisibleColumns(new Set());
      return;
    }

    if (!columns.length) {
      setVisibleColumns(new Set());
      return;
    }

    const scrollRect = scroll.getBoundingClientRect();
    let first = -1;
    let last = -1;

    for (let i = 0; i < columns.length; i++) {
      const element = columnElementsRef.current.get(columns[i].id);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      if (rect.right >= scrollRect.left && rect.left <= scrollRect.right) {
        if (first === -1) first = i;
        last = i;
      }
    }

    if (first === -1 || last === -1) {
      setVisibleColumns(new Set());
      return;
    }

    const overscan = Math.max(0, Math.floor(columnOverscan || 0));
    first = Math.max(0, first - overscan);
    last = Math.min(columns.length - 1, last + overscan);

    const next = new Set();
    for (let i = first; i <= last; i++) {
      next.add(columns[i].id);
    }
    setVisibleColumns(next);
  }, [setVisibleColumns]);

  const scheduleColumnVisibility = useCallback(() => {
    if (latest.current.stack || visibilityFrameRef.current) return;
    visibilityFrameRef.current = requestAnimationFrame(() => {
      visibilityFrameRef.current = 0;
      updateColumnVisibility();
    });
  }, [updateColumnVisibility]);

  const registerColumn = useCallback(
    (id, element) => {
      if (element) columnElementsRef.current.set(id, element);
      else columnElementsRef.current.delete(id);

      scheduleColumnVisibility();
    },
    [scheduleColumnVisibility],
  );

  function updateScrollHeightVar() {
    const scroll = scrollRef.current;
    if (!scroll) return;
    scroll.style.setProperty(
      '--wx-kanban-scroll-height',
      `${scroll.clientHeight}px`,
    );
  }

  const isColumnContentVisible = useCallback(
    (id) =>
      !virtualizeColumns ||
      visibleColumnIds.size === 0 ||
      visibleColumnIds.has(id),
    [virtualizeColumns, visibleColumnIds],
  );

  const isColumnRequestVisible = useCallback(
    (id) => !virtualizeColumns || visibleColumnIds.has(id),
    [virtualizeColumns, visibleColumnIds],
  );

  function getCard(id) {
    return store.getState().cards.getById(id);
  }

  const overlay = useCardOverlay(getCard, 'right-start');

  const popupExtra = useMemo(() => ({ trackScroll: true }), []);

  function selectCard(id) {
    if (!readonly && id != null) {
      store.exec('select-card', { id });
    }
  }

  function handleCardClick(id, ev) {
    // suppress the click that fires right after a pointerup ends a drag
    if (readonly || dnd?.active) return;
    if (cardPopup && id != null) {
      const target = ev?.target;
      const el = target ? locate(target) : null;
      if (el) {
        overlay.handleCardPopup({ cardId: id, element: el });
        return;
      }
    }

    selectCard(id);
  }

  function handleCardKey(e) {
    if (readonly) return;

    const active = document.activeElement;
    if (!(active instanceof window.HTMLElement) || !active.matches('.wx-card'))
      return;
    e?.preventDefault();
    const id = active ? locateID(active) : null;
    if (cardPopup && id != null && active) {
      overlay.handleCardPopup({
        cardId: id,
        element: active,
      });
      return;
    }
    selectCard(id);
  }

  // handlers registered once on the board read the latest render through refs
  const handlersRef = useRef(null);
  handlersRef.current = { handleCardClick, handleCardKey };

  // ---- Effects for scheduling column visibility ----
  useEffect(() => {
    scheduleColumnVisibility();
  }, [
    virtualizeColumns,
    columnOverscan,
    fixedColumnWidth,
    viewData.columns,
    scheduleColumnVisibility,
  ]);

  // ResizeObserver for column visibility
  useEffect(() => {
    if (
      stack ||
      !scroll ||
      !virtualizeColumns ||
      typeof ResizeObserver === 'undefined'
    )
      return;

    const observer = new ResizeObserver(() => scheduleColumnVisibility());
    observer.observe(scroll);

    return () => observer.disconnect();
  }, [stack, scroll, virtualizeColumns, scheduleColumnVisibility]);

  // Scroll height CSS variable + ResizeObserver
  useEffect(() => {
    if (!scroll) return;

    updateScrollHeightVar();
    window.addEventListener('resize', updateScrollHeightVar);

    if (typeof ResizeObserver === 'undefined') {
      return () => window.removeEventListener('resize', updateScrollHeightVar);
    }

    const observer = new ResizeObserver(updateScrollHeightVar);
    observer.observe(scroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScrollHeightVar);
    };
  }, [scroll]);

  useCardProjection({
    board: boardRef,
    // The stack layout has no drag, including external drag-in.
    projection: stack ? null : cardProjection,
    model: viewData,
    store,
    dnd,
  });

  // Cleanup visibility frame on unmount
  useEffect(() => {
    return () => {
      if (visibilityFrameRef.current) {
        cancelAnimationFrame(visibilityFrameRef.current);
        visibilityFrameRef.current = 0;
      }
    };
  }, []);

  // ---- Svelte action: cardDrag ----
  const cardDragRef = useRef(null);

  useEffect(() => {
    if (!boardRef.current) return;
    cardDragRef.current = cardDrag(boardRef.current, {
      dnd,
      store,
      readonly,
      disabled: stack,
    });
    return () => {
      cardDragRef.current?.destroy?.();
      cardDragRef.current = null;
    };
  }, []);

  useEffect(() => {
    cardDragRef.current?.update?.({ dnd, store, readonly, disabled: stack });
  }, [dnd, store, readonly, stack]);

  // ---- Svelte action: delegateClick ----
  useEffect(() => {
    if (!boardRef.current) return;
    const cleanup = delegateClick(boardRef.current, {
      click: (id, ev) => handlersRef.current.handleCardClick(id, ev),
      // the ⋯ button must not select the card; the click bubbles on to an
      // outer CardActionMenu, which owns the menu
      menu: () => {},
    });
    return () => cleanup?.destroy?.();
  }, []);

  // ---- Svelte action: hotkeys ----
  useEffect(() => {
    if (!boardRef.current) return;
    const node = boardRef.current;
    const onKey = (e) => handlersRef.current.handleCardKey(e);
    const destroy = hotkeys.subscribe((keys) => {
      keys.configure(
        {
          enter: onKey,
          space: onKey,
        },
        node,
      );
    });
    return () => destroy?.();
  }, []);

  // ---- Build board className ----
  const boardClassName = [
    'wx-board',
    !columnScroll ? 'wx-scroll-board' : '',
    !stack && !fixedColumnWidth ? 'wx-layout-flex' : '',
    stack ? 'wx-layout-stack' : '',
    !stack && hasSwimlanes ? 'wx-lanes' : '',
    scope,
  ]
    .filter(Boolean)
    .join(' ');

  const TooltipCmp = tooltip;
  const CardPopupCmp = cardPopup;

  return (
    <ScrollContainerContext.Provider value={getScrollContainer}>
      <div
        className={`wx-kanban ${scope}`}
        role="region"
        aria-label={_('Kanban board')}
        ref={rootRef}
      >
        <div
          className={boardClassName}
          ref={boardRef}
          onMouseMove={tooltip ? overlay.handleTooltipMove : undefined}
          onMouseLeave={tooltip ? overlay.handleTooltipLeave : undefined}
        >
          <div
            className={`wx-scroll ${scope}`}
            ref={scrollCallbackRef}
            onScroll={scheduleColumnVisibility}
          >
            {stack ? (
              <Stack
                model={viewData}
                scroll={scroll}
                readonly={readonly}
                cardContent={cardContent}
                cardShape={cardShape}
                virtualizeCards={virtualizeCards}
                estimatedCardHeight={estimatedCardHeight}
                cardOverscan={cardOverscan}
                virtualizeColumns={virtualizeColumns}
                cardListStart={cardListStart}
                cardListEnd={cardListEnd}
                cardCss={cardCss}
                columnCss={columnCss}
              />
            ) : hasSwimlanes ? (
              <Swimlanes
                model={viewData}
                scroll={scroll}
                readonly={readonly}
                cardContent={cardContent}
                cardShape={cardShape}
                virtualizeCards={virtualizeCards}
                estimatedCardHeight={estimatedCardHeight}
                cardOverscan={cardOverscan}
                fixedColumnWidth={fixedColumnWidth}
                registerColumn={registerColumn}
                cardListStart={cardListStart}
                cardListEnd={cardListEnd}
                cardCss={cardCss}
                columnCss={columnCss}
                contentVisible={isColumnContentVisible}
                requestVisible={isColumnRequestVisible}
              />
            ) : (
              <div className={`wx-content ${scope}`}>
                {viewData.columns.map((column) => (
                  <Column
                    key={column.id}
                    column={column}
                    readonly={readonly}
                    cardContent={cardContent}
                    cardShape={cardShape}
                    contentVisible={isColumnContentVisible(column.id)}
                    requestVisible={isColumnRequestVisible(column.id)}
                    virtualizeCards={virtualizeCards}
                    estimatedCardHeight={estimatedCardHeight}
                    cardOverscan={cardOverscan}
                    fixedColumnWidth={fixedColumnWidth}
                    registerColumn={registerColumn}
                    cardListStart={cardListStart}
                    cardListEnd={cardListEnd}
                    cardCss={cardCss}
                    columnCss={columnCss}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {brandmark && (
          <a
            className={scope}
            style={str2style(brandmark.style)}
            href={brandmark.link}
            target="_blank"
            rel="noreferrer"
          >
            {brandmark.text}
          </a>
        )}
        <DragGhost
          root={rootRef.current}
          cardContent={cardContent}
          cardShape={cardShape}
        />

        {overlay.tooltipState && TooltipCmp && (
          <div
            className={`wx-tooltip ${scope}`}
            style={{
              position: 'fixed',
              left: `${overlay.mousePos.x + 12}px`,
              top: `${overlay.mousePos.y + 16}px`,
              zIndex: 10000,
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            <TooltipCmp card={overlay.tooltipState.card} />
          </div>
        )}

        {overlay.cardPopupState && CardPopupCmp && (
          <Popup
            at={overlay.cardPopupState.at}
            parent={overlay.cardPopupState.element}
            onCancel={overlay.hideCardPopup}
            {...popupExtra}
          >
            <CardPopupCmp
              card={overlay.cardPopupState.card}
              close={overlay.hideCardPopup}
            />
          </Popup>
        )}
      </div>
    </ScrollContainerContext.Provider>
  );
}

export default Layout;
