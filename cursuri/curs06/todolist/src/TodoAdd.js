import { LitElement, html, css } from 'lit-element';
import { append } from './storage.js';

class TodoAdd extends LitElement {
  static get properties() {
    return {
      description: { type: String },
    };
  }

  static get styles() {
    return css`
      form {
        padding: 2rem;
      }

      input[type='text'] {
        border: 1rem;
        display: block;
        box-sizing: border-box;
        border: 2px solid #ccc;
        border-radius: 4px;
        background-color: #f8f8f8;
        width: 20%;
        padding: 0.5rem 0.5rem;
        margin-bottom: 1.5rem;
      }

      textarea {
        display: block;
        box-sizing: border-box;
        border: 2px solid #ccc;
        border-radius: 4px;
        background-color: #f8f8f8;
        width: 50%;
        padding: 0.5rem 0.5rem;
        margin-bottom: 0.5rem;
      }

      button {
        margin-bottom: 3rem;
      }
    `;
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
          Choose a title for your note
          <input type="text" name="title" placeholder="Note title" required />

          Write your note
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

        <select name="category">
          <option>Debug</option>
          <option>Info</option>
          <option>Warn</option>
          <option>Error</option>
          <option>Critical</option>
        </select>

        <button type="submit">Add TODO note</button>
      </form>
    `;
  }

  _onSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const note = Object.fromEntries(data);
    console.log(note);
    append(note);

    this.dispatchEvent(new CustomEvent('notes-changed'));
  }
}

window.customElements.define('todo-add', TodoAdd);
