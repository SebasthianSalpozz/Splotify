// src/components/ArtistCard.tsx
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { Artist } from '../models/artist';

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="spotify-card artist-card text-white"
      onClick={() => navigate(`/artist/${artist.id}`)}
    >
      <Card.Img variant="top" src={artist.imageUrl} alt={artist.name} />
      <Card.Body className="text-center p-0 pt-3">
        <Card.Title>{artist.name}</Card.Title>
        <Card.Text>Artista</Card.Text>
      </Card.Body>
    </Card>
  );
};