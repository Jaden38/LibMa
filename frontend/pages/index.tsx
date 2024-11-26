import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaUser, FaSignInAlt, FaUserPlus, FaBook } from "react-icons/fa";

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
  const router = useRouter();
  const [livres, setLivres] = useState<Livre[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/livres")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setLivres(data);
        } else {
          throw new Error("Data received is not an array");
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des livres:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleViewDetails = (livreId: number) => {
    router.push(`/livres/${livreId}`);
  };

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
    <main className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      {/* Boutons en haut à droite */}
      <div className="flex justify-end gap-4 mb-6">
        <Link href="/profile">
          <Button className="bg-[#003366] text-white hover:bg-[#002244] transition-colors rounded-xl px-4 py-2 shadow-lg transform hover:scale-105 flex items-center gap-2">
            <FaUser className="text-lg" /> Mon Profil
          </Button>
        </Link>
        <Link href="/login">
          <Button className="bg-[#003366] text-white hover:bg-[#002244] transition-colors rounded-xl px-4 py-2 shadow-lg transform hover:scale-105 flex items-center gap-2">
            <FaSignInAlt className="text-lg" /> Se connecter
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-[#003366] text-white hover:bg-[#002244] transition-colors rounded-xl px-4 py-2 shadow-lg transform hover:scale-105 flex items-center gap-2">
            <FaUserPlus className="text-lg" /> Créer un compte
          </Button>
        </Link>
      </div>

      {/* Titre principal */}
      <h1 className="text-4xl font-bold text-[#003366] text-center mb-6">
        Gestion de la Bibliothèque
      </h1>

      {/* Bouton Ajouter un livre */}
      <div className="flex justify-center md:justify-end mb-6">
        <Link href="/add-book">
          <Button className="bg-[#003366] text-white hover:bg-[#002244] transition-colors rounded-xl px-6 py-2 shadow-lg transform hover:scale-105 flex items-center gap-2">
            <FaBook className="text-lg" /> Ajouter un livre
          </Button>
        </Link>
      </div>

      {/* Titre Catalogue stylisé */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-[#003366] mb-4 relative text-center">
          Catalogue des Livres
          <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-16 h-1 bg-[#003366] rounded-md"></span>
        </h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {livres.map((livre) => (
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
                {livre.genre && <span className="text-sm text-gray-500">{livre.genre}</span>}
                {livre.date_sortie && (
                  <span className="text-sm text-gray-500">
                    • Publié le {new Date(livre.date_sortie).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>

              {livre.description && (
                <p className="mt-3 text-sm text-gray-700 line-clamp-3">{livre.description}</p>
              )}
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(livre.id_livre)}
                >
                  Détails
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full md:w-auto border-[#3a5a87] text-[#3a5a87] hover:bg-[#b0c8e7] hover:border-[#2a4b70] hover:text-[#002244] transition-colors rounded-xl px-6 py-2 shadow-sm transform hover:scale-105"
                >
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