import { LitElement, html } from 'lit-element';
import { read } from './storage.js';
import './TodoAdd';
import './TodoList';

export class TodoMain extends LitElement {
  static get properties() {
    return {
      notes: { type: String },
      location: { type: String },
    };
  }

  constructor() {
    super();
    this.notes = JSON.stringify(read());
    this.location = '';
  }

  render() {
    return html`
      <textarea readonly>${this.location}</textarea>
      <form>
        <button @click=${this._onClick}>Get location</button>
      </form>
      <todo-add @notes-changed=${this._onNotesChanged}></todo-add>
      <todo-list @notes-changed=${this._onNotesChanged} notes=${this.notes}></todo-list>
    `;
  }

  async fetchLocation(link) {
    const response = await fetch(link);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  }

  _onNotesChanged(event) {
    const notes = read();
    this.notes = JSON.stringify(notes);
  }

  _onClick(event) {
    event.preventDefault();
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const crd = pos.coords;
        const link =
          'https://nominatim.openstreetmap.org/reverse?format=json&lat=' +
          crd.latitude +
          '&lon=' +
          crd.longitude;

        const location = await this.fetchLocation(link);
        this.location = location.address.road + ' ' + location.address.house_number;
        console.log(location);
      },
      err => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      },
      options
    );
  }
}
