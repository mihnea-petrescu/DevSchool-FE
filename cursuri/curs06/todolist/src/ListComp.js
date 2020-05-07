import { LitElement, html, css } from 'lit-element';
import { read } from './storage.js';
import './ListItem';

class ListComp extends LitElement {
  static get properties() {
    return {
      notes: { type: String },
    };
  }

  constructor() {
    super();
    this.notes = JSON.stringify(read());
  }

  render() {
    return html`
      <ul>
        ${JSON.parse(this.notes).map(
          note => html` <list-item name=${note.title} content=${note.content}></list-item> `
        )}
      </ul>
    `;
  }
}

window.customElements.define('list-comp', ListComp);
