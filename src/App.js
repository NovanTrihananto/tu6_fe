import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [notes, setNotes] = useState([]);
    const [judul, setJudul] = useState('');
    const [catatan, setCatatan] = useState('');
    const [editId, setEditId] = useState(null); // Buat tau lagi edit yang mana

    // Fetch data saat pertama kali load
    useEffect(() => {
        fetchNotes();
    }, []);
    
    // Ambil semua notes dari backend
    const fetchNotes = async () => {
        const response = await fetch('http://localhost:5000/users');
        const data = await response.json();
        setNotes(data);
    };

    // Tambah catatan baru
    const addNote = async () => {
        await fetch('http://localhost:5000/add-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Judul: judul, Catatan: catatan })
        });
        setJudul('');
        setCatatan('');
        fetchNotes();
    };

    // Ambil data yang mau diedit ke form
    const handleEdit = (note) => {
        setEditId(note.id);
        setJudul(note.Judul);
        setCatatan(note.Catatan);
    };

    // Update catatan
    const updateNote = async () => {
        await fetch(`http://localhost:5000/edit-users/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Judul: judul, Catatan: catatan })
        });
        setJudul('');
        setCatatan('');
        setEditId(null);
        fetchNotes();
    };

    // Hapus catatan
    const deleteNote = async (id) => {
        await fetch(`http://localhost:5000/delete-users/${id}`, {
            method: 'DELETE'
        });
        fetchNotes();
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
