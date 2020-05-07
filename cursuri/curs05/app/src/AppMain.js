import { LitElement, html } from 'lit-element';
import './AppHeader';
import './AppContent';
import './AppFooter';

export class AppMain extends LitElement {
  static get properties() {
    return {
      year: { type: Number },
      title: { type: String },
    };
  }
  render() {
    return html`
      <app-header title=${this.title}></app-header>
      <app-content
        @year-changed=${this._onYearChanged}
        @title-changed=${this._onTitleChanged}
      ></app-content>
      <app-footer year=${this.year}></app-footer>
    `;
  }

  _onYearChanged(event) {
    console.log(event.detail);
    this.year = event.detail.year === '' ? this.year : event.detail.year;
  }

  _onTitleChanged(event) {
    this.title = event.detail.title === '' ? this.title : event.detail.title;
  }
}
