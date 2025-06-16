import { useState } from 'react';
import axios from 'axios';

function CreateAdmin({ setMode }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!nom || !prenom || !email || !motDePasse) {
      setMessage('❌ Tous les champs doivent être remplis');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/admin/create-admin',
        { nom, prenom, email, mot_de_passe: motDePasse },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('✅ Compte administrateur créé avec succès !');
      setNom('');
      setPrenom('');
      setEmail('');
      setMotDePasse('');
    } catch (error) {
      console.error('Erreur lors de la création :', error);
      const errorMsg = error.response?.data?.error || 'Erreur lors de la création du compte';
      setMessage(`❌ ${errorMsg}`);
    }
  };

  const handleReturnToDashboard = () => {
    console.log('Clic sur Retour au tableau de bord, setMode appelé avec "login"');
    setMode('login');
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg mx-auto max-w-xl">
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Créer un nouveau compte administrateur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
            Nom *
          </label>
          <input
            id="nom"
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
            Prénom *
          </label>
          <input
            id="prenom"
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            id="email"
            type="email"
            placeholder="email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700">
            Mot de passe temporaire *
          </label>
          <input
            id="motDePasse"
            type="password"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        {message && (
          <p className={`${message.includes('✅') ? 'text-green-600' : 'text-red-500'} text-sm mt-4`}>
            {message}
          </p>
        )}
        <div className="flex gap-4 ml-6">
          <button
            type="submit"
            className="px-6 py-2  bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Créer le compte
          </button>
          <button
            type="button"
            onClick={handleReturnToDashboard}
            className="px-4 py-2  bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
            aria-label="Tableau de bord"
          >
            Retour au tableau de bord
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAdmin;