/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { createSong, updateSong, getSongsByArtist, deleteSong } from '../repositories/songs';
import { getArtistsByGenre } from '../repositories/artists';
import { getGenres } from '../repositories/genres';
import type { Song } from '../models/song';
import type { Artist } from '../models/artist';
import type { Genre } from '../models/genre';
import { useAuth } from '../hooks/useAuth';

export const SongForm: React.FC = () => {
  const { user } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [name, setName] = useState('');
  const [artistId, setArtistId] = useState('');
  const [audio, setAudio] = useState<File | null>(null);
  const [genreId, setGenreId] = useState('');
  const [editingSong, setEditingSong] = useState<Song | null>(null);
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
          if (fetchedArtists.length > 0) {
            const firstArtistId = fetchedArtists[0].id;
            setArtistId(firstArtistId);
            const fetchedSongs = await getSongsByArtist(firstArtistId);
            setSongs(fetchedSongs);
          }
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
    setSongs([]); // Limpiar canciones al cambiar de género
    try {
      const fetchedArtists = await getArtistsByGenre(selectedGenreId);
      setArtists(fetchedArtists);
      if(fetchedArtists.length > 0) {
        const firstArtistId = fetchedArtists[0].id;
        setArtistId(firstArtistId);
        const fetchedSongs = await getSongsByArtist(firstArtistId);
        setSongs(fetchedSongs);
      } else {
        setArtistId('');
      }
    } catch (err) {
      setError('Error al cargar artistas');
    }
  };

  const handleArtistChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedArtistId = e.target.value;
    setArtistId(selectedArtistId);
    try {
      const fetchedSongs = await getSongsByArtist(selectedArtistId);
      setSongs(fetchedSongs);
    } catch (err) {
      setError('Error al cargar canciones');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.uid || !audio) return;
    try {
      if (editingSong) {
        await updateSong(user.uid, editingSong.id, name, artistId, audio);
      } else {
        const newSong = await createSong(user.uid, name, artistId, audio);
        setSongs(prev => [...prev, newSong]);
      }
      setName('');
      setEditingSong(null);
      setAudio(null);
      // Opcional: Recargar canciones para el artista actual
      const fetchedSongs = await getSongsByArtist(artistId);
      setSongs(fetchedSongs);
    } catch (err) {
      setError('Error al guardar canción');
    }
  };

  const handleEdit = (song: Song) => {
    setEditingSong(song);
    setName(song.name);
    // Nota: El género del artista de la canción podría ser diferente al seleccionado.
    // Para una UI perfecta, deberías buscar el género del artista y seleccionarlo.
    // Por ahora, mantenemos la simplicidad.
    setArtistId(song.artistId);
  };

  const handleDelete = async (songId: string) => {
    if (!user || !user.uid) return;
    try {
      await deleteSong(user.uid, songId);
      setSongs(songs.filter(song => song.id !== songId));
    } catch (err) {
      setError('Error al eliminar canción');
    }
  };

  return (
    <div className="mb-5">
      <h3>{editingSong ? 'Editar Canción' : 'Agregar Canción'}</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Género</Form.Label>
          <Form.Select value={genreId} onChange={handleGenreChange} required>
            <option value="" disabled>Selecciona un género</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Artista</Form.Label>
          <Form.Select value={artistId} onChange={handleArtistChange} required disabled={artists.length === 0}>
            <option value="" disabled>Selecciona un artista</option>
            {artists.map(artist => (
              <option key={artist.id} value={artist.id}>{artist.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Nombre de la Canción</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Imagine"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Archivo MP3</Form.Label>
          <Form.Control
            type="file"
            accept="audio/mp3"
            onChange={(e) => setAudio((e.target as HTMLInputElement).files?.[0] || null)}
            required={!editingSong}
          />
        </Form.Group>
        <Button className="btn-spotify" type="submit">
          {editingSong ? 'Actualizar Canción' : 'Agregar Canción'}
        </Button>
        {editingSong && (
          <Button variant="outline-light" className="ms-2" onClick={() => { setEditingSong(null); setName(''); }}>
            Cancelar
          </Button>
        )}
      </Form>
      
      <h4 className="mt-5">Canciones existentes</h4>
      <ul className="admin-list">
        {songs.map(song => (
          <li key={song.id}>
            <div className="d-flex align-items-center">
                <strong>{song.name}</strong>
                <audio src={song.audioUrl} controls className="ms-3" />
            </div>
            <div>
              <Button variant="link" onClick={() => handleEdit(song)}>Editar</Button>
              <Button variant="link" className="text-danger" onClick={() => handleDelete(song.id)}>Eliminar</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};