<div align="center">

# SVAR React Kanban

[Website](https://svar.dev/react/kanban/) • [Docs](https://docs.svar.dev/react/kanban/getting-started/quick-start/) • [Demos](https://docs.svar.dev/react/kanban/samples/)

[![npm](https://img.shields.io/npm/v/@svar-ui/react-kanban.svg)](https://www.npmjs.com/package/@svar-ui/react-kanban)
[![License](https://img.shields.io/github/license/svar-widgets/react-kanban)](https://github.com/svar-widgets/react-kanban/blob/main/license.txt)
[![npm downloads](https://img.shields.io/npm/dm/@svar-ui/react-kanban.svg)](https://www.npmjs.com/package/@svar-ui/react-kanban)

</div>

[SVAR React Kanban](https://svar.dev/react/kanban/) is a customizable, interactive Kanban board component for React. It supports drag-and-drop between columns, card reordering within a column, editing, filtering, and rich customization options. The component is a good fit for task management apps, including agile dashboards and project planning tools.

The kanban comes with full TypeScript support, extensible API, and flexible CSS styling. The PRO Edition offers extra features for enterprise projects (data export, dynamic loading, undo/redo support).

<div align="center">
<img src="https://svar.dev/images/github/github_kanban.gif" alt="SVAR React Kanban Preview">
</div>

### ✨ Key Features

- Drag-and-drop cards between and within columns
- Built-in card editor
- Card and column menus
- Toolbar
- Column summaries
- Card filtering, sorting, and grouping
- Custom card templates
- Localization
- Light and dark themes
- Stack layout for small screens
- REST data provider for backend integration
- Live multi-user updates
- Full TypeScript support

### 🚀 PRO Edition

SVAR React Kanban is available in open-source and PRO editions. PRO features include:

- Swimlanes
- Group manager for columns and swimlanes
- Card grid – fixed-size tiles inside a column
- Drag-in from external lists
- Dynamic data loading
- Undo/redo
- Export to PDF, PNG, Excel

Visit the [pricing page](https://svar.dev/react/kanban/pricing/) for licensing details, feature comparison, and free trial.

[Check out the live demo](https://svar.dev/demos/react/kanban/) to see SVAR React Kanban in action.

### :hammer_and_wrench: How to Use

Import the package, pass `cards` and `columns` arrays, and optionally attach the editor through the kanban API:

```jsx
import { useState } from 'react';
import { Kanban, Editor } from '@svar-ui/react-kanban';
import '@svar-ui/react-kanban/all.css';

const columns = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

const cards = [
  { id: 1, label: 'Design landing page', column: 'backlog', priority: 'high' },
  { id: 2, label: 'Set up CI pipeline', column: 'inprogress' },
  { id: 3, label: 'Write API docs', column: 'done' },
];

export default function App() {
  const [api, setApi] = useState(null);

  return (
    <>
      <Kanban init={setApi} cards={cards} columns={columns} />
      {api && <Editor api={api} />}
    </>
  );
}
```

For further instructions, follow the detailed [quick start guide](https://docs.svar.dev/react/kanban/getting-started/quick-start/).

### :speech_balloon: Need Help?

[Post an issue](https://github.com/svar-widgets/react-kanban/issues) or use our [community forum](https://forum.svar.dev).

### ⭐ Show Your Support

If SVAR React Kanban helps your project, [give it a star](https://github.com/svar-widgets/react-kanban). It helps other developers discover this library and motivates us to keep improving.
