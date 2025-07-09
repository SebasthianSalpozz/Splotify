import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Navbar } from '../components/Navbar';
import { ArtistCard } from '../components/ArtistCard';
import { getArtistsByGenre } from '../repositories/artists';
import { getGenres } from '../repositories/genres';
import type { Artist } from '../models/artist';
import type { Genre as GenreType } from '../models/genre';

export const Genre: React.FC = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const navigate = useNavigate();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genre, setGenre] = useState<GenreType | null>(null); 

  useEffect(() => {
    const fetchData = async () => {
      if (!genreId) return;
      try {
        const fetchedArtists = await getArtistsByGenre(genreId);
        setArtists(fetchedArtists);
        const genres = await getGenres();
        const currentGenre = genres.find(g => g.id === genreId);
        setGenre(currentGenre || null);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };
    fetchData();
  }, [genreId]);

  if (!genre) return <div>Cargando...</div>;

  return (
    <div className="spotify-container">
      <Navbar />
      <Container className="py-5">
        <Button variant="link" className="text-white mb-3" onClick={() => navigate('/')}>
          ← Volver
        </Button>
        <h2 className="text-white mb-4">{genre.name}</h2>
        <Row>
          {artists.map(artist => (
            <Col key={artist.id} xs={6} md={4} lg={3} className="mb-4">
              <ArtistCard artist={artist} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};