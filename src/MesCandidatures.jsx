import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

function MesCandidatures({ onCandidatureChange }) {
  const [candidatures, setCandidatures] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('❌ Vous devez être connecté');
          return;
        }

        const response = await axios.get('http://localhost:3000/mes-candidatures', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCandidatures(response.data);
        if (response.data.length === 0) {
          setMessage('ℹ️ Aucune candidature trouvée.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération :', error);
        const errorMsg = error.response?.data?.error || 'Erreur lors de la récupération des candidatures';
        setMessage(`❌ ${errorMsg}`);
      }
    };

    fetchCandidatures();
  }, []);

  const deleteCandidature = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette candidature ?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/candidatures/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCandidatures((prev) => prev.filter((c) => c.id !== id));
      setMessage('✅ Candidature supprimée avec succès');
      localStorage.setItem('hasCandidature', 'false');
      onCandidatureChange(false);
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      const errorMsg = error.response?.data?.error || 'Erreur lors de la suppression de la candidature';
      setMessage(`❌ ${errorMsg}`);
    }
  };

  const getStatutBadgeColor = (statut) => {
    switch (statut) {
      case 'en attente':
        return 'bg-yellow-200 text-yellow-900';
      case 'acceptée':
        return 'bg-green-200 text-green-900';
      case 'refusée':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-200 text-gray-900';
    }
  };

  return (
    <div className="p-15">
      <h2 className="text-4xl font-bold text-center text-indigo-700 mb-20 flex items-center justify-center gap-3">
        <span>📋</span> Ma Candidature
      </h2>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
          message.includes('✅')
            ? 'bg-green-100 text-green-800'
            : message.includes('ℹ️')
            ? 'bg-blue-100 text-blue-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      {candidatures.length === 0 && !message ? (
        <p className="text-gray-500 text-center">Chargement des candidatures...</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-indigo-50 text-indigo-800 text-left">
              <tr>
                <th className="p-3 font-semibold">Formation</th>
                <th className="p-3 font-semibold">Statut</th>
                <th className="p-3 font-semibold">Téléphone</th>
                <th className="p-3 font-semibold">Date Naissance</th>
                <th className="p-3 font-semibold">Statut pro</th>
                <th className="p-3 font-semibold">Motivation</th>
                <th className="p-3 font-semibold">CV</th>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Refus</th>
                <th className="p-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidatures.map((candidature) => (
                <tr key={candidature.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{candidature.formation}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutBadgeColor(candidature.statut)}`}>
                      {candidature.statut}
                    </span>
                  </td>
                  <td className="p-3">{candidature.telephone}</td>
                  <td className="p-3">{new Date(candidature.date_naissance).toLocaleDateString()}</td>
                  <td className="p-3">{candidature.statut_professionnel}</td>
                  <td className="p-3">{candidature.motivation || '—'}</td>
                  <td className="p-3">
                    {candidature.cv_url ? (
                      <a
                        href={`http://localhost:3000${candidature.cv_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 underline"
                      >
                        Télécharger
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-3">{new Date(candidature.date_creation).toLocaleString()}</td>
                  <td className="p-3">
                    {candidature.statut === 'refusée' && candidature.motif_refus ? candidature.motif_refus : '—'}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteCandidature(candidature.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MesCandidatures;
