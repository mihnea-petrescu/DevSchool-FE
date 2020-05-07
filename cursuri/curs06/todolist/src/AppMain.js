import { LitElement, html } from 'lit-element';
import { read } from './storage.js';
import './AddComp';
import './ListComp';

export class AppMain extends LitElement {
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
      <add-comp @notes-changed=${this._onNotesChanged}></add-comp>
      <list-comp @notes-changed=${this._onNotesChanged} notes=${this.notes}></list-comp>
    `;
  }

  _onNotesChanged(event) {
    const notes = read();
    this.notes = JSON.stringify(notes);
  }
}
