import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useContext,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { ActionMenu, ContextMenu } from '@svar-ui/react-menu';
import { locale } from '@svar-ui/lib-dom';
import { en } from '@svar-ui/kanban-locales';
import { en as coreEn } from '@svar-ui/core-locales';
import { context } from '@svar-ui/react-core';
import { localizeOptions } from './helpers.js';
import './KanbanMenu.css';

const KanbanMenu = forwardRef(function KanbanMenu(props, ref) {
  const {
    options,
    resolver = null,
    filter = null,
    onClick,
    at = 'point',
    css = '',
    children,
    // `click` - ActionMenu, `contextmenu` - ContextMenu
    trigger,
    // attribute (camelCase) carrying the target id, e.g. `columnMenu`
    dataKey,
    resolve,
    defaults,
    builtin,
  } = props;

  // the menu wraps <Kanban> from the outside, so the kanban locale is not in
  // context unless the host provides one
  const i18n = useContext(context.i18n);
  const _ = useMemo(
    () => (i18n ?? locale({ ...en, ...coreEn })).getGroup('kanban'),
    [i18n],
  );

  // Items are resolved when the menu opens: the inner menu calls the resolver
  // before it renders, so they can follow the target's current state.
  const [current, setCurrent] = useState([]);
  const activeRef = useRef(null);

  const itemResolver = useCallback(
    (id, ev) => {
      const ctx = resolve(id, ev);
      if (!ctx) return null;
      if (resolver && !resolver(ctx, ev)) return null;

      const base =
        typeof options === 'function'
          ? options(ctx)
          : (options ?? defaults(ctx));
      if (!base || !base.length) return null;

      setCurrent(localizeOptions(base, _));
      activeRef.current = ctx;
      return ctx;
    },
    [resolve, resolver, options, defaults, _],
  );

  const menuAction = useCallback(
    (ev) => {
      // closing without a choice (outside click, Escape) comes with no action
      if (!ev?.action || !activeRef.current) return;
      builtin(ev.action, activeRef.current);
      onClick?.(ev);
    },
    [builtin, onClick],
  );

  const filterMenu = useCallback(
    (item, ctx) => (filter ? filter(item, ctx) : true),
    [filter],
  );

  const menuRef = useRef(null);
  useImperativeHandle(ref, () => ({
    show(ev, obj) {
      menuRef.current?.show(ev, obj);
    },
  }));

  const Menu = trigger === 'click' ? ActionMenu : ContextMenu;

  return (
    <Menu
      ref={menuRef}
      options={current}
      resolver={itemResolver}
      filter={filterMenu}
      onClick={menuAction}
      dataKey={dataKey}
      at={at}
      css={css}
    >
      {children}
    </Menu>
  );
});

export default KanbanMenu;
