import { read, append, remove, replace, write } from './storage.js';

export function init() {
  document.getElementById('form-add').addEventListener('submit', onSubmitAdd);
  document.getElementById('form-delete').addEventListener('submit', onSubmitDelete);
  document.getElementById('form-delete').addEventListener('change', onChangeDelete);
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
  render();
}

function onChangeDelete(event) {
  event.preventDefault();
  const { form } = event.target;
  // const form = event.target.form;
  const data = new FormData(form);
  const hasChecked = data.getAll('id').length > 0;
  form.elements.delete.disabled = !hasChecked;
}

function onClickEdit(event) {
  const editButton = event.target;
  const saveButton = editButton.nextElementSibling;
  const cancelButton = saveButton.nextElementSibling;

  editButton.hidden = true;
  saveButton.hidden = false;
  cancelButton.hidden = false;

  saveButton.addEventListener('click', onClickSave);
  cancelButton.addEventListener('click', onClickCancel);

  /* Enable all fields */
  const label = editButton.previousElementSibling;
  for (let i = 0; i < label.children.length; i++) {
    label.children[i].disabled = false;
  }
}

// TODO
function onClickSave(event) {
  const saveButton = event.target;
  const editButton = saveButton.previousElementSibling;
  const cancelButton = saveButton.nextElementSibling;

  editButton.hidden = false;
  saveButton.hidden = true;
  cancelButton.hidden = true;

  const contacts = read();

  const currentId = event.target.id.split('-')[1];
  const contactToReplace = contacts.find(contact => contact.id === currentId);

  const label = editButton.previousElementSibling;
  const data = new FormData();

  /* Create new contact */
  for (let i = 1; i < label.children.length; i++) {
    data.set(label.children[i].name, label.children[i].value);
  }
  data.set('id', Date.now());
  const newContact = Object.fromEntries(data);

  /* Replace contact */
  replace(contactToReplace, newContact);

  render();
}

function onClickCancel(event) {
  const cancelButton = event.target;
  const saveButton = cancelButton.previousElementSibling;
  const editButton = saveButton.previousElementSibling;

  editButton.hidden = false;
  saveButton.hidden = true;
  cancelButton.hidden = true;

  /* Disable all fields */
  const label = editButton.previousElementSibling;
  for (let i = 0; i < label.children.length; i++) {
    label.children[i].disabled = true;
  }

  render();
}

function render() {
  const contacts = read();
  const items = contacts.map(
    contact => `
      <li>
        <label>
          <input type="checkbox" name="id" value="${contact.id}">
          <input type="text" id="name-${contact.id}" name="name" value="${contact.name}" disabled> &lt;
          <input type="email" id="email-${contact.id}" name="email" value="${contact.email}" disabled> &gt; [
          <input type="tel" id="phone-${contact.id}" name="phone" value="${contact.phone}" disabled> ]
        </label>
          <button type="button" id="edit-${contact.id}">Edit</button>
          <button type="button" id="save-${contact.id}" hidden>Save</button>
          <button type="button" id="cancel-${contact.id}" hidden>Cancel</button>
      </li>
    `
  );

  document.getElementById('list').innerHTML = items.join('');

  /* Add event listeners for dynamically inserted elements */
  contacts.forEach(contact =>
    document.getElementById('edit-' + contact.id).addEventListener('click', onClickEdit)
  );

  document.getElementById('form-delete').hidden = contacts.length === 0;
}
