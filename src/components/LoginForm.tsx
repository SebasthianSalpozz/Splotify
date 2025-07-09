/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { loginWithEmail, loginWithGoogle } from '../repositories/auth';

interface LoginFormProps {
  onLogin: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      onLogin();
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onLogin();
    } catch (err) {
      setError('Error al iniciar sesión con Google.');
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Form onSubmit={handleLogin} className="w-100" style={{maxWidth: '400px'}}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="d-grid gap-2">
            <Button className="btn-spotify" type="submit">
              Iniciar sesión
            </Button>
            <Button className="btn-spotify-outline" onClick={handleGoogleLogin}>
              Iniciar sesión con Google
            </Button>
        </div>
      </Form>
    </div>
  );
};