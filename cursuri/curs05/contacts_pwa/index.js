import { read, append, remove } from './storage.js';

export function init() {
  document.getElementById('form-add').addEventListener('submit', onSubmitAdd);
  document.getElementById('form-delete').addEventListener('submit', onSubmitDelete);
  document.getElementById('form-delete').addEventListener('change', onChangeDelete);
  navigator.serviceWorker.register('sw.js');
  render();
}

function onSubmitAdd(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  data.set('id', Date.now());
  const contact = Object.fromEntries(data);
  append(contact);
  render();
}

function onSubmitDelete(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const contacts = read();
  data.getAll('id').forEach(id => {
    const contact = contacts.find(contact => contact.id === id);
    if (contact) {
      remove(contact);
    }
  });
  form.reset();
  form.elements.delete.disabled = true;
  render();
}

function onChangeDelete(event) {
  const { form } = event.target;
  // const form = event.target.form;
  // const form = event.currentTarget;
  const data = new FormData(form);
  const hasChecked = data.getAll('id').length > 0;
  form.elements.delete.disabled = !hasChecked;
}

function render() {
  const contacts = read();
  const items = contacts.map(
    contact => `
      <li>
        <label>
          <input type="checkbox" name="id" value="${contact.id}">
          ${contact.name} &lt;${contact.email}&gt; [${contact.phone}]
        </label>
      </li>
    `
  );
  document.getElementById('list').innerHTML = items.join('');
  document.getElementById('form-delete').hidden = contacts.length === 0;
}
