import pkg from '../package.json';
const version = pkg.version;

import Kanban from './components/Kanban.jsx';
import Editor from './components/Editor.jsx';
import CardActionMenu from './menus/CardActionMenu.jsx';
import CardMenuButton from './components/CardMenuButton.jsx';
import CardContextMenu from './menus/CardContextMenu.jsx';
import ColumnActionMenu from './menus/ColumnActionMenu.jsx';
import ColumnContextMenu from './menus/ColumnContextMenu.jsx';
import Toolbar from './components/Toolbar.jsx';
import Willow from './themes/Willow.jsx';
import WillowDark from './themes/WillowDark.jsx';

export {
  Kanban,
  Editor,
  CardActionMenu,
  CardMenuButton,
  CardContextMenu,
  ColumnActionMenu,
  ColumnContextMenu,
  /** @deprecated use `CardContextMenu` */
  CardContextMenu as ContextMenu,
  Toolbar,
  Willow,
  WillowDark,
  version,
};

export { RestDataProvider } from '@svar-ui/kanban-provider';

export {
  getCardShape,
  getEditorItems,
  getPriorityOptions,
} from './defaults.js';

export {
  getMenuOptions,
  getColumnMenuOptions,
  getToolbarItems,
} from '@svar-ui/kanban-store';

export { registerEditorItem } from '@svar-ui/react-editor';

