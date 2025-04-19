import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = "https://be-tu6-700231807331.us-central1.run.app"; // URL Backend di Cloud Run

function App() {
    const [notes, setNotes] = useState([]);
    const [judul, setJudul] = useState('');
    const [catatan, setCatatan] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await fetch(`${API_URL}/users`);
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    const addNote = async () => {
        try {
            await fetch(`${API_URL}/add-users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Judul: judul, Catatan: catatan })
            });
            setJudul('');
            setCatatan('');
            fetchNotes();
        } catch (error) {
            console.error("Error adding note:", error);
        }
    };

    const handleEdit = (note) => {
        setEditId(note.id);
        setJudul(note.Judul);
        setCatatan(note.Catatan);
    };

    const updateNote = async () => {
        try {
            await fetch(`${API_URL}/edit-users/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Judul: judul, Catatan: catatan })
            });
            setJudul('');
            setCatatan('');
            setEditId(null);
            fetchNotes();
        } catch (error) {
            console.error("Error updating note:", error);
        }
    };

    const deleteNote = async (id) => {
        try {
            await fetch(`${API_URL}/delete-users/${id}`, {
                method: 'DELETE'
            });
            fetchNotes();
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    return (
        <div className="container">
            <h1>📒 Notes Mahasiswa</h1>

            <form onSubmit={(e) => {
                e.preventDefault();
                editId ? updateNote() : addNote();
            }}>
                <input
                    type="text"
                    placeholder="Judul Catatan"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Isi Catatan"
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    required
                />
                <button type="submit" className={editId ? "update" : "add"}>
                    {editId ? "Update Catatan" : "Tambah Catatan"}
                </button>
                {editId && (
                    <button type="button" className="cancel" onClick={() => {
                        setEditId(null);
                        setJudul('');
                        setCatatan('');
                    }}>
                        Batal Edit
                    </button>
                )}
            </form>

            <ul>
                {notes.map((note) => (
                    <li key={note.id}>
                        <div className="note-content">
                            <div className="note-title">{note.Judul}</div>
                            <div className="note-body">{note.Catatan}</div>
                        </div>
                        <div className="action-buttons">
                            <button className="edit" onClick={() => handleEdit(note)}>Edit</button>
                            <button className="delete" onClick={() => deleteNote(note.id)}>Hapus</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
