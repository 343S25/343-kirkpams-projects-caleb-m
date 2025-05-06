const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const notesList = document.getElementById("notesList");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes() {
  notesList.innerHTML = "";
  notes.forEach(note => {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `
      <p><strong>${note.timestamp}</strong></p>
      <p>${note.text}</p>
      <button onclick="editNote('${note.id}')">Edit</button>
      <button onclick="deleteNote('${note.id}')">Delete</button>
    `;
    notesList.appendChild(div);
  });
}

function addNote(text) {
  const note = {
    id: "note_" + Date.now(),
    text,
    timestamp: new Date().toLocaleString()
  };
  notes.push(note);
  saveNotes();
  renderNotes();
}

function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  saveNotes();
  renderNotes();
}

function editNote(id) {
  const note = notes.find(n => n.id === id);
  const newText = prompt("Edit your note:", note.text);
  if (newText !== null && newText.trim() !== "") {
    note.text = newText.trim();
    saveNotes();
    renderNotes();
  }
}

noteForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = noteInput.value.trim();
  if (text) {
    addNote(text);
    noteInput.value = "";
  }
});

renderNotes();
