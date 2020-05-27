import { LitElement, html, css } from 'lit-element';
import { read, write, clear } from '../storage';
import { until } from 'lit-html/directives/until.js';

class InvoltAccount extends LitElement {
  static get properties() {
    return {
      clientData: { type: Object },
      displayableAccounts: { type: Object },
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

      input,
      select {
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

      p {
        font-family: 'Lato', sans-serif;
        font-weight: 400;
      }

      .intro {
        padding: 0.5rem;
        border: 0.1rem solid #ff6200;
        display: inline-block;
      }

      .email,
      .password {
        display: block;
        margin: 1rem;
      }
    `;
  }

  constructor() {
    super();
    this._onLoad();
  }

  render() {
    console.log(this.displayableAccounts);
    this.displayableAccounts.forEach(displayableAccount => {
      displayableAccount.transactionHistory.sort((a, b) => b.timestamp - a.timestamp);
    });

    const accountsDisplay =
      this.displayableAccounts.length === 0
        ? html` <p>
            You have no Involts&copy; registered to your client account. Create your first Involt
            right now!
          </p>`
        : html` <h2>Transaction History</h2>
            <ul>
              ${this.displayableAccounts.map(
                account =>
                  html`<li>
                    <p>
                      Number: ${account.accountNumber} Balance: ${account.balance} Currency:
                      ${account.currency}
                    </p>
                    <button @click=${this._onShow}>
                      Show
                    </button>
                    <ul hidden>
                      ${account.transactionHistory.map(
                        transaction =>
                          html`<li>
                            <p>
                              <strong>${transaction.direction}</strong> Name:
                              ${transaction.firstName} ${transaction.lastName} Account:
                              ${transaction.accountNumber} Amount: ${transaction.amount} Currency:
                              ${transaction.currency} Date:
                              ${new Date(transaction.timestamp).toLocaleString('RO')}
                            </p>
                          </li>`
                      )}
                    </ul>
                  </li>`
              )}
            </ul>

            <h3>Make a transaction</h3>
            <form @submit=${this._onMakeTransaction}>
              <label>From:</label>
              <select name="fromAccountNumber">
                ${this.displayableAccounts.map(
                  account =>
                    html`<option value=${account.accountNumber}>${account.accountNumber}</option>`
                )}
              </select>

              <label>To:</label>
              <input name="toAccountNumber" type="text" placeholder="Account Number" />

              <input name="amount" type="number" placeholder="Amount" />
              <select name="currency">
                <option value="RON">RON</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="JPY">JPY</option>
                <option value="GBP">GBP</option>
              </select>
              <button type="submit">Transfer</button>
            </form>`;

    const addAccount = html` <h3>Add a new account</h3>
      <form @submit=${this._onCreateAccount}>
        <input type="number" name="balance" placeholder="Initial deposit" />
        <select name="currency">
          <option value="RON">RON</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="JPY">JPY</option>
          <option value="GBP">GBP</option>
        </select>
        <button type="submit">Create Account</button>
      </form>`;

    return html` <p class="intro">
        <strong>Client: ${this.clientData.firstName} ${this.clientData.lastName} </strong>
      </p>

      <form class="email">
        <input type="email" value=${this.clientData.email} disabled />
        <button @click=${this._onEditEmail}>Change Email</button>
        <button @click=${this._onSaveEmail} hidden>Save</button>
        <button @click=${this._onCancelEmail} hidden>Cancel</button>
      </form>

      <form class="password">
        <input type="password" name="oldPassword" placeholder="Old Password" hidden />
        <input type="password" name="newPassword" placeholder="New Password" hidden />
        <button @click=${this._onChangePassword}>Change Password</button>
        <button @click=${this._onSaveNewPassword} hidden>Save</button>
        <button @click=${this._onCancelPassword} hidden>Cancel</button>
      </form>

      ${accountsDisplay} ${addAccount}

      <button @click=${this._onLogout}>Logout</button>`;
  }

  _onChangePassword(event) {
    event.preventDefault();
    const newPassword = event.target.previousElementSibling;
    const oldPassword = newPassword.previousElementSibling;
    const save = event.target.nextElementSibling;
    const cancel = save.nextElementSibling;

    event.target.hidden = true;
    oldPassword.hidden = false;
    newPassword.hidden = false;
    save.hidden = false;
    cancel.hidden = false;
  }

  async _onSaveNewPassword(event) {
    event.preventDefault();
    const edit = event.target.previousElementSibling;
    const cancel = event.target.nextElementSibling;
    const newPassword = edit.previousElementSibling;
    const oldPassword = newPassword.previousElementSibling;

    if (newPassword.value === '') {
      alert('Cannot have empty password');
      oldPassword.value = '';
      return;
    }

    event.target.hidden = true;
    oldPassword.hidden = true;
    newPassword.hidden = true;
    edit.hidden = false;
    cancel.hidden = true;

    if (oldPassword.value !== newPassword.value) {
      const response = await fetch(
        'http://localhost:8081/client/' +
          this.clientData.clientId +
          '/password?oldPassword=' +
          oldPassword.value +
          '&newPassword=' +
          newPassword.value,
        {
          method: 'PATCH',
        }
      );

      if (response.ok) {
        alert('Password changed successfully');
      } else {
        alert('Password could not be changed at the time');
      }
    }
  }

  _onCancelPassword(event) {
    event.preventDefault();
    const save = event.target.previousElementSibling;
    const edit = save.previousElementSibling;
    const newPassword = edit.previousElementSibling;
    const oldPassword = newPassword.previousElementSibling;

    event.target.hidden = true;
    oldPassword.hidden = true;
    newPassword.hidden = true;
    edit.hidden = false;
    save.hidden = true;
  }

  _onEditEmail(event) {
    event.preventDefault();
    const save = event.target.nextElementSibling;
    const cancel = save.nextElementSibling;
    const emailField = event.target.previousElementSibling;

    event.target.hidden = true;
    save.hidden = false;
    cancel.hidden = false;
    emailField.disabled = false;
  }

  async _onSaveEmail(event) {
    event.preventDefault();
    const edit = event.target.previousElementSibling;
    const cancel = event.target.nextElementSibling;
    const emailField = edit.previousElementSibling;
    const currentCredentials = read('user');

    if (emailField.value === '') {
      alert('Cannot have empty email');
      emailField.value = currentCredentials.email;
      return;
    }

    event.target.hidden = true;
    cancel.hidden = true;
    edit.hidden = false;
    emailField.disabled = true;

    if (currentCredentials.email !== emailField.value) {
      const response = await fetch(
        'http://localhost:8081/client/' +
          currentCredentials.id +
          '/email?newEmail=' +
          emailField.value,
        {
          method: 'PATCH',
        }
      );
      if (!response.ok) {
        emailField.value = currentCredentials.email;
      } else {
        currentCredentials.email = emailField.value;
        write('user', currentCredentials);
      }
    }
  }

  async _onCancelEmail(event) {
    event.preventDefault();
    const save = event.target.previousElementSibling;
    const edit = save.previousElementSibling;
    const emailField = edit.previousElementSibling;

    const email = read('user').email;
    emailField.value = email;

    event.target.hidden = true;
    save.hidden = true;
    edit.hidden = false;
    emailField.disabled = true;
  }

  _onShow(event) {
    const history = event.target.nextElementSibling;
    history.hidden = !history.hidden;
  }

  async _onMakeTransaction(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const body = Object.fromEntries(formData);
    const response = await fetch('http://localhost:8081/transaction/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      alert('Transaction Successful');
    } else {
      const responseBody = await response.text();
      alert('Transaction failed! ' + responseBody);
    }

    await this.requestUpdate();
  }

  _onLogout(event) {
    event.preventDefault();
    clear('user');
    this.dispatchEvent(new CustomEvent('logout'));
  }

  async _onLoad() {
    console.log('RELOADING');

    const userId = read('user').id;
    const response = await fetch('http://localhost:8081/client/' + userId);

    this.clientData = await response.json();

    this._onAnotherLoad();
  }

  async _onAnotherLoad() {
    let newAccounts = [];
    let i;
    let j;
    const accounts = this.clientData.accounts.sort((a, b) => a.accountId - b.accountId);
    for (i = 0; i < accounts.length; i++) {
      const transactionHistory = accounts[i].transactionHistory;
      let displayableTransactions = [];
      for (j = 0; j < transactionHistory.length; j++) {
        const otherAccountId =
          transactionHistory[j].fromAccountId === accounts[i].accountId
            ? transactionHistory[j].toAccountId
            : transactionHistory[j].fromAccountId;

        const response = await fetch('http://localhost:8081/account/' + otherAccountId);
        const otherAccount = await response.json();

        const clientResponse = await fetch('http://localhost:8081/client/' + otherAccount.clientId);
        const otherClient = await clientResponse.json();

        const displayableTransaction = {
          direction: transactionHistory[j].fromAccountId === accounts[i].accountId ? 'TO' : 'FROM',
          firstName: otherClient.firstName,
          lastName: otherClient.lastName,
          accountNumber: otherAccount.accountNumber,
          amount: transactionHistory[j].amount,
          currency: transactionHistory[j].currency,
          timestamp: transactionHistory[j].timestamp,
        };

        displayableTransactions.push(displayableTransaction);
      }
      newAccounts.push(displayableTransactions);
      accounts[i].transactionHistory = displayableTransactions;
    }
    this.displayableAccounts = accounts;
  }

  async _onCreateAccount(event) {
    event.preventDefault();
    console.log('anaaaa');
    const formData = new FormData(event.target);
    const body = Object.fromEntries(formData);

    console.log(formData, body);

    const response = await fetch(
      'http://localhost:8081/client/' + this.clientData.clientId + '/add',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    console.log(response);
    if (!response.ok) {
      alert('Account creation failed');
    } else {
      this._onLoad();
    }
  }
}

window.customElements.define('involt-account', InvoltAccount);
