import { append, remove, read } from './storage.js';

export function init() {
  document.getElementById('form-add').addEventListener('submit', onSubmitAdd);
  document.getElementById('form-delete').addEventListener('submit', onSubmitDelete);
  document.getElementById('list').addEventListener('change', onCheckboxClick);
  render();
}

function onSubmitAdd(event) {
  event.preventDefault();
  const fd = new FormData(event.target);
  const contact = Object.fromEntries(fd);
  append(contact);
  render();
}

function onSubmitDelete(event) {
  event.preventDefault();

  const elements = event.target.querySelector('#list').children;
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].children[0].checked === true) {
      event.target.querySelector('#list').removeChild(elements[i]);
      remove(i);
    }
  }
  render();
}

function onCheckboxClick(event) {
  event.preventDefault();

  const checkboxes = Array.from(event.target.parentElement.parentElement.children);
  const checked = checkboxes.filter(li => li.children[0].checked === true);

  const deleteButton = document.getElementById('delete-button');

  deleteButton.hidden = checked.length === 0;
}

function render() {
  const contacts = read();
  const list = document.getElementById('list');
  const items = contacts.map(
    contact =>
      `<li>
            <input type="checkbox" name="delete"/>${contact.name} &lt;${contact.email}&gt; (${contact.phone})
        </li>`
  );
  list.innerHTML = items.join('');
  const formDelete = document.getElementById('form-delete');

  formDelete.hidden = contacts.length === 0;
}
