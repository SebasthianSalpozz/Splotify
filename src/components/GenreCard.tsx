// src/components/GenreCard.tsx
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { Genre } from '../models/genre';

interface GenreCardProps {
  genre: Genre;
}

export const GenreCard: React.FC<GenreCardProps> = ({ genre }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="spotify-card text-white"
      onClick={() => navigate(`/genre/${genre.id}`)}
    >
      <Card.Img variant="top" src={genre.imageUrl} alt={genre.name} />
      <Card.Body className="p-0 pt-3">
        <Card.Title>{genre.name}</Card.Title>
      </Card.Body>
    </Card>
  );
};