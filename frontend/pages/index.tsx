import {Button} from "@/components/ui/button"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

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
  const router = useRouter()
  const [livres, setLivres] = useState<Livre[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:5000/livres')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setLivres(data)
        } else {
          throw new Error('Data received is not an array')
        }
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des livres:', err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleViewDetails = (livreId: number) => {
    router.push(`/livres/${livreId}`)
  }

  if (loading) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Gestion de la Bibliothèque</h1>
        <p>Chargement...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Gestion de la Bibliothèque</h1>
        <p className="text-red-500">Erreur: {error}</p>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Gestion de la Bibliothèque</h1>
      <Button variant="default">Ajouter un livre</Button>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Catalogue des Livres</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {livres.map(livre => (
            <div 
              key={livre.id_livre} 
              className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg">{livre.titre}</h3>
                {livre.categorie && (
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {livre.categorie}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">{livre.auteur}</p>
              <div className="mt-2">
                {livre.genre && (
                  <span className="text-sm text-gray-500">{livre.genre}</span>
                )}
                {livre.date_sortie && (
                  <span className="text-sm text-gray-500 ml-2">
                    • Publié le {new Date(livre.date_sortie).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>
              {livre.description && (
                <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                  {livre.description}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(livre.id_livre)}
                >
                  Détails
                </Button>
                <Button variant="outline" size="sm">
                  Réserver
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}