import { DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import './index.css';

function createContentDom(content: string, strong = false) {
  const p = document.createElement('p');
  if (strong) {
    const strong = document.createElement('strong');
    strong.innerHTML = content;
    p.appendChild(strong);
  } else {
    p.innerHTML = content;
  }
  return p;
}

function main() {
  const parseNode = DOMParser.fromSchema(schema).parse(
    createContentDom('Test Title', true),
  );
  console.log(parseNode.resolve(2));
  const state = EditorState.create({
    // schema,
    doc: schema.node('doc', null, [
      // DOMParser.fromSchema(schema).parse() create a doc type node
      ...parseNode.content.content,
      schema.node('horizontal_rule'),
      schema.node('paragraph', null, [schema.text('Content!')]),
    ]),
    plugins: [
      history(),
      keymap({ 'Mod-z': undo, 'Mod-y': redo }),
      keymap(baseKeymap),
    ],
  });

  const view = new EditorView(document.body, {
    state,
    dispatchTransaction(transaction) {
      console.log(
        'Document size went from',
        transaction.before.content.size,
        'to',
        transaction.doc.content.size,
        transaction.doc.content.content,
      );
      if (transaction.doc.content.size !== transaction.before.content.size) {
        transaction.insertText('$');
      }

      const newState = view.state.apply(transaction);
      view.updateState(newState);
    },
  });

  const rootEl = document.querySelector('#root');
  if (rootEl) {
    rootEl.appendChild(view.dom);
  }
}

main();
