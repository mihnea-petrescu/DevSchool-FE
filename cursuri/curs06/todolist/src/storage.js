export function read() {
  const json = window.localStorage.getItem('ds-todo-list');
  return json === null ? [] : JSON.parse(json);
}

export function write(notes) {
  const json = JSON.stringify(notes);
  window.localStorage.setItem('ds-todo-list', json);
}

export function append(note) {
  const notes = read();
  notes.push(note);
  write(notes);
}

export function replace(noteToReplace, newNote) {
  let notes = read();
  notes = notes.map(note => (note.title === noteToReplace.title ? newNote : note));
  write(notes);
}

export function remove(note) {
  const notes = read();
  const index = notes.findIndex(element => element.title === note);
  if (index !== -1) {
    notes.splice(index, 1);
    write(notes);
  }
}
