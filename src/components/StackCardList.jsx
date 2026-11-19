import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  Fragment,
} from 'react';
import { setID } from '@svar-ui/lib-dom';
import { useStore } from '@svar-ui/lib-react';
import CardWrapper from './CardWrapper.jsx';
import {
  KanbanApiContext,
  DndContext,
  ScrollContainerContext,
  CellViewportContext,
} from '../context.js';
import { dblclick } from '../directives/dblclick.js';
import './StackCardList.css';

const scope = 'wx-aaekGQoR';

const HEIGHT_CACHE_LIMIT = 10000;

function sameRange(a, b) {
  return (
    a.start === b.start &&
    a.end === b.end &&
    a.top === b.top &&
    a.bottom === b.bottom &&
    a.total === b.total
  );
}

function upperBound(values, value) {
  let low = 0;
  let high = values.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (values[mid] <= value) low = mid + 1;
    else high = mid;
  }

  return low;
}

function StackCardList(props) {
  const {
    column,
    cards: cellCards,
    swimlane,
    swimlaneView,
    active = true,
    readonly = false,
    cardContent,
    cardShape,
    contentVisible,
    virtualizeCards,
    estimatedCardHeight,
    cardOverscan,
    fixedColumnWidth,
    cardListStart,
    cardListEnd,
    cardCss,
  } = props;

  const cards = cellCards ?? column.cards;

  function getCardExtraCss(card) {
    return cardCss ? (cardCss(card, column) ?? '') : '';
  }

  const store = useContext(KanbanApiContext);
  const dnd = useContext(DndContext);
  const getScrollContainer = useContext(ScrollContainerContext);
  const columnAccessor = useStore(store, 'columnAccessor');
  const viewport = useContext(CellViewportContext);

  const containerRef = useRef(null);
  const startRef = useRef(null);
  const [range, setRange] = useState({
    start: 0,
    end: -1,
    top: 0,
    bottom: 0,
    total: 0,
  });
  const [cardGap, setCardGap] = useState(8);

  // mutable, non-rendering state used by long-lived callbacks
  const m = useRef(null);
  if (!m.current) {
    m.current = {
      frame: 0,
      previousVirtualizeCards: false,
      offsetsCache: undefined,
      previousCards: new Map(),
      previousTemplate: undefined,
      previousShape: undefined,
      measuredWidth: 0,
      startHeight: 0,
      paddingTop: 0,
      cardGap: 8,
      range: null,
      heightCache: new Map(),
      measuredNodes: new Map(),
      cardObserver: undefined,
    };
  }
  m.current.range = range;

  // latest props for callbacks registered once (observers, viewport, rAF)
  const latest = useRef(null);
  latest.current = {
    cards,
    active,
    contentVisible,
    virtualizeCards,
    estimatedCardHeight,
    cardOverscan,
    cardListStart,
    getScrollContainer,
    viewport,
  };

  const dropTarget = dnd?.preview ?? null;
  const isDropColumn =
    dropTarget?.column === column.id && dropTarget.swimlane === swimlane;
  // External projections have no measured source card.
  const placeholderHeight = dnd?.active
    ? dnd.height
    : Math.max(1, estimatedCardHeight || 1);
  const renderStart = virtualizeCards ? range.start : 0;
  const renderEnd = virtualizeCards ? range.end : cards.length - 1;
  const renderedCards =
    contentVisible && active
      ? cards.slice(renderStart, Math.max(renderStart, renderEnd + 1))
      : [];
  const hiddenHeight = range.total || estimateTotalHeight(cards.length);
  const topSpacerHeight =
    range.start > 0 ? Math.max(0, range.top - cardGap) : 0;
  const bottomSpacerHeight = Math.max(0, range.bottom);
  const afterRenderedBeforeId =
    contentVisible &&
    virtualizeCards &&
    renderEnd >= 0 &&
    renderEnd < cards.length - 1
      ? cards[renderEnd + 1]?.id
      : undefined;
  const trailingPlaceholder =
    isDropColumn &&
    (dropTarget.before == null || dropTarget.before === afterRenderedBeforeId);
  // An append target belongs after the full list extent, below the bottom spacer.
  const appendAfterSpacer =
    isDropColumn && dropTarget.before == null && bottomSpacerHeight > 0;

  function estimateTotalHeight(count) {
    if (!count) return 0;
    const height = Math.max(1, estimatedCardHeight || 1);
    return count * height + Math.max(0, count - 1) * cardGap;
  }

  // ---- callbacks below read only refs, so they are safe in long-lived handlers ----

  const commitRange = useCallback((next) => {
    if (!sameRange(m.current.range, next)) {
      m.current.range = next;
      setRange(next);
    }
  }, []);

  const readGap = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const s = m.current;
    const styles = getComputedStyle(container);
    s.paddingTop = Number.parseFloat(styles.paddingTop) || 0;
    const configuredGap = styles.getPropertyValue('--wx-card-gap').trim();
    const raw = configuredGap || styles.rowGap || styles.gap;
    const next = Number.parseFloat(raw);
    const gap = Number.isFinite(next) ? next : 8;
    if (s.cardGap !== gap) {
      s.cardGap = gap;
      s.offsetsCache = undefined;
      setCardGap(gap);
    }
  }, []);

  const getCardHeight = useCallback((card) => {
    const estimated = Math.max(1, latest.current.estimatedCardHeight || 1);
    return card.id != null
      ? (m.current.heightCache.get(card.id) ?? estimated)
      : estimated;
  }, []);

  const updateMeasuredWidth = useCallback((width) => {
    const s = m.current;
    if (!width || s.measuredWidth === width) return false;

    if (s.measuredWidth) s.heightCache.clear();
    s.measuredWidth = width;
    s.offsetsCache = undefined;
    return true;
  }, []);

  const buildOffsets = useCallback(() => {
    const s = m.current;
    if (s.offsetsCache) return s.offsetsCache;
    const { cards } = latest.current;
    const offsets = [0];
    let total = 0;

    for (let i = 0; i < cards.length; i++) {
      total += getCardHeight(cards[i]);
      if (i < cards.length - 1) total += s.cardGap;
      offsets.push(total);
    }

    return (s.offsetsCache = { offsets, total });
  }, [getCardHeight]);

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const s = m.current;

    readGap();
    const {
      cards,
      active,
      contentVisible,
      virtualizeCards,
      cardOverscan,
      cardListStart,
      getScrollContainer,
      viewport,
    } = latest.current;
    const contentTop =
      s.paddingTop + (active && cardListStart ? s.startHeight + s.cardGap : 0);

    if (typeof ResizeObserver === 'undefined')
      updateMeasuredWidth(container.clientWidth);
    if (!active || !contentVisible || !virtualizeCards) {
      commitRange({
        start: 0,
        end: active && contentVisible ? cards.length - 1 : -1,
        top: 0,
        bottom: 0,
        total: buildOffsets().total,
      });
      return;
    }

    const count = cards.length;
    if (!count) {
      commitRange({ start: 0, end: -1, top: 0, bottom: 0, total: 0 });
      return;
    }

    const { offsets, total } = buildOffsets();
    const boardScroll = getScrollContainer?.() ?? null;
    let viewportTop = 0;
    let viewportBottom = 0;

    if (boardScroll) {
      const boardRect = boardScroll.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      viewportTop = Math.max(
        0,
        boardRect.top +
          (viewport?.inset() ?? 0) -
          containerRect.top -
          contentTop,
      );
      viewportBottom = Math.min(
        total,
        boardRect.bottom - containerRect.top - contentTop,
      );
    } else {
      viewportTop = Math.max(0, container.scrollTop - contentTop);
      viewportBottom =
        container.scrollTop + container.clientHeight - contentTop;
    }

    if (viewportBottom < 0 || viewportTop > total) {
      commitRange({ start: 0, end: -1, top: 0, bottom: total, total });
      return;
    }
    const safeOverscan = Math.max(0, Math.floor(cardOverscan || 0));
    let start = Math.max(0, upperBound(offsets, viewportTop) - 1);
    let end = Math.max(start, upperBound(offsets, viewportBottom) - 1);

    start = Math.max(0, start - safeOverscan);
    end = Math.min(count - 1, end + safeOverscan);

    commitRange({
      start,
      end,
      top: offsets[start],
      bottom: Math.max(0, total - offsets[end + 1]),
      total,
    });
  }, [readGap, updateMeasuredWidth, buildOffsets, commitRange]);

  const scheduleRecalculate = useCallback(() => {
    const { viewport } = latest.current;
    if (viewport) {
      viewport.schedule();
      return;
    }
    const s = m.current;
    if (s.frame) return;
    s.frame = requestAnimationFrame(() => {
      s.frame = 0;
      recalculate();
    });
  }, [recalculate]);

  const capHeightCache = useCallback(() => {
    const heightCache = m.current.heightCache;
    while (heightCache.size > HEIGHT_CACHE_LIMIT) {
      const first = heightCache.keys().next().value;
      if (first === undefined) break;
      heightCache.delete(first);
    }
  }, []);

  function pruneHeightCache() {
    const heightCache = m.current.heightCache;
    const ids = new Set(cards.map((card) => card.id));
    for (const id of heightCache.keys()) {
      if (!ids.has(id)) heightCache.delete(id);
    }
    capHeightCache();
  }

  const ensureCardObserver = useCallback(() => {
    const s = m.current;
    if (s.cardObserver || typeof ResizeObserver === 'undefined') return;

    s.cardObserver = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        const id = s.measuredNodes.get(entry.target);
        if (id == null) continue;

        const height = Math.ceil(entry.target.offsetHeight);
        if (height > 0 && s.heightCache.get(id) !== height) {
          s.heightCache.delete(id);
          s.heightCache.set(id, height);
          capHeightCache();
          s.offsetsCache = undefined;
          changed = true;
        }
      }

      if (changed) scheduleRecalculate();
    });
  }, [capHeightCache, scheduleRecalculate]);

  const measureCard = useCallback(
    (node, card) => {
      const s = m.current;
      if (card.id != null) {
        ensureCardObserver();
        s.measuredNodes.set(node, card.id);
        s.cardObserver?.observe(node);
      }

      return () => {
        s.cardObserver?.unobserve(node);
        s.measuredNodes.delete(node);
      };
    },
    [ensureCardObserver],
  );

  useEffect(() => {
    const s = m.current;
    if (virtualizeCards && !s.previousVirtualizeCards) {
      s.heightCache.clear();
    }
    s.previousVirtualizeCards = virtualizeCards;

    for (const card of cards) {
      if (s.previousCards.get(card.id) !== card) s.heightCache.delete(card.id);
    }
    s.previousCards = new Map(cards.map((card) => [card.id, card]));
    if (s.previousTemplate !== cardContent || s.previousShape !== cardShape)
      s.heightCache.clear();
    s.previousShape = cardShape;
    s.previousTemplate = cardContent;
    s.offsetsCache = undefined;
    pruneHeightCache();
    scheduleRecalculate();
  }, [
    cards,
    contentVisible,
    estimatedCardHeight,
    cardOverscan,
    active,
    cardShape,
    cardContent,
    fixedColumnWidth,
    virtualizeCards,
    scheduleRecalculate,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (viewport) return viewport.subscribe(recalculate);
    if (!contentVisible || !virtualizeCards) return;

    const scrollElement = getScrollContainer?.() ?? container;
    const onScroll = () => scheduleRecalculate();

    scrollElement.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    scheduleRecalculate();

    return () => {
      scrollElement.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [
    viewport,
    contentVisible,
    virtualizeCards,
    getScrollContainer,
    recalculate,
    scheduleRecalculate,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (
      !container ||
      !contentVisible ||
      !virtualizeCards ||
      typeof ResizeObserver === 'undefined'
    ) {
      return;
    }

    updateMeasuredWidth(container.clientWidth);
    const observer = new ResizeObserver(() => {
      const next = containerRef.current?.clientWidth ?? 0;
      if (updateMeasuredWidth(next)) scheduleRecalculate();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [
    contentVisible,
    virtualizeCards,
    updateMeasuredWidth,
    scheduleRecalculate,
  ]);

  useEffect(() => {
    const s = m.current;
    // StrictMode remounts reuse this state: re-observe the mounted rows
    for (const node of s.measuredNodes.keys()) s.cardObserver?.observe(node);
    return () => {
      if (s.frame) {
        cancelAnimationFrame(s.frame);
        s.frame = 0;
      }
      s.cardObserver?.disconnect();
    };
  }, []);

  // ---- Svelte action: measureStart ----
  const hasStart = !!(active && cardListStart);
  useEffect(() => {
    const node = startRef.current;
    if (!hasStart || !node) return;
    const s = m.current;
    const measure = () => {
      s.startHeight = node.getBoundingClientRect().height;
      scheduleRecalculate();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => {
      observer.disconnect();
      s.startHeight = 0;
      scheduleRecalculate();
    };
  }, [hasStart, scheduleRecalculate]);

  // ---- Svelte action: dblclick ----
  const dblclickRef = useRef(null);
  const dblclickParams = {
    store,
    column: column.id,
    columnAccessor,
    swimlane,
    readonly,
  };
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    dblclickRef.current = dblclick(container, dblclickParams);
    return () => {
      dblclickRef.current?.destroy();
      dblclickRef.current = null;
    };
  }, []);
  useEffect(() => {
    dblclickRef.current?.update(dblclickParams);
  }, [store, column.id, columnAccessor, swimlane, readonly]);

  function renderPlaceholder(key) {
    return (
      <div
        key={key}
        className={`wx-drop-placeholder ${scope}`}
        aria-hidden="true"
        style={{ height: `${placeholderHeight}px` }}
      ></div>
    );
  }

  function renderCard(cardItem) {
    const extraCss = getCardExtraCss(cardItem);
    const isDragging = dnd?.active && dnd.cardId === cardItem.id;
    const rowClassName = [
      'wx-card-row',
      cardItem.css ?? '',
      extraCss,
      isDragging ? 'wx-dragging' : '',
      scope,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Fragment key={cardItem.id}>
        {isDropColumn &&
          dropTarget.before === cardItem.id &&
          renderPlaceholder(`drop-${cardItem.id}`)}
        <MeasuredCardRow
          cardItem={cardItem}
          className={rowClassName}
          measureCard={measureCard}
        >
          <CardWrapper
            card={cardItem}
            cardContent={cardContent}
            cardShape={cardShape}
            extraCss={extraCss}
          />
        </MeasuredCardRow>
      </Fragment>
    );
  }

  const StartSlot = cardListStart;
  const EndSlot = cardListEnd;

  return (
    <div
      className={`wx-column-cards ${scope}`}
      data-kanban-column-cards={active ? setID(column.id) : undefined}
      data-kanban-swimlane={
        swimlane === undefined ? undefined : setID(swimlane)
      }
      data-kanban-render-start={renderStart}
      data-kanban-render-end={renderEnd}
      data-kanban-card-count={cards.length}
      data-kanban-after-rendered-before-id={
        afterRenderedBeforeId == null ? undefined : setID(afterRenderedBeforeId)
      }
      ref={containerRef}
    >
      {hasStart && (
        <div className={`wx-card-list-start ${scope}`} ref={startRef}>
          <StartSlot
            column={column}
            swimlane={swimlaneView}
            cards={cards}
            readonly={readonly}
          />
        </div>
      )}
      {contentVisible && active ? (
        virtualizeCards ? (
          <>
            {topSpacerHeight > 0 && (
              <div
                className={`wx-virtual-spacer ${scope}`}
                style={{ height: `${topSpacerHeight}px` }}
              ></div>
            )}
            {renderedCards.map(renderCard)}
            {trailingPlaceholder &&
              !appendAfterSpacer &&
              renderPlaceholder('drop-trailing')}
            {bottomSpacerHeight > 0 && (
              <div
                className={`wx-virtual-spacer ${scope}`}
                style={{ height: `${bottomSpacerHeight}px` }}
              ></div>
            )}
            {appendAfterSpacer && renderPlaceholder('drop-append')}
          </>
        ) : (
          <>
            {cards.map(renderCard)}
            {trailingPlaceholder && renderPlaceholder('drop-trailing')}
          </>
        )
      ) : hiddenHeight > 0 && active ? (
        <div
          className={`wx-virtual-spacer ${scope}`}
          style={{ height: `${hiddenHeight}px` }}
        ></div>
      ) : null}
      {active && EndSlot && (
        <div className={`wx-card-list-end ${scope}`}>
          <EndSlot
            column={column}
            swimlane={swimlaneView}
            cards={cards}
            readonly={readonly}
          />
        </div>
      )}
    </div>
  );
}

function MeasuredCardRow({ cardItem, className, measureCard, children }) {
  const cleanupRef = useRef(null);

  const refCallback = useCallback(
    (node) => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (node) cleanupRef.current = measureCard(node, cardItem);
    },
    [measureCard, cardItem],
  );

  return (
    <div
      ref={refCallback}
      className={className}
      data-kanban-card-id={cardItem.id == null ? undefined : setID(cardItem.id)}
    >
      {children}
    </div>
  );
}

export default StackCardList;
