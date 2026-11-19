import BasicInit from './cases/BasicInit.jsx';
import Readonly from './cases/Readonly.jsx';
import ApiEvents from './cases/ApiEvents.jsx';
import Rules from './cases/Rules.jsx';
import CardSections from './cases/CardSections.jsx';
import CardTemplate from './cases/CardTemplate.jsx';
import CardStyling from './cases/CardStyling.jsx';
import CardMenu from './cases/CardMenu.jsx';
import Tooltip from './cases/Tooltip.jsx';
import CardPopup from './cases/CardPopup.jsx';
import ColumnOptions from './cases/ColumnOptions.jsx';
import ColumnActions from './cases/ColumnActions.jsx';
import ColumnStyling from './cases/ColumnStyling.jsx';
import ColumnSummaries from './cases/ColumnSummaries.jsx';
import ColumnMenu from './cases/ColumnMenu.jsx';
import CardListSlots from './cases/CardListSlots.jsx';
import ColumnsFromData from './cases/ColumnsFromData.jsx';
import GroupBy from './cases/GroupBy.jsx';
import Sorting from './cases/Sorting.jsx';
import FilterApi from './cases/FilterApi.jsx';
import FilterBar from './cases/FilterBar.jsx';
import FilterBuilder from './cases/FilterBuilder.jsx';
import FilterQuery from './cases/FilterQuery.jsx';
import ScrollLayout from './cases/ScrollLayout.jsx';
import Virtualization from './cases/Virtualization.jsx';
import StackLayout from './cases/StackLayout.jsx';
import Responsive from './cases/Responsive.jsx';
import EditorFields from './cases/EditorFields.jsx';
import EditorPlacement from './cases/EditorPlacement.jsx';
import EditorToolbar from './cases/EditorToolbar.jsx';
import EditorCustomItems from './cases/EditorCustomItems.jsx';
import EditorRichText from './cases/EditorRichText.jsx';
import EditorCode from './cases/EditorCode.jsx';
import Toolbar from './cases/Toolbar.jsx';
import ToolbarCustom from './cases/ToolbarCustom.jsx';
import JsonData from './cases/JsonData.jsx';
import ExcelImport from './cases/ExcelImport.jsx';
import ExcelExport from './cases/ExcelExport.jsx';
import Locales from './cases/Locales.jsx';
import ThemeVariables from './cases/ThemeVariables.jsx';
import SaveToBackend from './cases/SaveToBackend.jsx';
import MultiUser from './cases/MultiUser.jsx';
import EditorFiles from './cases/EditorFiles.jsx';


