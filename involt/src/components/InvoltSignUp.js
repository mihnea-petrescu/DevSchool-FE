import { LitElement, html, css } from 'lit-element';

class InvoltSignUp extends LitElement {
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

      .form-container {
        display: table;
        width: 100%;
      }
      .sign-up-form {
        display: table-cell;
        text-align: center;
        vertical-align: middle;
      }

      .logo-container {
        text-align: center;
        display: block;
        margin-bottom: 1rem;
        margin-top: 2rem;
      }
    `;
  }

  render() {
    return html` <div class="logo-container">
        <img src="media/logo.svg" width="320px" height="60px" />
      </div>

      <div class="form-container">
        <form class="sign-up-form" @submit=${this._onSubmit}>
          <p>
            <input size="35" name="firstName" type="text" placeholder="First Name" required />
          </p>

          <p>
            <input size="35" name="lastName" type="text" placeholder="Last Name" required />
          </p>

          <p>  
          <input size="35" name="email" type="email" placeholder="Email" required />
          </p>

          <p>
          <input
              size="35"
              name="password"
              type="password"
              placeholder="Password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$"
              title="Password should be at leat 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter and 1 number"
            />
          </p>
            <button id="sign-up" type="submit">Sign Up</button>
            <a href="#">Already registered? <strong>Sign in</strong></a>
          </p>
        </form>
      </div>`;
  }

  async _onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    /* TODO: Validate mail and password, send request to backend; add user to DB */

    const body = Object.fromEntries(data);
    const response = await fetch('http://localhost:8081/client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const responseBody = await response.json();
    console.log(responseBody);
    console.log(response);

    if (!response.ok) {
      alert('Could not sign up ' + response.status);
    } else {
      this.dispatchEvent(new CustomEvent('signup'));
    }
  }
}

window.customElements.define('involt-sign-up', InvoltSignUp);
