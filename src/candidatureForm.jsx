import { useState } from 'react';
import axios from 'axios';

function CandidatureForm() {
  const [telephone, setTelephone] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [formation, setFormation] = useState('');
  const [motivation, setMotivation] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [statutProfessionnel, setStatutProfessionnel] = useState('');
  const [message, setMessage] = useState('');
  const [telephoneError, setTelephoneError] = useState('');
  const [cvError, setCvError] = useState('');
  const [formationError, setFormationError] = useState('');
  const [dateNaissanceError, setDateNaissanceError] = useState('');
  const [statutProfessionnelError, setStatutProfessionnelError] = useState('');

  const validateTelephone = (phone) => {
    const phoneRegex = /^(?:(?:\+33|0)[1-9])(?:[-.\s]?[0-9]{2}){4}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setTelephoneError('');
    setCvError('');
    setFormationError('');
    setDateNaissanceError('');
    setStatutProfessionnelError('');

    // Validation
    if (!telephone) {
      setTelephoneError('❌ Le numéro de téléphone est requis');
      return;
    }
    if (!validateTelephone(telephone)) {
      setTelephoneError('❌ Numéro de téléphone invalide. Exemple : +33612345678 ou 0612345678');
      return;
    }

    if (!cvFile) {
      setCvError('❌ Le CV est requis (PDF uniquement)');
      return;
    }

    if (!formation) {
      setFormationError('❌ La formation est requise');
      return;
    }

    if (!dateNaissance) {
      setDateNaissanceError('❌ La date de naissance est requise');
      return;
    }
    const birthDate = new Date(dateNaissance);
    if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
      setDateNaissanceError('❌ Date de naissance invalide');
      return;
    }

    if (!statutProfessionnel) {
      setStatutProfessionnelError('❌ Le statut professionnel est requis');
      return;
    }

    const formData = new FormData();
    formData.append('telephone', telephone);
    formData.append('formation', formation);
    formData.append('motivation', motivation);
    formData.append('cv', cvFile);
    formData.append('date_naissance', dateNaissance);
    formData.append('statut_professionnel', statutProfessionnel);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/candidature',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('✅ Candidature soumise avec succès !');
      setTelephone('');
      setCvFile(null);
      setFormation('');
      setMotivation('');
      setDateNaissance('');
      setStatutProfessionnel('');
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
      const errorMsg = error.response?.data?.error || 'Erreur lors de la soumission';
      setMessage(`❌ ${errorMsg}`);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg mx-auto" style={{ maxWidth: '600px' }}>
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Formulaire de Candidature</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
            Téléphone *
          </label>
          <input
            id="telephone"
            type="tel"
            placeholder="Ex. +33612345678 ou 0612345678"
            value={telephone}
            onChange={(e) => {
              setTelephone(e.target.value);
              setTelephoneError('');
            }}
            className={`mt-1 w-full px-4 py-2 border ${
              telephoneError ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            required
          />
          {telephoneError && (
            <p className="text-red-500 text-sm mt-1">{telephoneError}</p>
          )}
        </div>
        <div>
          <label htmlFor="cv" className="block text-sm font-medium text-gray-700">
            CV (PDF uniquement) *
          </label>
          <input
            id="cv"
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              setCvFile(e.target.files[0]);
              setCvError('');
            }}
            className={`mt-1 w-full px-4 py-2 border ${
              cvError ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            required
          />
          {cvError && (
            <p className="text-red-500 text-sm mt-1">{cvError}</p>
          )}
        </div>
        <div>
          <label htmlFor="formation" className="block text-sm font-medium text-gray-700">
            Formation souhaitée *
          </label>
          <select
            id="formation"
            value={formation}
            onChange={(e) => {
              setFormation(e.target.value);
              setFormationError('');
            }}
            className={`mt-1 w-full px-4 py-2 border ${
              formationError ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            required
          >
            <option value="">Sélectionnez une formation</option>
            <option value="Spécialiste en maîtrise d’ouvrage des SI">Spécialiste en maîtrise d’ouvrage des SI</option>
            <option value="Concepteur développeur informatique No-code">Concepteur développeur informatique No-code</option>
            <option value="Chef de projet de solutions Blockchain">Chef de projet de solutions Blockchain</option>
          </select>
          {formationError && (
            <p className="text-red-500 text-sm mt-1">{formationError}</p>
          )}
        </div>
        <div>
          <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700">
            Date de naissance *
          </label>
          <input
            id="dateNaissance"
            type="date"
            value={dateNaissance}
            onChange={(e) => {
              setDateNaissance(e.target.value);
              setDateNaissanceError('');
            }}
            className={`mt-1 w-full px-4 py-2 border ${
              dateNaissanceError ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            required
          />
          {dateNaissanceError && (
            <p className="text-red-500 text-sm mt-1">{dateNaissanceError}</p>
          )}
        </div>
        <div>
          <label htmlFor="statutProfessionnel" className="block text-sm font-medium text-gray-700">
            Statut professionnel *
          </label>
          <select
            id="statutProfessionnel"
            value={statutProfessionnel}
            onChange={(e) => {
              setStatutProfessionnel(e.target.value);
              setStatutProfessionnelError('');
            }}
            className={`mt-1 w-full px-4 py-2 border ${
              statutProfessionnelError ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indingo-500`}
            required
          >
            <option value="">Sélectionnez votre statut</option>
            <option value="Étudiant - Bac+3">Étudiant - Bac+3</option>
            <option value="Étudiant - Bac+4">Étudiant - Bac+4</option>
            <option value="Étudiant - Bac+5">Étudiant - Bac+5</option>
            <option value="Salarié">Salarié</option>
            <option value="Entreprise">Entreprise</option>
          </select>
          {statutProfessionnelError && (
            <p className="text-red-500 text-sm mt-1">{statutProfessionnelError}</p>
          )}
        </div>
        <div>
          <label htmlFor="motivation" className="block text-sm font-medium text-gray-700">
            Lettre de motivation
          </label>
          <textarea
            id="motivation"
            placeholder="Expliquez vos motivations"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="5"
          />
        </div>
        {message && (
          <p className={`${message.includes('succès') ? 'text-green-600' : 'text-red-500'} text-sm`}>
            {message}
          </p>
        )}
        <div className="text-center">
          <button
            type="submit"
            className="w-auto bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Soumettre la candidature
          </button>
        </div>
      </form>
    </div>
  );
}

export default CandidatureForm;