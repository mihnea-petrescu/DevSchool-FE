export function read() {
  const json = window.localStorage.getItem('ds-contacts');
  return json === null ? [] : JSON.parse(json);
}

export function write(contacts) {
  const json = JSON.stringify(contacts);
  window.localStorage.setItem('ds-contacts', json);
}

export function append(contact) {
  const contacts = read();
  contacts.push(contact);
  write(contacts);
}

export function remove(contact) {
  const contacts = read();
  const index = contacts.findIndex(element => element.id === contact.id);
  if (index !== -1) {
    contacts.splice(index, 1);
    write(contacts);
  }
}
