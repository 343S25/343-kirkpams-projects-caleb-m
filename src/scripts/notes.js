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

// Export notes as JSON
document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "notes.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Import notes from JSON
document.getElementById("importBtn").addEventListener("click", () => {
  document.getElementById("importInput").click();
});

document.getElementById("importInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedNotes = JSON.parse(e.target.result);
      if (Array.isArray(importedNotes)) {
        notes = importedNotes;
        saveNotes();
        renderNotes();
        alert("Notes imported successfully.");
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Error reading file: " + err.message);
    }
  };
  reader.readAsText(file);
});

document.getElementById("clearBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all notes?")) {
    notes = [];
    saveNotes();
    renderNotes();
  }
});

