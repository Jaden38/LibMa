import Button from "@/components/ui/Button";
import { useEffect, useState } from 'react';
import Link from "next/link";

interface Livre {
  id_livre: number;
  titre: string;
  auteur: string;
  genre: string | null;
  categorie: string | null;
  date_sortie: string | null;
  description: string | null;
}

export default function Home() {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/livres')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setLivres(data);
        } else {
          throw new Error('Data received is not an array');
        }
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des livres:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">Gestion de la Bibliothèque</h1>
        <p className="text-center">Chargement...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">Gestion de la Bibliothèque</h1>
        <p className="text-center text-red-500">Erreur: {error}</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Section de boutons en haut à droite */}
      <div className="absolute top-6 right-6 space-x-4 z-10">
        <Link href="/login">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors">Login</Button>
        </Link>
        <Link href="/register">
          <Button className="bg-green-600 text-white hover:bg-green-700 transition-colors">Register</Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">Gestion de la Bibliothèque</h1>

      <div className="text-center mb-6">
        <Link href="/add-book">
          <Button className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
            Ajouter un livre
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Catalogue des Livres</h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {livres.map(livre => (
            <div
              key={livre.id_livre}
              className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{livre.titre}</h3>
                {livre.categorie && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {livre.categorie}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mt-1">{livre.auteur}</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {livre.genre && (
                  <span className="text-sm text-gray-500">{livre.genre}</span>
                )}
                {livre.date_sortie && (
                  <span className="text-sm text-gray-500">
                    • Publié le {new Date(livre.date_sortie).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>

              {livre.description && (
                <p className="mt-3 text-sm text-gray-700 line-clamp-3">{livre.description}</p>
              )}

              <div className="mt-4 flex gap-4">
                <Button variant="outline" size="sm" className="w-full md:w-auto">
                  Détails
                </Button>
                <Button variant="outline" size="sm" className="w-full md:w-auto">
                  Réserver
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}