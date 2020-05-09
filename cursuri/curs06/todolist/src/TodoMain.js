import { LitElement, html } from 'lit-element';
import { read } from './storage.js';
import './TodoAdd';
import './TodoList';

export class TodoMain extends LitElement {
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
      <todo-add @notes-changed=${this._onNotesChanged}></todo-add>
      <todo-list @notes-changed=${this._onNotesChanged} notes=${this.notes}></todo-list>
    `;
  }

  _onNotesChanged(event) {
    const notes = read();
    this.notes = JSON.stringify(notes);
  }
}
