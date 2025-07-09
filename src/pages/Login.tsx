import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { Navbar } from '../components/Navbar';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="spotify-container">
        <h2 style={{ textAlign: 'center' }}>Iniciar sesión</h2>
        <LoginForm onLogin={() => navigate('/')} />
      </div>
    </div>
  );
};