import { LitElement, html, css } from 'lit-element';
import { remove } from './storage.js';

const debugBackground = html`
  <style>
    div {
      background-color: #aaaaaa;
      border: 1rem solid #aaaaaa;
    }
  </style>
`;

const infoBackground = html`
  <style>
    div {
      background-color: #008080;
      border: 1rem solid #008080;
    }
  </style>
`;

const warningBackground = html`
  <style>
    div {
      background-color: #cd853f;
      border: 1rem solid #cd853f;
    }
  </style>
`;

const errorBackground = html`
  <style>
    div {
      background-color: #b22222;
      border: 1rem solid #b22222;
    }
  </style>
`;

const criticalBackground = html`
  <style>
    div {
      background-color: red;
      border: 1rem solid red;
    }
  </style>
`;

export class TodoItem extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      content: { type: String },
      category: { type: String },
    };
  }

  static get styles() {
    return css`
      div {
        margin: 2rem;
      }
    `;
  }

  constructor() {
    super();
    this.contentVisible = false;
  }

  render() {
    if (this.category === 'Debug') this.elementStyle = debugBackground;
    else if (this.category === 'Info') this.elementStyle = infoBackground;
    else if (this.category === 'Warn') this.elementStyle = warningBackground;
    else if (this.category === 'Error') this.elementStyle = errorBackground;
    else if (this.category === 'Critical') this.elementStyle = criticalBackground;

    return html`
      ${this.elementStyle}
      <div>
        <p>Title: ${this.name}</p>
        <p name="content" hidden>Description: ${this.content}</p>
        <button @click=${this._onShow}>Show</button>
        <button @click=${this._onDelete}>Delete</button>
      </div>
    `;
  }

  _onShow(event) {
    const content = event.target.previousElementSibling;
    content.hidden = !content.hidden;
  }

  _onDelete(event) {
    remove(this.name);
    this.dispatchEvent(new CustomEvent('notes-changed', { composed: true, bubbles: true }));
  }

  updated(changedProperties) {
    console.log('here here here');
  }
}

window.customElements.define('todo-item', TodoItem);
