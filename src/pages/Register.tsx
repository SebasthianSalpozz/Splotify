import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { Navbar } from '../components/Navbar';

export const Register: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="spotify-container">
        <h2>Registrarse</h2>
        <RegisterForm onRegister={() => navigate('/')} />
      </div>
    </div>
  );
};