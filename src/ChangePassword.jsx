import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ChangePassword() {
  const [ancienMotDePasse, setAncienMotDePasse] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!ancienMotDePasse || !nouveauMotDePasse || !confirmation) {
      setMessage('❌ Tous les champs doivent être remplis');
      return;
    }

    if (nouveauMotDePasse !== confirmation) {
      setMessage('❌ Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        'http://localhost:3000/change-password',
        {
          ancien_mot_de_passe: ancienMotDePasse,
          nouveau_mot_de_passe: nouveauMotDePasse,
          confirmation,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage('✅ Mot de passe mis à jour avec succès !');
      setAncienMotDePasse('');
      setNouveauMotDePasse('');
      setConfirmation('');
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe :', error);
      const errorMsg = error.response?.data?.error || 'Erreur lors du changement de mot de passe';
      setMessage(`❌ ${errorMsg}`);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg mx-auto max-w-xl">
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Changer le mot de passe</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ancienMotDePasse" className="block text-sm font-medium text-gray-700">
            Ancien mot de passe *
          </label>
          <input
            id="ancienMotDePasse"
            type="password"
            placeholder="Ancien mot de passe"
            value={ancienMotDePasse}
            onChange={(e) => setAncienMotDePasse(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="nouveauMotDePasse" className="block text-sm font-medium text-gray-700">
            Nouveau mot de passe *
          </label>
          <input
            id="nouveauMotDePasse"
            type="password"
            placeholder="Nouveau mot de passe"
            value={nouveauMotDePasse}
            onChange={(e) => setNouveauMotDePasse(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700">
            Confirmer le nouveau mot de passe *
          </label>
          <input
            id="confirmation"
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {message && (
          <p className={`${message.includes('✅') ? 'text-green-600' : 'text-red-500'} text-sm mt-4`}>
            {message}
          </p>
        )}

        {/* ✅ Boutons espacés avec gap */}
        <div className="flex justify-end gap-4 mt-6 flex-wrap">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Changer le mot de passe
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Retour
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
