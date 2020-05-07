import { LitElement, html, css } from 'lit-element';
import { read, remove } from './storage.js';

export class ListItem extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      content: { type: String },
      contentVisible: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.contentVisible = false;
  }

  render() {
    return html`
      <li>
        <p>Title: ${this.name}</p>
        <p name="content" hidden>Description: ${this.content}</p>
      </li>
      <button @click=${this._onShow}>Show</button>
      <button @click=${this._onDelete}>Delete</button>
    `;
  }

  _onShow(event) {
    const content = event.target.previousElementSibling.lastElementChild;
    content.hidden = !content.hidden;
  }

  _onDelete(event) {
    remove(this.name);
    console.log(this.name);
    this.dispatchEvent(new CustomEvent('notes-changed', { composed: true, bubbles: true }));
  }
}

window.customElements.define('list-item', ListItem);
