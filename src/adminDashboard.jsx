import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaChevronDown, FaChevronUp, FaComment, FaHistory, FaFilter } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

function AdminDashboard() {
  const [candidatures, setCandidatures] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ formation: '', statut: 'tous', noteOrder: '' });
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState({ isOpen: false, candidatureId: null, type: '', motifRefus: '' });
  const [newRemarque, setNewRemarque] = useState({});
  const candidaturesPerPage = 10;

  useEffect(() => {
    fetchCandidatures();
  }, [filters, currentPage]);

  const fetchCandidatures = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/admin/candidatures', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      let candidaturesData = response.data;
      
      // Tri côté client si noteOrder est défini
      if (filters.noteOrder) {
        candidaturesData = [...candidaturesData].sort((a, b) => {
          if (filters.noteOrder === 'asc') {
            return a.note - b.note;
          } else {
            return b.note - a.note;
          }
        });
      }
      
      setCandidatures(candidaturesData);
      setError('');
    } catch (err) {
      console.error('Erreur lors de la récupération des candidatures :', err);
      setError(err.response?.data?.error || 'Erreur lors de la récupération des candidatures');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, statut, motif_refus = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:3000/candidatures/${id}/status`,
        { statut, motif_refus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Statut mis à jour avec succès');
      fetchCandidatures();
      setModalData({ isOpen: false, candidatureId: null, type: '', motifRefus: '' });
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut :', err);
      toast.error(err.response?.data?.error || 'Erreur lors de la mise à jour du statut');
    }
  };

  const handleNoteChange = async (id, note) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:3000/candidatures/${id}/note`,
        { note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Note mise à jour avec succès');
      fetchCandidatures();
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la note :', err);
      toast.error(err.response?.data?.error || 'Erreur lors de la mise à jour de la note');
    }
  };

  const handleAddRemarque = async (candidatureId) => {
    if (!newRemarque[candidatureId]?.trim()) {
      toast.error('La remarque ne peut pas être vide');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/candidatures/${candidatureId}/remarques`,
        { contenu: newRemarque[candidatureId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Remarque ajoutée avec succès');
      setNewRemarque({ ...newRemarque, [candidatureId]: '' });
      fetchCandidatures();
      setModalData({ isOpen: false, candidatureId: null, type: '', motifRefus: '' });
    } catch (err) {
      console.error('Erreur lors de l’ajout de la remarque :', err);
      toast.error(err.response?.data?.error || 'Erreur lors de l’ajout de la remarque');
    }
  };

  const openModal = (candidatureId, type, motifRefus = '') => {
    setModalData({ isOpen: true, candidatureId, type, motifRefus });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, candidatureId: null, type: '', motifRefus: '' });
  };

  const resetFilters = () => {
    setFilters({ formation: '', statut: 'tous', noteOrder: '' });
    setCurrentPage(1);
  };

  const formations = [
    '',
    'Spécialiste en maîtrise d’ouvrage des SI',
    'Concepteur développeur informatique No-code',
    'Chef de projet de solutions Blockchain'
  ];
  const statuts = ['tous', 'en attente', 'en entretien', 'acceptée', 'refusée'];

  const indexOfLastCandidature = currentPage * candidaturesPerPage;
  const indexOfFirstCandidature = indexOfLastCandidature - candidaturesPerPage;
  const currentCandidatures = candidatures.slice(indexOfFirstCandidature, indexOfLastCandidature);
  const totalPages = Math.ceil(candidatures.length / candidaturesPerPage);

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'acceptée': return 'bg-green-100 text-green-800';
      case 'refusée': return 'bg-red-100 text-red-800';
      case 'en entretien': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6 bg-transparent min-h-screen">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Tableau de bord administrateur</h2>

      {/* Filtres rétractables */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <button
          className="flex items-center text-indigo-600 font-semibold mb-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className="mr-2" /> {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </button>
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Formation</label>
              <select
                value={filters.formation}
                onChange={(e) => setFilters({ ...filters, formation: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                {formations.map((f) => (
                  <option key={f} value={f}>{f || 'Toutes'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <select
                value={filters.statut}
                onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                {statuts.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ordre des notes</label>
              <select
                value={filters.noteOrder}
                onChange={(e) => setFilters({ ...filters, noteOrder: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Aucun tri</option>
                <option value="asc">Croissant</option>
                <option value="desc">Décroissant</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Erreurs et chargement */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center text-gray-600">Chargement...</div>
      ) : candidatures.length === 0 ? (
        <div className="text-center text-gray-600">Aucune candidature trouvée.</div>
      ) : (
        <>
          {/* Tableau des candidatures */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCandidatures.map((candidature) => (
                  <tr key={candidature.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{candidature.nom} {candidature.prenom}</div>
                      <div className="text-sm text-gray-500">{candidature.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidature.formation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(candidature.statut)}`}>
                        {candidature.statut.charAt(0).toUpperCase() + candidature.statut.slice(1)}
                      </span>
                      {candidature.statut === 'refusée' && candidature.motif_refus && (
                        <div className="mt-1 text-xs text-red-600">Motif : {candidature.motif_refus}</div>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleNoteChange(candidature.id, star)}
                            className={`text-m transition-colors ${star <= candidature.note ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                          >
                            <FaStar />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({candidature.note}/5)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={candidature.statut}
                        onChange={(e) => {
                          const newStatut = e.target.value;
                          if (newStatut === 'refusée') {
                            openModal(candidature.id, 'refus', candidature.motif_refus);
                          } else {
                            handleStatusChange(candidature.id, newStatut);
                          }
                        }}
                        className="mr-2 px-2 py-1 border rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {['en attente', 'en entretien', 'acceptée', 'refusée'].map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => openModal(candidature.id, 'details')}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-indigo-700 transition"
            >
              Précédent
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-indigo-700 transition"
            >
              Suivant
            </button>
          </div>
        </>
      )}

      {/* Modale pour refus ou détails */}
      {modalData.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {modalData.type === 'refus' ? (
              <>
                <h3 className="text-lg font-semibold mb-4">Motif de refus</h3>
                <textarea
                  value={modalData.motifRefus}
                  onChange={(e) => setModalData({ ...modalData, motifRefus: e.target.value })}
                  placeholder="Entrez le motif de refus..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      if (!modalData.motifRefus.trim()) {
                        toast.error('Le motif de refus ne peut pas être vide');
                        return;
                      }
                      handleStatusChange(modalData.candidatureId, 'refusée', modalData.motifRefus);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Confirmer
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">Détails de la candidature</h3>
                {candidatures.find((c) => c.id === modalData.candidatureId) && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-md font-semibold">Informations</h4>
                      <p className="text-sm text-gray-600">
                        Candidat : {candidatures.find((c) => c.id === modalData.candidatureId).nom}{' '}
                        {candidatures.find((c) => c.id === modalData.candidatureId).prenom}
                      </p>
                      <p className="text-sm text-gray-600">
                        Email : {candidatures.find((c) => c.id === modalData.candidatureId).email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Formation : {candidatures.find((c) => c.id === modalData.candidatureId).formation}
                      </p>
                      <p className="text-sm text-gray-600">
                        Statut : {candidatures.find((c) => c.id === modalData.candidatureId).statut}
                      </p>
                      {candidatures.find((c) => c.id === modalData.candidatureId).statut === 'refusée' &&
                        candidatures.find((c) => c.id === modalData.candidatureId).motif_refus && (
                          <p className="text-sm text-red-600">
                            Motif de refus : {candidatures.find((c) => c.id === modalData.candidatureId).motif_refus}
                          </p>
                        )}
                    </div>
                    <div>
                      <h4 className="text-md font-semibold">Remarques</h4>
                      {candidatures.find((c) => c.id === modalData.candidatureId).remarques?.length > 0 ? (
                        <ul className="space-y-2">
                          {candidatures.find((c) => c.id === modalData.candidatureId).remarques.map((remarque) => (
                            <li key={remarque.id} className="bg-gray-50 p-2 rounded-lg">
                              <p>{remarque.contenu}</p>
                              <p className="text-sm text-gray-500">
                                Par {remarque.admin_prenom} {remarque.admin_nom} le{' '}
                                {new Date(remarque.date_creation).toLocaleString('fr-FR')}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600">Aucune remarque.</p>
                      )}
                      <textarea
                        value={newRemarque[modalData.candidatureId] || ''}
                        onChange={(e) => setNewRemarque({ ...newRemarque, [modalData.candidatureId]: e.target.value })}
                        placeholder="Ajouter une remarque..."
                        className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleAddRemarque(modalData.candidatureId)}
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Ajouter la remarque
                      </button>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold">Historique des modifications</h4>
                      {candidatures.find((c) => c.id === modalData.candidatureId).historique?.length > 0 ? (
                        <ul className="space-y-2">
                          {candidatures.find((c) => c.id === modalData.candidatureId).historique.map((modif) => (
                            <li key={modif.id} className="bg-gray-50 p-2 rounded-lg">
                              <p>
                                {modif.type_modification === 'statut' && (
                                  <>Statut changé de "{modif.ancienne_valeur}" à "{modif.nouvelle_valeur}"</>
                                )}
                                {modif.type_modification === 'note' && (
                                  <>Note changée de {modif.ancienne_valeur} à {modif.nouvelle_valeur} étoiles</>
                                )}
                                {modif.type_modification === 'remarque' && (
                                  <>Nouvelle remarque ajoutée : "{modif.nouvelle_valeur}"</>
                                )}
                              </p>
                              <p className="text-sm text-gray-500">
                                Par {modif.admin_prenom} {modif.admin_nom} le{' '}
                                {new Date(modif.date_modification).toLocaleString('fr-FR')}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600">Aucun historique.</p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Fermer
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;