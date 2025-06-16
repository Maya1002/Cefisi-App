import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './login.jsx';
import Inscription from './inscription.jsx';
import CandidatureForm from './CandidatureForm.jsx';
import MesCandidatures from './MesCandidatures.jsx';
import AdminDashboard from './adminDashboard.jsx';
import CreateAdmin from './CreateAdmin.jsx';
import ChangePassword from './ChangePassword.jsx';

function App() {
  const navigate = useNavigate();
  const [estConnecte, setEstConnecte] = useState(!!localStorage.getItem('token'));
  const [mode, setMode] = useState('login');
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'candidat');
  const [hasCandidature, setHasCandidature] = useState(localStorage.getItem('hasCandidature') === 'true');
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef();

  useEffect(() => {
    console.log('Mode actuel :', mode, 'Rôle utilisateur :', userRole);
  }, [mode, userRole]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginSuccess = (role, hasCandidature) => {
    setEstConnecte(true);
    setUserRole(role);
    setHasCandidature(hasCandidature);
  };

  const handleCandidatureChange = (hasCandidature) => {
    setHasCandidature(hasCandidature);
    localStorage.setItem('hasCandidature', hasCandidature.toString());
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('hasCandidature');
    setEstConnecte(false);
    setMode('login');
    setUserRole('candidat');
    setHasCandidature(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center py-8">
      {estConnecte ? (
        <div className="max-w-9xl w-full p-8 bg-white rounded-xl shadow-2xl">
          <div className="flex justify-end mb-6 relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-200 transition"
            >
              ⚙️ Paramètres
            </button>

            {showSettings && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <ul className="py-2">
                  {userRole === 'admin' && (
                    <li>
                      <button
                        onClick={() => {
                          setMode('create-admin');
                          setShowSettings(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Créer un admin
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        setMode('change-password');
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Changer le mot de passe
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Déconnexion
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {userRole === 'candidat' && !hasCandidature && mode === 'login' && (
            <>
              <p className="text-gray-700 text-lg text-center mb-8 animate-fade-in">
                NOS FORMATIONS VOUS INTÉRESSENT ? On vous invite à saisir vos motivations et votre CV pour
                mieux nous guider dans le processus de sélection ! Le formulaire dédié aux candidatures de
                CEFISI est ci-dessous, veuillez le remplir avec précision !!
              </p>
              <CandidatureForm />
            </>
          )}
          {userRole === 'candidat' && hasCandidature && mode === 'login' && (
            <MesCandidatures onCandidatureChange={handleCandidatureChange} />
          )}
          {userRole === 'admin' && mode === 'login' && <AdminDashboard />}
          {userRole === 'admin' && mode === 'create-admin' && <CreateAdmin setMode={setMode} />}
          {mode === 'change-password' && <ChangePassword />}
        </div>
      ) : (
        <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-2xl">
          {mode === 'login' && (
            <div className="w-full">
              <Login onLoginSuccess={handleLoginSuccess} setMode={setMode} />
            </div>
          )}
          {mode === 'inscription' && (
            <div className="w-full">
              <Inscription />
              <p className="text-center text-gray-600 mt-4">
                Déjà un compte ?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                >
                  Se connecter
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;