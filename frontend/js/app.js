const apiUrl = 'http://127.0.0.1:8000'; // Adjust if your backend URL is different

document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    
    document.getElementById('add-note').addEventListener('click', async () => {
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        
        await createNote({
            title,
            content
        });
        resetForm();
        loadNotes();
    });
    
    document.getElementById('update-note').addEventListener('click', async () => {
        const id = document.getElementById('note-id').value;
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        
        await updateNote({
            id,
            title,
            content
        });
        resetForm();
        loadNotes();
    });
});

async function loadNotes() {
    try {
        const response = await fetch(`${apiUrl}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const notes = await response.json();
        const notesList = document.getElementById('note-list');
        notesList.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <small>Created at: ${new Date(note.created_at).toLocaleString()}</small>
                <small>Updated at: ${new Date(note.updated_at).toLocaleString()}</small>
                <button onclick="editNote('${note.id}', '${note.title}', '${note.content}')">Edit</button>
                <button onclick="deleteNote('${note.id}')">Delete</button>
            `;
            notesList.appendChild(noteElement);
        });
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

async function createNote(note) {
    try {
        const response = await fetch(`${apiUrl}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Note created:', data);
        return data;
    } catch (error) {
        console.error('Error creating note:', error);
    }
}

async function updateNote(note) {
    try {
        const response = await fetch(`${apiUrl}/${note.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Note updated:', data);
        return data;
    } catch (error) {
        console.error('Error updating note:', error);
    }
}

async function deleteNote(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        loadNotes();
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

function editNote(id, title, content) {
    document.getElementById('note-id').value = id;
    document.getElementById('note-title').value = title;
    document.getElementById('note-content').value = content;
    document.getElementById('add-note').style.display = 'none';
    document.getElementById('update-note').style.display = 'block';
}

function resetForm() {
    document.getElementById('note-id').value = '';
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    document.getElementById('add-note').style.display = 'block';
    document.getElementById('update-note').style.display = 'none';
}
