import { LitElement, html, css } from 'lit-element';
import { append } from './storage.js';

class AddComp extends LitElement {
  static get properties() {
    return {
      description: { type: String },
    };
  }

  constructor() {
    super();
    this.description =
      "List of already existing notes' titles. Click on title to show TODO note text.";
  }

  render() {
    return html`
      <label>${this.description}</label>
      <form @submit=${this._onSubmit}>
        <label>
          Choose a title and a content for your note:
          <input type="text" name="title" placeholder="Note title" required />

          <textarea
            name="content"
            maxlength="1000"
            minlength="1"
            cols="40"
            rows="5"
            placeholder="Note content"
            required
          ></textarea>
        </label>

        <button type="submit">Add TODO note</button>
      </form>
    `;
  }

  _onSubmit(event) {
    event.preventDefault();
    console.log(event.target);
    const form = event.target;
    const data = new FormData(form);
    const note = Object.fromEntries(data);
    append(note);

    this.dispatchEvent(new CustomEvent('notes-changed'));
  }
}

window.customElements.define('add-comp', AddComp);
