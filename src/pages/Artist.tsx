import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { Navbar } from '../components/Navbar';
import { SongList } from '../components/SongList';
import { Player } from '../components/Player';
import { getSongsByArtist } from '../repositories/songs';
import { getArtistsByGenre } from '../repositories/artists';
import { getGenres } from '../repositories/genres';
import type { Song } from '../models/song';
import type { Artist  as ArtistType} from '../models/artist';

export const Artist: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();
  const [songs, setSongs] = useState<Song[]>([]);
  const [artist, setArtist] = useState<ArtistType | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!artistId) return;
      try {
        const fetchedSongs = await getSongsByArtist(artistId);
        setSongs(fetchedSongs);
        // Buscar el artista
        const allGenres = await getGenres();
        for (const genre of allGenres) {
          const artists = await getArtistsByGenre(genre.id);
          const foundArtist = artists.find(a => a.id === artistId);
          if (foundArtist) {
            setArtist(foundArtist);
            break;
          }
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };
    fetchData();
  }, [artistId]);

  if (!artist) return <div>Cargando...</div>;

  return (
    <div className="spotify-container">
      <Navbar />
      <Container className="py-5">
        <Button variant="link" className="text-white mb-3" onClick={() => navigate(`/genre/${artist.genreId}`)}>
          ← Volver
        </Button>
        <h2 className="text-white mb-4">{artist.name}</h2>
        <SongList songs={songs} onPlay={setCurrentSong} />
      </Container>
      <Player currentSong={currentSong} />
    </div>
  );
};