import { useState } from 'react';

function Inscription() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!nom || !prenom || !email || !motDePasse || !confirmation) {
      setMessage('❌ Tous les champs doivent être remplis');
      return;
    }

    if (motDePasse !== confirmation) {
      setMessage('❌ Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prenom, email, mot_de_passe: motDePasse }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Compte créé avec succès !');
        setNom('');
        setPrenom('');
        setEmail('');
        setMotDePasse('');
        setConfirmation('');
      } else {
        setMessage(`❌ Erreur : ${data.error || 'Inscription échouée'}`);
      }
    } catch (error) {
      console.error('Erreur fetch :', error);
      setMessage('❌ Erreur de connexion au serveur');
    }
  };

  return (
    <div className="max-w-xl p-8 bg-white rounded-3xl shadow-xl border border-gray-200 mx-auto mt-12
                    transform transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-3xl font-extrabold text-center text-black-600 mb-6 tracking-wide">
        Inscription
      </h2>

      <p className="text-sm text-gray-600 mb-8 leading-relaxed text-justify">
        <strong>Créez un compte</strong> en renseignant le formulaire ci-dessous.<br />
        Vous recevrez un email sur l'adresse que vous aurez indiquée.<br />
        Consultez votre messagerie pour cliquer sur le lien de validation dans l'email reçu.<br />
        <strong>Attention :</strong> vous disposez d'un délai d'une heure pour cliquer sur le lien.<br />
        Au-delà, il faudra recommencer la procédure depuis l'étape 1.<br />
        Votre compte sera alors activé.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            id="nom"
            type="text"
            placeholder="Votre nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
          <input
            id="prenom"
            type="text"
            placeholder="Votre prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
          <input
            id="confirmation"
            type="password"
            placeholder="••••••••"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black-500 transition"
            required
          />
        </div>

        {message && (
          <p className={`text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'} font-medium`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          className="block mx-auto w-48 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-base font-semibold transition-all duration-200 transform hover:-translate-y-0.5"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default Inscription;
