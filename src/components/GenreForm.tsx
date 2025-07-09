/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { createGenre, updateGenre, getGenres, deleteGenre } from '../repositories/genres';
import { useAuth } from '../hooks/useAuth';
import type { Genre } from '../models/genre';

export const GenreForm: React.FC = () => {
  const { user } = useAuth();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await getGenres();
        setGenres(fetchedGenres);
      } catch (err) {
        setError('Error al cargar géneros');
      }
    };
    fetchGenres();
  }, [genres]); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.uid || !image) {
        if (!image) setError("La imagen es obligatoria");
        return;
    };
    try {
      if (editingGenre) {
        await updateGenre(user.uid, editingGenre.id, name, image);
      } else {
        const newGenre = await createGenre(user.uid, name, image);
        setGenres([...genres, newGenre]);
      }
      setName('');
      setImage(null);
      setEditingGenre(null);
      // Limpiar el input de archivo
      const fileInput = document.getElementById('genre-image-input') as HTMLInputElement;
      if(fileInput) fileInput.value = "";
    } catch (err) {
      setError('Error al guardar género');
    }
  };

  const handleEdit = (genre: Genre) => {
    setEditingGenre(genre);
    setName(genre.name);
  };

  const handleDelete = async (genreId: string) => {
    if (!user || !user.uid) return;
    try {
      await deleteGenre(user.uid, genreId);
      setGenres(genres.filter(genre => genre.id !== genreId));
    } catch (err) {
      setError('Error al eliminar género');
    }
  };

  return (
    <div className="mb-5">
      <h3>{editingGenre ? 'Editar Género' : 'Agregar Género'}</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Rock"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Imagen</Form.Label>
          <Form.Control
            id="genre-image-input"
            type="file"
            accept="image/*"
            onChange={(e) => setImage((e.target as HTMLInputElement).files?.[0] || null)}
            required={!editingGenre}
          />
        </Form.Group>
        
        <Button className="btn-spotify" type="submit">
          {editingGenre ? 'Actualizar Género' : 'Agregar Género'}
        </Button>
        {editingGenre && (
          <Button variant="outline-light" className="ms-2" onClick={() => { setEditingGenre(null); setName(''); }}>
            Cancelar
          </Button>
        )}
      </Form>

      <h4 className="mt-5">Géneros existentes</h4>
      <ul className="admin-list">
        {genres.map(genre => (
          <li key={genre.id}>
            {/* INICIO DE LA CORRECCIÓN */}
            <div className="d-flex align-items-center">
              <img src={genre.imageUrl} alt={genre.name} width="50" height="50" className="me-3"/>
              <strong>{genre.name}</strong>
            </div>
            {/* FIN DE LA CORRECCIÓN */}
            <div>
              <Button variant="link" onClick={() => handleEdit(genre)}>Editar</Button>
              <Button variant="link" className="text-danger" onClick={() => handleDelete(genre.id)}>Eliminar</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};