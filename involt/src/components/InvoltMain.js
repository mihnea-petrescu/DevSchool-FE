import { LitElement, html, css } from 'lit-element';
import { read } from '../storage';

import './InvoltSignIn';
import './InvoltSignUp';
import './InvoltAccount';

export class InvoltMain extends LitElement {
  static get properties() {
    return {
      page: { type: String },
    };
  }

  static get styles() {
    return css``;
  }

  constructor() {
    super();
    this.page = window.location.hash.substring(1);
    window.onhashchange = this._onHashChange.bind(this);
  }

  render() {
    return html` <div class="container" id="container">
      <div class="logo-container">
        <img src="media/logo.svg" width="328px" height="74px" />
      </div>

      ${this._pageTemplate}
    </div>`;
  }

  get _pageTemplate() {
    const user = read('user');

    if (JSON.stringify(user) !== '{}') {
      window.location.hash = 'account';
      return html`<involt-account @logout=${this._onLogout}></involt-account>`;
    }

    if (this.page === 'signup') {
      return html`<involt-sign-up @signup=${this._onSignup}></involt-sign-up>`;
    }

    if (!this.page || JSON.stringify(user) === '{}') {
      window.location.hash = '';
      return html`<involt-sign-in @login=${this._onLogin}></involt-sign-in>`;
    }
  }

  _onHashChange(event) {
    const hash = new URL(event.newURL).hash;
    this.page = hash.substring(1);
  }

  _onLogin(event) {
    window.location.hash = 'account';
  }

  _onSignup(event) {
    console.log(event.target);
    window.location.hash = '';
    alert('Signup Successful');
  }

  _onLogout(event) {
    window.location.hash = '';
  }
}
