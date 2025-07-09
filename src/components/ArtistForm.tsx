/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { createArtist, updateArtist, getArtistsByGenre, deleteArtist } from '../repositories/artists';
import { getGenres } from '../repositories/genres';
import { useAuth } from '../hooks/useAuth';
import type { Artist } from '../models/artist';
import type { Genre } from '../models/genre';

export const ArtistForm: React.FC = () => {
  const { user } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [name, setName] = useState('');
  const [genreId, setGenreId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedGenres = await getGenres();
        setGenres(fetchedGenres);
        if (fetchedGenres.length > 0) {
          const firstGenreId = fetchedGenres[0].id;
          setGenreId(firstGenreId);
          const fetchedArtists = await getArtistsByGenre(firstGenreId);
          setArtists(fetchedArtists);
        }
      } catch (err) {
        setError('Error al cargar datos');
      }
    };
    fetchData();
  }, []);

  const handleGenreChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenreId = e.target.value;
    setGenreId(selectedGenreId);
    try {
      const fetchedArtists = await getArtistsByGenre(selectedGenreId);
      setArtists(fetchedArtists);
    } catch (err) {
      setError('Error al cargar artistas');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.uid || !image) return;
    try {
      if (editingArtist) {
        await updateArtist(user.uid, editingArtist.id, name, genreId, image);
      } else {
        const newArtist = await createArtist(user.uid, name, genreId, image);
        setArtists(prev => [...prev, newArtist]);
      }
      setName('');
      setEditingArtist(null);
      setImage(null);
      // Opcional: Recargar artistas para el género actual
      const fetchedArtists = await getArtistsByGenre(genreId);
      setArtists(fetchedArtists);
    } catch (err) {
      setError('Error al guardar artista');
    }
  };

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setName(artist.name);
    setGenreId(artist.genreId);
  };

  const handleDelete = async (artistId: string) => {
    if (!user || !user.uid) return;
    try {
      await deleteArtist(user.uid, artistId);
      setArtists(artists.filter(artist => artist.id !== artistId));
    } catch (err) {
      setError('Error al eliminar artista');
    }
  };

  return (
    <div className="mb-5">
      <h3>{editingArtist ? 'Editar Artista' : 'Agregar Artista'}</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: The Beatles"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Género</Form.Label>
          <Form.Select value={genreId} onChange={handleGenreChange} required>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Imagen</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setImage((e.target as HTMLInputElement).files?.[0] || null)}
            required={!editingArtist}
          />
        </Form.Group>
        <Button className="btn-spotify" type="submit">
          {editingArtist ? 'Actualizar Artista' : 'Agregar Artista'}
        </Button>
        {editingArtist && (
          <Button variant="outline-light" className="ms-2" onClick={() => { setEditingArtist(null); setName(''); }}>
            Cancelar
          </Button>
        )}
      </Form>
      <h4 className="mt-5">Artistas existentes</h4>
      <ul className="admin-list">
        {artists.map(artist => (
          <li key={artist.id}>
            <div className="d-flex align-items-center">
              <img src={artist.imageUrl} alt={artist.name} width="50" height="50" className="me-3"/>
              <strong>{artist.name}</strong>
            </div>
            <div>
              <Button variant="link" onClick={() => handleEdit(artist)}>Editar</Button>
              <Button variant="link" className="text-danger" onClick={() => handleDelete(artist.id)}>Eliminar</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};