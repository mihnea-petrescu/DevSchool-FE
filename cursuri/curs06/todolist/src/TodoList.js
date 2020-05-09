import { LitElement, html, css } from 'lit-element';
import { read } from './storage.js';
import './TodoItem';

class TodoList extends LitElement {
  static get properties() {
    return {
      notes: { type: String },
    };
  }

  static get styles() {
    return css`
      div {
        background-color: #000000;
        border: 2rem solid #000000;
        width: 80%;
      }
    `;
  }

  constructor() {
    super();
    this.notes = JSON.stringify(read());
  }

  render() {
    return html`
      <div>
        ${JSON.parse(this.notes).map(
          note =>
            html`
              <todo-item
                name=${note.title}
                content=${note.content}
                category=${note.category}
              ></todo-item>
            `
        )}
      </div>
    `;
  }
}

window.customElements.define('todo-list', TodoList);
