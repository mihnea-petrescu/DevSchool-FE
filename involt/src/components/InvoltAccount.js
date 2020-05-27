import { LitElement, html, css } from 'lit-element';
import { read, write, clear } from '../storage';

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
        padding-bottom: 0.5rem;
        display: inline-block;
      }

      .email,
      .password {
        display: block;
        margin-bottom: 1rem;
      }

      .transaction {
        padding: 0.8rem;
        border-radius: 2rem;
        display: inline-block;
        color: white;
      }

      .FROM {
        background-color: #ff6200;
      }

      .TO {
        background-color: #0b84f6;
      }

      .account {
        font-weight: 700;
      }

      ul,
      li {
        list-style-type: none;
      }

      .one-transaction {
        display: inline-block;
      }

      .grid-container {
        display: grid;
        grid-template-columns: auto auto auto;
        grid-gap: 3rem;
        margin-left: 1rem;
      }

      .logo-container {
        grid-column: 1 / 3;
        grid-row: 1;
        border: 1px solid rgba(0, 0, 0, 0.8);
      }

      .change-data {
        grid-column: 1;
        grid-row: 2;
        border: 1px solid rgba(0, 0, 0, 0.8);
      }

      .add-account {
        grid-column: 1;
        grid-row: 3;
        border: 1px solid rgba(0, 0, 0, 0.8);
      }

      .make-transaction {
        grid-column: 1;
        grid-row: 4;
        border: 1px solid rgba(0, 0, 0, 0.8);
      }

      .transaction-history {
        grid-column: 2;
        grid-row: 2 / 5;
        border: 1px solid rgba(0, 0, 0, 0.8);
      }

      .logout {
        grid-column: 1 / 3;
        grid-row: 5;
        border: 1px solid rgba(0, 0, 0, 0.8);
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

    const changeData = html` <p class="intro">
        <strong>About: ${this.clientData.firstName} ${this.clientData.lastName} </strong>
      </p>

      <form class="email">
        <input type="email" size="30" value=${this.clientData.email} disabled />
        <button @click=${this._onEditEmail}>Change Email</button>
        <button @click=${this._onSaveEmail} hidden>Save</button>
        <button @click=${this._onCancelEmail} hidden>Cancel</button>
      </form>

      <form class="password">
        <input type="password" name="oldPassword" placeholder="Old Password" hidden />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          title="Password should be at leat 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character (!@#$%^&*_=+-)"
          hidden
        />
        <button @click=${this._onChangePassword}>Change Password</button>
        <button @click=${this._onSaveNewPassword} hidden>Save</button>
        <button @click=${this._onCancelPassword} hidden>Cancel</button>
      </form>`;

    const addAccount = html` <form @submit=${this._onCreateAccount}>
      <h3>Add a new account</h3>
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

    const makeTransaction = html`<h3>Make a transaction</h3>
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

        <input min="1" max="10000" name="amount" type="number" placeholder="Amount" />
        <select name="currency">
          <option value="RON">RON</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="JPY">JPY</option>
          <option value="GBP">GBP</option>
        </select>
        <button type="submit">Transfer</button>
      </form>`;

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
                    <p class="account">
                      Number: ${account.accountNumber} Balance: ${account.balance} Currency:
                      ${account.currency}
                    </p>
                    <button @click=${this._onShow}>
                      Show
                    </button>
                    <ul hidden>
                      ${account.transactionHistory.map(
                        transaction =>
                          html`<li class="one-transaction">
                            <p class="transaction ${transaction.direction}">
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
            </ul>`;

    return html` <div class="grid-container">
      <div class="logo-container">
        <img src="media/logo.svg" width="328px" height="74px" />
      </div>

      <div class="change-data">
        ${changeData}
      </div>

      <div class="add-account">
        ${addAccount}
      </div>

      <div class="make-transaction">
        ${makeTransaction}
      </div>

      <div class="transaction-history">
        ${accountsDisplay}
      </div>

      <div class="logout"><button @click=${this._onLogout}>Logout</button></div>
    </div>`;
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

    let pattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$');

    if (!pattern.test(newPassword.value)) {
      alert(
        'Password not strong enough. Password should be at leat 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, and 1 number'
      );
      oldPassword.value = '';
      newPassword.value = '';
      return;
    }

    event.target.hidden = true;
    oldPassword.hidden = true;
    newPassword.hidden = true;
    edit.hidden = false;
    cancel.hidden = true;

    if (oldPassword.value !== newPassword.value) {
      console.log(oldPassword.value, newPassword.value);
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
