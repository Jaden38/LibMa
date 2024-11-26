import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import BookCover from "@/components/ui/BookCover";
import { DialogEmpruntHistorique } from "@/components/ui/DialogEmpruntHistorique";

interface Livre {
  id_livre: number;
  titre: string;
  auteur: string;
  genre: string | null;
  categorie: string | null;
  date_sortie: string | null;
  description: string | null;
  image_url: string | null;
}

interface Exemplaire {
  id_exemplaire: number;
  code_unique: string;
  statut: "disponible" | "emprunté" | "réservé" | "indisponible";
  date_acquisition: string | null;
  localisation: string | null;
}

interface Emprunt {
  id_emprunt: number;
  date_debut: string;
  date_fin: string;
  date_retour: string | null;
  statut: "en cours" | "terminé" | "en retard" | "annulé";
  utilisateur: {
    id: number;
    nom: string;
    prenom: string;
  };
}

export default function BookDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [livre, setLivre] = useState<Livre | null>(null);
  const [exemplaires, setExemplaires] = useState<Exemplaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExemplaire, setSelectedExemplaire] =
    useState<Exemplaire | null>(null);
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingEmprunts, setLoadingEmprunts] = useState(false);

  const loadEmpruntHistory = async (exemplaire: Exemplaire) => {
    setSelectedExemplaire(exemplaire);
    setDialogOpen(true);
    setLoadingEmprunts(true);

    try {
      const response = await fetch(
        `http://localhost:5000/exemplaires/${exemplaire.id_exemplaire}/emprunts`
      );
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des emprunts");
      const data = await response.json();
      setEmprunts(data);
    } catch (error) {
      console.error("Erreur:", error);
      setEmprunts([]);
    } finally {
      setLoadingEmprunts(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const [bookResponse, copiesResponse] = await Promise.all([
          fetch(`http://localhost:5000/livres/${id}`),
          fetch(`http://localhost:5000/livres/${id}/exemplaires`),
        ]);

        if (!bookResponse.ok || !copiesResponse.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const bookData = await bookResponse.json();
        const copiesData = await copiesResponse.json();

        setLivre(bookData);
        setExemplaires(copiesData);
      } catch (err) {
        console.error("Erreur:", err);
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Chargement...</h1>
      </div>
    );
  }

  if (error || !livre) {
    return (
      <div className="h-screen p-4">
        <div className="text-red-500">{error || "Livre non trouvé"}</div>
        <Button onClick={() => router.back()} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen p-4 flex flex-col">
      {/* Header - Titre et bouton retour */}
      <div className="flex items-center gap-4 mb-3">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Retour
        </Button>
        <h1 className="text-2xl font-bold truncate">{livre.titre}</h1>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
        {/* Colonne de gauche - Image */}
        <div className="lg:col-span-1">
          <Card className="p-2 h-full">
            <div className="h-full max-h-[400px]">
              <BookCover
                imageUrl={livre.image_url}
                title={livre.titre}
                className="h-full"
              />
            </div>
          </Card>
        </div>

        {/* Colonne du milieu - Informations */}
        <Card className="lg:col-span-2 p-4 overflow-auto">
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Auteur</p>
              <p className="font-medium">{livre.auteur}</p>
            </div>
            {livre.genre && (
              <div>
                <p className="text-sm text-gray-500">Genre</p>
                <p className="font-medium">{livre.genre}</p>
              </div>
            )}
            {livre.categorie && (
              <div>
                <p className="text-sm text-gray-500">Catégorie</p>
                <p className="font-medium">{livre.categorie}</p>
              </div>
            )}
            {livre.date_sortie && (
              <div>
                <p className="text-sm text-gray-500">Date de sortie</p>
                <p className="font-medium">
                  {new Date(livre.date_sortie).toLocaleDateString("fr-FR")}
                </p>
              </div>
            )}
            {livre.description && (
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-sm mt-1 line-clamp-4">{livre.description}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Section exemplaires */}
        <Card className="lg:col-span-3 p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Exemplaires</h2>
              <div className="text-sm space-x-2">
                <span>Total: {exemplaires.length}</span>
                <span>•</span>
                <span>
                  Disponibles:{" "}
                  {
                    exemplaires.filter((ex) => ex.statut === "disponible")
                      .length
                  }
                </span>
              </div>
            </div>
            <Button size="sm">Réserver</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 overflow-auto max-h-[200px]">
            {exemplaires.map((exemplaire) => (
              <div
                key={exemplaire.id_exemplaire}
                className="p-2 border rounded-lg text-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => loadEmpruntHistory(exemplaire)}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium truncate">
                    {exemplaire.code_unique}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      exemplaire.statut === "disponible"
                        ? "bg-green-100 text-green-800"
                        : exemplaire.statut === "emprunté"
                        ? "bg-yellow-100 text-yellow-800"
                        : exemplaire.statut === "réservé"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {exemplaire.statut}
                  </Badge>
                </div>
                {exemplaire.localisation && (
                  <p className="text-xs text-gray-600 truncate">
                    {exemplaire.localisation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <DialogEmpruntHistorique
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        exemplaire={selectedExemplaire}
        emprunts={emprunts}
        loading={loadingEmprunts}
      />
    </div>
  );
}
