export function read(item) {
  const json = window.localStorage.getItem(item);
  return json === null ? {} : JSON.parse(json);
}

export function clear(item) {
  window.localStorage.removeItem(item);
}

export function write(item, notes) {
  const json = JSON.stringify(notes);
  window.localStorage.setItem(item, json);
}

export function append(item, note) {
  const notes = read(item);
  notes.push(note);
  write(item, notes);
}

export function replace(item, noteToReplace, newNote) {
  let notes = read(item);
  notes = notes.map(note => (note.title === noteToReplace.title ? newNote : note));
  write(item, notes);
}

export function remove(item, note) {
  const notes = read(item);
  const index = notes.findIndex(element => element.title === note);
  if (index !== -1) {
    notes.splice(index, 1);
    write(item, notes);
  }
}
