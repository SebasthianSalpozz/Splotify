import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Admin } from './pages/Admin';
import { Genre } from './pages/Genre';
import { Artist } from './pages/Artist';
import { createDefaultAdmin } from './repositories/auth';
import { useEffect, type JSX } from 'react';
import { useAuth } from './hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  useEffect(() => {
    createDefaultAdmin();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/genre/:genreId" element={<ProtectedRoute><Genre /></ProtectedRoute>} />
        <Route path="/artist/:artistId" element={<ProtectedRoute><Artist /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;