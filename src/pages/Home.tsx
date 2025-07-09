import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Navbar } from '../components/Navbar';
import { GenreCard } from '../components/GenreCard';
import { getGenres } from '../repositories/genres';
import type { Genre } from '../models/genre';

export const Home: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await getGenres();
        setGenres(fetchedGenres);
      } catch (err) {
        console.error('Error al cargar géneros:', err);
      }
    };
    fetchGenres();
  }, []);

  return (
    <div className="spotify-container">
      <Navbar />
      <Container className="py-5">
        <h2 className="mb-4">Géneros</h2>
        <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
          {genres.map(genre => (
            <Col key={genre.id}>
              <GenreCard genre={genre} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};