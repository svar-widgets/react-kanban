import type {
  FC,
  ComponentType,
  ReactNode,
  ComponentProps,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';
import { Editor as BaseEditor } from '@svar-ui/react-editor';

export { registerEditorItem } from '@svar-ui/react-editor';

/*
 * Store types — bubbled up from the source of @svar-ui/kanban-store
 * (the package ships no .d.ts, so the public surface is inlined here).
 */

export type CardID = string | number;
export type ColumnID = string | number;
export type SwimlaneID = string | number;

export type KanbanCard = {
  id: CardID;
  [key: string]: any;
};

export type ColumnSummaryConfig<T = any> = {
  id: string;
  calculate: (cards: readonly KanbanCard[], column: ColumnConfig) => T;
  format?: (value: T, column: ColumnConfig) => string;
  css?: (value: T, column: ColumnConfig) => string;
};

export type ColumnSummaryResult<T = any> = {
  id: string;
  value: T;
  text: string;
  css?: string;
};

/** Column dimensions are outer-box CSS pixels. */
export type ColumnConfig = {
  [key: string]: any;
  summaries?: ColumnSummaryConfig[];
  id: ColumnID;
  label: string;
  css?: string;
  metadata?: Record<string, any>;
  width?: number;
  cardWidth?: number;
  cardHeight?: number;
  addCard?: boolean;
  /** Shows the header ⋯ button for an outer `ColumnActionMenu` (default `false`). */
  menu?: boolean;
  collapsed?: boolean;
};

export type ColumnDataStatus = 'unknown' | 'loading' | 'loaded';

/**
 * Projected column: custom `ColumnConfig` fields pass through unchanged;
 * `summaries`, `dataStatus` and `cards` are computed and override same-named config fields.
 */
export type ColumnView = Omit<ColumnConfig, 'summaries'> & {
  width?: number;
  cardWidth?: number;
  cardHeight?: number;
  id: ColumnID;
  label: string;
  css?: string;
  metadata?: Record<string, any>;
  addCard: boolean;
  menu: boolean;
  collapsed: boolean;
  summaries: ColumnSummaryResult[];
  dataStatus: ColumnDataStatus;
  cards: KanbanCard[];
};

export type ColumnAccessor =
  | string
  | {
      get: (card: KanbanCard) => ColumnID;
      set: (card: KanbanCard, value: ColumnID) => KanbanCard;
    };

export type SwimlaneAccessor = ColumnAccessor;

export type SwimlaneConfig = {
  id: SwimlaneID;
  label: string;
  collapsed?: boolean;
  css?: string;
  metadata?: Record<string, any>;
};

export type SwimlaneCellView = {
  column: ColumnID;
  cards: KanbanCard[];
};

export type SwimlaneView = SwimlaneConfig & {
  collapsed: boolean;
  count: number;
  cells: SwimlaneCellView[];
};

export type SortCriterion =
  | ((a: KanbanCard, b: KanbanCard) => number)
  | { field: string; dir?: 'asc' | 'desc' }
  | null;

export type FilterPredicate = (card: KanbanCard) => boolean;

export type ToolbarButtonConfig = {
  add?: boolean;
  undo?: boolean;
  sort?: boolean;
};

export type ExportHelpers = {
  post: (url: string, data: Record<string, string>) => void;
  serialize: (value: any) => string;
};

export type ExportConfig = {
  url?:
    | string
    | ((
        data: ExportConfig,
        records: KanbanCard[],
        helpers: ExportHelpers,
      ) => void);
  format?: string;
  fileName?: string;
  skin?: string;
  paper?: {
    fitSize?: boolean;
    size?: string | { width: number; height: number };
    landscape?: boolean;
    styles?: string | string[];
    margins?: { top?: number; bottom?: number; left?: number; right?: number };
    header?: string;
    footer?: string;
    scale?: number;
  };
  excel?: {
    sheetNames?: string[];
    dateFormat?: string;
    indent?: 'native' | 'spaces';
  };
  data?: Record<string, any>;
};

export interface StoreActions {
  ['add-column']: {
    column: Partial<ColumnConfig>;
    id?: ColumnID;
    before?: ColumnID | null;
  };
  ['delete-column']: { id: ColumnID };
  ['move-column']: { id: ColumnID; before?: ColumnID | null };
  ['add-swimlane']: {
    swimlane: Partial<SwimlaneConfig>;
    id?: SwimlaneID;
    before?: SwimlaneID | null;
  };
  ['delete-swimlane']: { id: SwimlaneID };
  ['move-swimlane']: { id: SwimlaneID; before?: SwimlaneID | null };
  ['add-card']: {
    card: Partial<KanbanCard>;
    edit?: boolean;
    id?: CardID;
    /** Insert before this card; `null` appends. Wins over `after`. */
    before?: CardID | null;
    /** Convenience hint, normalized to `before` by the handler. */
    after?: CardID;
  };
  ['update-card']: { id: CardID; card: Partial<KanbanCard> };
  ['move-card']: {
    id: CardID;
    column?: ColumnID;
    swimlane?: SwimlaneID;
    before?: CardID | null;
  };
  ['update-swimlane']: { id: SwimlaneID; swimlane: Partial<SwimlaneConfig> };
  ['update-column']: {
    id: ColumnID;
    column: Partial<ColumnConfig>;
    skipProvider?: boolean;
  };
  ['duplicate-card']: {
    id: CardID;
    card?: Partial<KanbanCard>;
    edit?: boolean;
  };
  ['delete-card']: { id: CardID };
  ['select-card']: { id: CardID | null };
  ['filter-cards']: { filter?: FilterPredicate | null; tag?: string };
  ['sort-cards']: { sort?: SortCriterion };
  ['request-data']: { id: ColumnID };
  ['provide-data']: { id?: ColumnID; cards: KanbanCard[] };
  ['export-data']: ExportConfig;
  ['undo']: Record<string, never>;
  ['redo']: Record<string, never>;
}

/*
 * Widget types — bubbled up from the widget source (types.ts).
 */

type ShapeConfig<T> = boolean | T;

export type CardShapeItem = {
  id: CardID;
  label: string;
  css?: string;
};

export type CardShapeUserItem = {
  id: CardID;
  label: string;
  img?: string;
};

export type CardPriorityShape = {
  data?: CardShapeItem[];
};

export type CardTagsShape = {
  max?: number;
  data?: CardShapeItem[];
};

export type CardUsersShape = {
  max?: number;
  data?: CardShapeUserItem[];
};

export type CardDeadlineShape = {
  format?: string | ((date: Date) => string);
};

/** What a column menu was opened for. */
export type ColumnMenuContext = {
  column: ColumnView;
  /** Cards under the clicked header: the column's cards, or one lane's in the stack layout. */
  cards: KanbanCard[];
  /** The lane of the clicked header; only set in the stack layout. */
  swimlane?: SwimlaneView;
};

/** Props shared by `CardActionMenu`, `CardContextMenu`, `ColumnActionMenu` and `ColumnContextMenu`. */
export type KanbanMenuProps<T> = {
  /** Kanban instance (`ref` / `init`); the menu stays inert until it is set. */
  api?: KanbanInstanceApi | null;
  /** Items, or a function called on every open. Empty/nullish result - no menu. Omitted - defaults. */
  options?: any[] | ((ctx: T) => any[] | null | undefined | false);
  /** Gate after the target is resolved; falsy - no menu. */
  resolver?: ((ctx: T, ev: MouseEvent) => any) | null;
  /** Per-item filter for the resolved target. */
  filter?: ((item: any, ctx: T) => boolean) | null;
  /** Called after built-in items ran; `ev.context` is the target. */
  onClick?: (ev: any) => void;
  /** Placement, forwarded to the menu (default `"point"`). */
  at?: string;
  css?: string;
  children?: ReactNode;
};

export type CardListSlotProps = {
  column: ColumnView;
  swimlane?: SwimlaneView;
  /** All filtered and sorted cards in this area. */
  cards: KanbanCard[];
  readonly: boolean;
};

export type CardShape = {
  cover?: boolean;
  priority?: ShapeConfig<CardPriorityShape>;
  progress?: ShapeConfig<{ showLabel?: boolean }>;
  deadline?: ShapeConfig<CardDeadlineShape>;
  users?: ShapeConfig<CardUsersShape>;
  tags?: ShapeConfig<CardTagsShape>;
  attachments?: boolean;
  comments?: boolean;
  description?: boolean;
  /** Renders the card ⋯ button for an outer `CardActionMenu`. */
  menu?: boolean;
};

export type EditorShape = {
  description?: boolean;
  priority?: ShapeConfig<CardPriorityShape>;
  progress?: ShapeConfig<{ showLabel?: boolean }>;
  deadline?: ShapeConfig<CardDeadlineShape>;
  tags?: ShapeConfig<CardTagsShape>;
  users?: ShapeConfig<CardUsersShape>;
};

export type RenderConfig = {
  /** `"stack"` renders one vertical column of groups; default `"board"`. */
  layout?: 'board' | 'stack';
  columnScroll?: boolean;
  fixedColumnWidth?: boolean;
  virtualizeCards?: boolean;
  virtualizeColumns?: boolean;
  estimatedCardHeight?: number;
  cardOverscan?: number;
  columnOverscan?: number;
};

export type CardCssFn = (card: KanbanCard, column: ColumnView) => string;
export type ColumnCssFn = (cards: KanbanCard[], column: ColumnView) => string;

/** Destination resolved by the widget; `before: null` appends to the cell. */
export type CardProjectionTarget = {
  column: ColumnID;
  swimlane?: SwimlaneID;
  before: CardID | null;
};

/**
 * Application-owned external drag descriptor. The host sets `card` and
 * `htmlEvent`; the widget writes `target` and destination membership into `card`.
 */
export type CardProjection = {
  htmlEvent: { clientX: number; clientY: number } | null;
  card: Partial<KanbanCard>;
  target?: CardProjectionTarget | null;
};

export type KanbanInstanceApi = {
  getState: () => any;
  getReactiveState: () => any;
  getStores: () => { data: any };
  getCards: () => KanbanCard[];
  exec: <A extends keyof StoreActions>(
    action: A,
    data: StoreActions[A],
  ) => Promise<any>;
  on: <A extends keyof StoreActions>(
    action: A,
    handler: (data: StoreActions[A]) => void,
  ) => void;
  intercept: <A extends keyof StoreActions>(
    action: A,
    handler: (data: StoreActions[A]) => void | boolean | Promise<boolean>,
  ) => void;
  detach: (tag: number | string | symbol) => void;
  setNext: (handler: any) => any;
};

/*
 * Component events — store actions surface as camelCased `on*` props.
 *   add-card -> onAddCard, update-card -> onUpdateCard, sort-cards -> onSortCards, ...
 */
type PascalJoin<S extends string> = S extends `${infer Head}-${infer Tail}`
  ? `${Capitalize<Head>}${PascalJoin<Tail>}`
  : Capitalize<S>;

type EventName<K extends string> = `on${PascalJoin<K>}`;

export type KanbanActions<TActions extends Record<string, any>> = {
  [K in keyof TActions as EventName<K & string>]?: (ev: TActions[K]) => void;
} & {
  [key: `on${string}`]: (ev?: any) => void;
};

export type KanbanEventHandlers = {
  [K in keyof StoreActions as EventName<K & string>]?: (
    ev: StoreActions[K],
  ) => void;
};


/*
 * Components.
 */

export interface KanbanProps {
  cards: KanbanCard[];
  // omitted: columns are inferred from the cards through columnAccessor
  columns?: ColumnConfig[];
  columnAccessor?: ColumnAccessor;
  swimlanes?: SwimlaneConfig[];
  swimlaneAccessor?: SwimlaneAccessor;
  filters?: Map<string, FilterPredicate>;
  sort?: SortCriterion;
  card?: CardShape;
  readonly?: boolean;
  render?: RenderConfig;
  dynamicData?: boolean;
  history?: boolean;
  cardContent?: FC<{ card: KanbanCard; cardShape: CardShape }>;
  init?: (api: KanbanInstanceApi) => void;
  tooltip?: any;
  cardPopup?: any;
  cardListStart?: ComponentType<CardListSlotProps>;
  cardListEnd?: ComponentType<CardListSlotProps>;
  cardCss?: CardCssFn;
  columnCss?: ColumnCssFn;
  cardProjection?: CardProjection | null;
}

export declare const Kanban: ForwardRefExoticComponent<
  KanbanProps &
    KanbanEventHandlers &
    KanbanActions<StoreActions> &
    RefAttributes<KanbanInstanceApi>
>;

export declare const Editor: FC<
  Omit<ComponentProps<typeof BaseEditor>, 'values'> & {
    api: KanbanInstanceApi;
  }
>;

type KanbanMenuApi = { show: (ev: any, obj?: any) => void };

/** Opens on a click of the card ⋯ button (card.menu: true). */
export declare const CardActionMenu: ForwardRefExoticComponent<
  KanbanMenuProps<KanbanCard> & RefAttributes<KanbanMenuApi>
>;

/** Opens on a right click anywhere on a card. */
export declare const CardContextMenu: ForwardRefExoticComponent<
  KanbanMenuProps<KanbanCard> & RefAttributes<KanbanMenuApi>
>;

/** @deprecated use `CardContextMenu` */
export declare const ContextMenu: typeof CardContextMenu;

/** Opens on a click of the column header ⋯ button (column.menu: true). */
export declare const ColumnActionMenu: ForwardRefExoticComponent<
  KanbanMenuProps<ColumnMenuContext> & RefAttributes<KanbanMenuApi>
>;

/** Opens on a right click anywhere on a column header. */
export declare const ColumnContextMenu: ForwardRefExoticComponent<
  KanbanMenuProps<ColumnMenuContext> & RefAttributes<KanbanMenuApi>
>;

/** Card ⋯ button that opens an outer CardActionMenu; usable inside a custom `cardContent`. */
export declare const CardMenuButton: FC<{
  card: KanbanCard;
  /** Extra class names for the button. */
  css?: string;
}>;


export declare const Toolbar: FC<{
  api?: KanbanInstanceApi | null;
  items?: any[];
  add?: boolean;
  undo?: boolean;
  sort?: boolean;
}>;

export declare const Willow: FC<{
  fonts?: boolean;
  children?: ReactNode;
}>;

export declare const WillowDark: FC<{
  fonts?: boolean;
  children?: ReactNode;
}>;

export declare const version: string;

/*
 * Defaults and helpers.
 */

export declare function getCardShape(): CardShape;
export declare function getEditorItems(shape?: EditorShape | CardShape): any[];
export declare function getPriorityOptions(): {
  id: number;
  label: string;
  css: string;
}[];
export declare function getMenuOptions(): {
  id: string;
  text: string;
  icon: string;
}[];
export declare function getColumnMenuOptions(): {
  id: string;
  text: string;
  icon: string;
}[];
export declare function getToolbarItems(config?: ToolbarButtonConfig): any[];

/* RestDataProvider — bubbled up from @svar-ui/kanban-provider (ships no .d.ts) */
export declare class RestDataProvider {
  constructor(url: string, options?: any);
}
