/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/RegisterForm.tsx
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { registerWithEmail, loginWithGoogle } from '../repositories/auth';

interface RegisterFormProps {
  onRegister: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerWithEmail(email, password, displayName);
      onRegister();
    } catch (err) {
      setError('Error al registrarse. Verifica tus datos.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onRegister();
    } catch (err) {
      setError('Error al registrarse con Google.');
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Form onSubmit={handleRegister} className="w-100" style={{maxWidth: '400px'}}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3" controlId="formDisplayName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa tu nombre"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <div className="d-grid gap-2">
            <Button className="btn-spotify" type="submit">
              Registrarse
            </Button>
            <Button className="btn-spotify-outline" onClick={handleGoogleLogin}>
              Registrarse con Google
            </Button>
        </div>
      </Form>
    </div>
  );
};