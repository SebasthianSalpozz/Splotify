// src/components/Navbar.tsx
import { Navbar as BSNavbar, Nav, Button } from 'react-bootstrap';
import { useNavigate, NavLink } from 'react-router-dom';
import { logout } from '../repositories/auth';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <BSNavbar className="navbar-spotify" expand="lg" variant="dark">
      <BSNavbar.Brand as={NavLink} to="/">Splotify</BSNavbar.Brand>
      <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BSNavbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/">Inicio</Nav.Link>
          {user?.role === 'admin' && <Nav.Link as={NavLink} to="/admin">Admin</Nav.Link>}
        </Nav>
        <Nav className="align-items-center">
          {user ? (
            <>
              <Nav.Link disabled className="text-white me-3">Hola, {user.displayName}</Nav.Link>
              <Button className="btn-spotify" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Nav.Link as={NavLink} to="/login">Iniciar sesión</Nav.Link>
              <Button as="a" href="/register" className="btn-spotify ms-2">
                Registrarse
              </Button>
            </>
          )}
        </Nav>
      </BSNavbar.Collapse>
    </BSNavbar>
  );
};