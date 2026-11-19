import { useState, useMemo, Fragment } from 'react';
import { getData } from '../data.js';
import { Kanban, Editor, CardActionMenu } from '../../src/index.js';
import { Locale } from '@svar-ui/react-core';
import * as core from '@svar-ui/core-locales';
import * as kanban from '@svar-ui/kanban-locales';
import { DemoPage, Choice } from '../ui/index.js';

const { columns, cards } = getData();

// language id -> kanban and core dictionaries
const languages = [
  { id: 'en', label: 'English', kanban: kanban.en, core: core.en },
  { id: 'cn', label: 'Chinese', kanban: kanban.cn, core: core.cn },
  { id: 'de', label: 'German', kanban: kanban.de, core: core.de },
  { id: 'es', label: 'Spanish', kanban: kanban.es, core: core.es },
  { id: 'fr', label: 'French', kanban: kanban.fr, core: core.fr },
  { id: 'it', label: 'Italian', kanban: kanban.it, core: core.it },
  { id: 'jp', label: 'Japanese', kanban: kanban.jp, core: core.ja },
  { id: 'pt', label: 'Portuguese', kanban: kanban.pt, core: core.pt },
  { id: 'ru', label: 'Russian', kanban: kanban.ru, core: core.ru },
];
const options = languages.map(({ id, label }) => ({ id, label }));

// Column labels are user data, not part of the widget's i18n; they are
// translated here only to make the switch visible on the board.
const columnLabels = {
  ru: { todo: 'К выполнению', doing: 'В работе', done: 'Готово' },
  de: { todo: 'Zu erledigen', doing: 'In Arbeit', done: 'Erledigt' },
  fr: { todo: 'À faire', doing: 'En cours', done: 'Terminé' },
  es: { todo: 'Por hacer', doing: 'En curso', done: 'Hecho' },
  it: { todo: 'Da fare', doing: 'In corso', done: 'Fatto' },
  pt: { todo: 'A fazer', doing: 'Em andamento', done: 'Concluído' },
  jp: { todo: '未着手', doing: '進行中', done: '完了' },
  cn: { todo: '待办', doing: '进行中', done: '已完成' },
};

function Locales() {
  const [api, setApi] = useState(null);
  const [lang, setLang] = useState('en');

  const words = useMemo(() => {
    const l = languages.find((l) => l.id === lang) ?? languages[0];
    return { ...l.kanban, ...l.core };
  }, [lang]);

  const localizedColumns = useMemo(
    () =>
      columns.map((c) => ({
        ...c,
        label: columnLabels[lang]?.[c.id] ?? c.label,
      })),
    [lang],
  );

  // the open editor shows most of the translated words
  function init(value) {
    setApi(value);
    value.exec('select-card', { id: 1 });
  }

  return (
    <DemoPage
      toolbar={
        <Choice
          options={options}
          value={lang}
          onChange={({ value }) => setLang(value)}
        />
      }
    >
      <Fragment key={lang}>
        <Locale words={words}>
          <CardActionMenu api={api}>
            <Kanban
              init={init}
              cards={cards}
              columns={localizedColumns}
              card={{ menu: true }}
            />
          </CardActionMenu>
          {api && <Editor api={api} />}
        </Locale>
      </Fragment>
    </DemoPage>
  );
}

export default Locales;
