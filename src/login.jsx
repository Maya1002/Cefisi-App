import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess, setMode }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mot_de_passe, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!email || !mot_de_passe) {
      setMessage('❌ Email et mot de passe sont requis');
      return;
    }

    if (!validateEmail(email)) {
      setMessage('❌ Email invalide');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        mot_de_passe,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('hasCandidature', response.data.hasCandidature.toString());
      onLoginSuccess(response.data.role, response.data.hasCandidature);
      setEmail('');
      setMotDePasse('');
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      const errorMsg = error.response?.data?.error || 'Erreur lors de la connexion';
      setMessage(`❌ ${errorMsg}`);
    }
  };

  const handleRetourAccueil = () => {
    navigate('/');
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg mx-auto" style={{ maxWidth: '600px' }}>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8 tracking-tight">
          Bienvenue
        </h2>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="mot_de_passe" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="mot_de_passe"
              type="password"
              placeholder="••••••••"
              value={mot_de_passe}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200"
            />
          </div>
          {message && (
            <p className="text-red-500 text-sm text-center animate-fade-in">{message}</p>
          )}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-base font-semibold transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Se connecter
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-6 flex justify-between text-sm">
          <button
            onClick={handleRetourAccueil}
            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
          >
            Retour à l'accueil
          </button>
          <button
            onClick={() => setMode('inscription')}
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
          >
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;