// [route, title, component, { file, pro?, aliases? }]
// Every route and alias ends in '/:skin'; an alias opens the canonical route.
export const links = [
  {
    group: 'Basics',
    items: [
      [
        '/basic/:skin',
        'Basic',
        BasicInit,
        { file: 'BasicInit', aliases: ['/base/:skin'] },
      ],
      ['/readonly/:skin', 'Readonly', Readonly, { file: 'Readonly' }],
      ['/api-events/:skin', 'API & events', ApiEvents, { file: 'ApiEvents' }],
      ['/rules/:skin', 'Rules (intercept)', Rules, { file: 'Rules' }],
    ],
  },
  {
    group: 'Cards',
    items: [
      [
        '/card-sections/:skin',
        'Card sections',
        CardSections,
        { file: 'CardSections', aliases: ['/templates/:skin'] },
      ],
      [
        '/card-template/:skin',
        'Custom card template',
        CardTemplate,
        { file: 'CardTemplate' },
      ],
      [
        '/card-styling/:skin',
        'Card styling',
        CardStyling,
        { file: 'CardStyling', aliases: ['/styling/:skin'] },
      ],
      ['/card-menu/:skin', 'Card menu', CardMenu, { file: 'CardMenu' }],
      ['/tooltip/:skin', 'Tooltip', Tooltip, { file: 'Tooltip' }],
      [
        '/card-preview/:skin',
        'Card preview',
        CardPopup,
        { file: 'CardPopup', aliases: ['/card-popup/:skin'] },
      ],
    ],
  },
  {
    group: 'Columns',
    items: [
      [
        '/column-options/:skin',
        'Column options',
        ColumnOptions,
        { file: 'ColumnOptions' },
      ],
      [
        '/column-actions/:skin',
        'Column actions',
        ColumnActions,
        { file: 'ColumnActions' },
      ],
      [
        '/column-styling/:skin',
        'Column styling',
        ColumnStyling,
        { file: 'ColumnStyling' },
      ],
      [
        '/column-summaries/:skin',
        'Column summaries',
        ColumnSummaries,
        { file: 'ColumnSummaries' },
      ],
      ['/column-menu/:skin', 'Column menu', ColumnMenu, { file: 'ColumnMenu' }],
      [
        '/card-list-slots/:skin',
        'Card list slots',
        CardListSlots,
        { file: 'CardListSlots' },
      ],
    ],
  },
  {
    group: 'Grouping, sorting, filtering',
    items: [
      [
        '/columns-from-data/:skin',
        'Columns from data',
        ColumnsFromData,
        { file: 'ColumnsFromData', aliases: ['/auto-grouping/:skin'] },
      ],
      [
        '/group-by-field/:skin',
        'Group by field',
        GroupBy,
        { file: 'GroupBy', aliases: ['/group-by/:skin'] },
      ],
      ['/sorting/:skin', 'Sorting', Sorting, { file: 'Sorting' }],
      [
        '/filtering-api/:skin',
        'Filtering API',
        FilterApi,
        { file: 'FilterApi' },
      ],
      [
        '/filter-bar/:skin',
        'Filter bar',
        FilterBar,
        { file: 'FilterBar', aliases: ['/filter/:skin'] },
      ],
      [
        '/filter-builder/:skin',
        'Filter builder',
        FilterBuilder,
        { file: 'FilterBuilder' },
      ],
      [
        '/filter-query/:skin',
        'Filter query',
        FilterQuery,
        { file: 'FilterQuery' },
      ],
    ],
  },
  {
    group: 'Layout & performance',
    items: [
      [
        '/scroll-and-column-width/:skin',
        'Scroll & column width',
        ScrollLayout,
        { file: 'ScrollLayout', aliases: ['/layout/:skin'] },
      ],
      [
        '/virtualization/:skin',
        'Virtualization',
        Virtualization,
        { file: 'Virtualization', aliases: ['/performance/:skin'] },
      ],
      [
        '/stack-layout/:skin',
        'Stack layout',
        StackLayout,
        { file: 'StackLayout', aliases: ['/stack-view/:skin'] },
      ],
      ['/responsive/:skin', 'Responsive', Responsive, { file: 'Responsive' }],
    ],
  },
  {
    group: 'Editor',
    items: [
      [
        '/fields-and-validation/:skin',
        'Fields & validation',
        EditorFields,
        { file: 'EditorFields', aliases: ['/editor/:skin'] },
      ],
      [
        '/placement-and-layout/:skin',
        'Placement & layout',
        EditorPlacement,
        { file: 'EditorPlacement' },
      ],
      [
        '/toolbar-actions/:skin',
        'Toolbar actions',
        EditorToolbar,
        { file: 'EditorToolbar' },
      ],
      [
        '/custom-items/:skin',
        'Custom items',
        EditorCustomItems,
        { file: 'EditorCustomItems' },
      ],
      [
        '/rich-text/:skin',
        'Rich text',
        EditorRichText,
        { file: 'EditorRichText', aliases: ['/editor-rich-text/:skin'] },
      ],
      [
        '/markdown/:skin',
        'Markdown',
        EditorCode,
        { file: 'EditorCode', aliases: ['/editor-code/:skin'] },
      ],
    ],
  },
  {
    group: 'Toolbar & history',
    items: [
      ['/toolbar/:skin', 'Toolbar', Toolbar, { file: 'Toolbar' }],
      [
        '/custom-toolbar/:skin',
        'Custom toolbar',
        ToolbarCustom,
        { file: 'ToolbarCustom' },
      ],
    ],
  },
  {
    group: 'Import & export',
    items: [
      [
        '/load-and-save-json/:skin',
        'Load & save JSON',
        JsonData,
        { file: 'JsonData' },
      ],
      [
        '/excel-import/:skin',
        'Excel import',
        ExcelImport,
        { file: 'ExcelImport', aliases: ['/excel/:skin'] },
      ],
      [
        '/excel-export/:skin',
        'Excel export',
        ExcelExport,
        { file: 'ExcelExport' },
      ],
    ],
  },
  {
    group: 'Localization & theming',
    items: [
      ['/locales/:skin', 'Locales', Locales, { file: 'Locales' }],
      [
        '/theme-variables/:skin',
        'Theme variables',
        ThemeVariables,
        { file: 'ThemeVariables' },
      ],
    ],
  },
  {
    group: 'Backend',
    items: [
      [
        '/save-to-backend/:skin',
        'Save to backend',
        SaveToBackend,
        { file: 'SaveToBackend' },
      ],
      ['/multi-user/:skin', 'Multi-user', MultiUser, { file: 'MultiUser' }],
      [
        '/file-attachments/:skin',
        'File attachments',
        EditorFiles,
        { file: 'EditorFiles', aliases: ['/editor-files/:skin'] },
      ],
    ],
  },
];
