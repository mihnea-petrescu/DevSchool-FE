import { LitElement, html, css } from 'lit-element';
import { write, clear } from '../storage';

class InvoltSignIn extends LitElement {
  static get properties() {
    return {
      title: { type: String },
    };
  }

  static get styles() {
    return css`
      button {
        border-radius: 1rem;
        border: 0;
        padding: 0.5rem 1rem;
        background-color: #ff6200;
        color: white;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        text-transform: uppercase;
      }

      button:hover {
        box-shadow: 0 0 0.3rem #ff6233;
        background-color: #ff6233;
      }

      button:active {
        transform: scale(0.95);
        background-color: #009dff;
      }

      button:focus {
        outline: none;
      }

      a {
        color: #0b84f6;
        font-family: 'Roboto', sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
      }

      a:link {
        text-decoration: none;
      }

      a:visited {
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      a:active {
        text-decoration: none;
        background-color: #009dff;
      }

      input {
        background-color: #eee;
        border: none;
        padding: 0.5rem 1rem;
      }

      input:link {
        outline-color: #dddddd;
        outline-width: 2rem;
      }

      input:active {
        outline-color: #0b84f6;
      }

      input:focus {
        outline-color: #0b84f6;
        outline-width: thick;
      }
    `;
  }

  render() {
    return html` <div class="form-container">
      <form class="sign-in-form" @submit=${this._onSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button id="sign-in" type="submit">Sign In</button>
        <a href="#signup">New to Involt? Register now</a>
      </form>
    </div>`;
  }

  async _onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const body = Object.fromEntries(formData);
    const response = await fetch('http://localhost:8081/client/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(response);
    if (response.ok) {
      const responseBody = await response.json();

      formData.delete('password');
      formData.append('id', responseBody.clientId);
      const user = Object.fromEntries(formData);
      write('user', user);

      this.dispatchEvent(new CustomEvent('login'));
    } else {
      const responseBody = await response.text();
      alert(responseBody);
    }
  }
}

window.customElements.define('involt-sign-in', InvoltSignIn);
