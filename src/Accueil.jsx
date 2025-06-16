import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildingOffice2Icon, PhoneIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

function Accueil() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  function demanderPleinEcran() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
}

  const handleConnexionClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl p-8 lg:p-12">
        {/* Header Section */}
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-indigo-900 leading-tight">
            Bienvenue au <span className="text-indigo-600">CEFISI</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Votre centre de formation pour des compétences en gestion de projet, No Code, Blockchain et plus encore.
          </p>
        </header>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Program Highlights */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <AcademicCapIcon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Formations Modulaires</h2>
                <p className="text-gray-600">
                  Formations courtes et adaptées aux salariés et entreprises. Spécialisations en MOA, No Code, et Blockchain.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <BuildingOffice2Icon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Alternance & VAE</h2>
                <p className="text-gray-600">
                  Parcours en alternance dès septembre 2025 et formations à distance ou en VAE pour les diplômés Bac+3 à Bac+5.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <PhoneIcon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Inscriptions Ouvertes</h2>
                <p className="text-gray-600">
                  Sessions 2025 pour titres RNCP niveau 6 et 7, éligibles CPF. Prochaine session : 20 septembre 2025.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Call to Action + Contact info */}
          <div className="bg-indigo-50 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-indigo-900 mb-4">Prêt à booster votre carrière ?</h2>
              <p className="text-gray-600 mb-6">
                Rejoignez nos formations reconnues et adaptez vos compétences aux besoins du marché. Postulez dès maintenant !
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handleConnexionClick}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Candidater pour une formation"
              >
                Candidater
              </button>
            </div>

            {/* Contact info affichée en brut */}
            <div className="text-indigo-900 text-sm space-y-1">
              <p><strong>Contactez-nous :</strong></p>
              <p>Téléphone : 01 48 98 94 82</p>
              <p>WhatsApp : 06 51 14 85 32</p>
              <p>Email : contact@cefisi.com</p>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mt-8 p-4 bg-green-100 text-green-800 rounded-lg text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Accueil;
