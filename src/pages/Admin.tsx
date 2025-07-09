import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Tabs, Tab } from 'react-bootstrap';
import { Navbar } from '../components/Navbar';
import { GenreForm } from '../components/GenreForm';
import { ArtistForm } from '../components/ArtistForm';
import { SongForm } from '../components/SongForm';
import { useAuth } from '../hooks/useAuth';

export const Admin: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="spotify-container">
      <Navbar />
      <Container className="mt-5">
        <h2>Panel de Administración</h2>
        <Tabs defaultActiveKey="genres" id="admin-tabs" className="mb-3">
          <Tab eventKey="genres" title="Géneros">
            <GenreForm />
          </Tab>
          <Tab eventKey="artists" title="Artistas">
            <ArtistForm />
          </Tab>
          <Tab eventKey="songs" title="Canciones">
            <SongForm />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};