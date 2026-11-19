import { useContext, useMemo, useRef, useEffect } from 'react';
import { context } from '@svar-ui/react-core';
import { setID } from '@svar-ui/lib-dom';
import { useStore } from '@svar-ui/lib-react';
import CardList from './CardList.jsx';
import { createColumnCard } from '../directives/dblclick.js';
import { KanbanApiContext } from '../context.js';
import './Column.css';

const scope = 'wx-aadf0UPJ';

function Column(props) {
  const {
    column,
    headerOnly = false,
    readonly = false,
    cardContent,
    cardShape,
    contentVisible,
    virtualizeCards,
    estimatedCardHeight,
    cardOverscan,
    fixedColumnWidth,
    registerColumn,
    cardListStart,
    cardListEnd,
    cardCss,
    columnCss,
  } = props;

  const dynamicColumnCss = useMemo(
    () => (columnCss ? (columnCss(column.cards, column) ?? '') : ''),
    [columnCss, column],
  );

  const store = useContext(KanbanApiContext);
  const columnAccessor = useStore(store, 'columnAccessor');
  const locale = useContext(context.i18n);
  const _ = locale.getGroup('kanban');

  const root = useRef(null);

  const addCardVisible = column.addCard !== false && !readonly;

  function toggleCollapsed() {
    store.exec('update-column', {
      id: column.id,
      column: { collapsed: !column.collapsed },
      skipProvider: true,
    });
  }

  function addCard() {
    if (!addCardVisible) return;

    const card = createColumnCard({}, columnAccessor, column.id);
    store.exec('add-card', { card, edit: true });
  }

  useEffect(() => {
    if (!registerColumn || !root.current) return;

    const id = column.id;
    registerColumn(id, root.current);

    return () => registerColumn(id, null);
  }, [registerColumn, column.id]);


  const sectionClassName = [
    'wx-column',
    column.css ?? '',
    dynamicColumnCss,
    column.collapsed ? 'wx-collapsed' : '',
    scope,
  ]
    .filter(Boolean)
    .join(' ');

  const sized = column.width !== undefined;
  const sectionStyle = {
    boxSizing: sized ? 'border-box' : undefined,
    flex: !column.collapsed && sized ? `0 0 ${column.width}px` : undefined,
    minWidth: !column.collapsed && sized ? `${column.width}px` : undefined,
  };

  return (
    <section
      className={sectionClassName}
      data-column-id={column.collapsed ? setID(column.id) : undefined}
      style={sectionStyle}
      ref={root}
    >
      {column.collapsed ? (
        <>
          <button
            type="button"
            className={`wx-expand ${scope}`}
            onClick={toggleCollapsed}
            aria-expanded={false}
            title={column.label}
            aria-label={`${_('Expand column')} ${column.label}`}
          >
            <i className={`wx-icon wxi-angle-right ${scope}`}></i>
          </button>
          {!headerOnly && (
            <div className={`wx-body ${scope}`}>
              <h3 className={`wx-title ${scope}`}>
                <span className={scope}>{column.label}</span>
              </h3>
            </div>
          )}
        </>
      ) : (
        <>
          <header
            className={`wx-column-header ${scope}`}
            data-column-id={setID(column.id)}
          >
            <button
              type="button"
              className={`wx-toggle ${scope}`}
              onClick={toggleCollapsed}
              aria-expanded={true}
              aria-label={_('Collapse column')}
            >
              <i className={`wx-icon wxi-angle-left ${scope}`}></i>
            </button>
            <h3 className={`wx-title ${scope}`}>{column.label}</h3>
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
            {addCardVisible && (
              <button
                type="button"
                className={`wx-add ${scope}`}
                onClick={addCard}
                aria-label={`${_('Add card to')} ${column.label}`}
              >
                <i className={`wx-icon wxi-plus ${scope}`}></i>
              </button>
            )}
          </header>
          {!headerOnly && (
            <CardList
              column={column}
              readonly={readonly}
              cardContent={cardContent}
              cardShape={cardShape}
              contentVisible={contentVisible}
              virtualizeCards={virtualizeCards}
              estimatedCardHeight={estimatedCardHeight}
              cardOverscan={cardOverscan}
              fixedColumnWidth={fixedColumnWidth}
              cardListStart={cardListStart}
              cardListEnd={cardListEnd}
              cardCss={cardCss}
            />
          )}
        </>
      )}
    </section>
  );
}

export default Column;
