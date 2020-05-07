import { LitElement, html, css } from 'lit-element';

class AppHeader extends LitElement {
  static get styles() {
    return css`
      header {
        background: dodgerblue;
        color: white;
        padding: 2rem;
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
    };
  }

  render() {
    return html`
      <header>
        <h1>${this.title}</h1>
      </header>
    `;
  }
}

window.customElements.define('app-header', AppHeader);
