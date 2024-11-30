import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import BookCover from "@/components/ui/BookCover";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [selectedExemplaire, setSelectedExemplaire] =
    useState<Exemplaire | null>(null);
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

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [livreRes, exemplairesRes] = await Promise.all([
          fetch(`http://localhost:5000/livres/${id}`),
          fetch(`http://localhost:5000/livres/${id}/exemplaires`),
        ]);

        if (!livreRes.ok || !exemplairesRes.ok) {
          throw new Error("Erreur de récupération des données");
        }

        const livreData = await livreRes.json();
        const exemplairesData = await exemplairesRes.json();

        setLivre(livreData);
        setExemplaires(exemplairesData);
      } catch (err) {
        setError("Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen bg-zinc-900 text-zinc-100">
        <p className="text-lg font-bold">Chargement...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center h-screen bg-zinc-900 text-red-400">
        <p className="text-xl font-semibold">{error}</p>
        <Button onClick={() => router.back()} className="mt-4">
          Retour
        </Button>
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900 text-zinc-100 overflow-hidden">

      <div className="flex items-center justify-between px-6 pt-5">

        <h1 className="text-4xl font-bold truncate text-zinc-100">
          {livre?.titre}
        </h1>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="px-4 py-2 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
        >
          Retour
        </Button>
      </div>


      <div className="flex-grow p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <Card className="bg-zinc-800 p-4">
            <BookCover
              imageUrl={livre?.image_url || ""}
              title={livre?.titre || ""}
              className="w-full h-[300px] object-cover rounded-md"
            />
          </Card>


          <Card className="lg:col-span-2 bg-zinc-800 p-6">
            <div className="space-y-4">
              <p className="text-zinc-400">
                <strong className="text-zinc-200">Auteur:</strong>{" "}
                {livre?.auteur}
              </p>
              {livre?.genre && (
                <p className="text-zinc-400">
                  <strong className="text-zinc-200">Genre:</strong>{" "}
                  <Badge className="bg-blue-200 text-blue-800 border border-blue-400 px-2 py-1 rounded">
                    {livre.genre}
                  </Badge>
                </p>
              )}
              {livre?.categorie && (
                <p className="text-zinc-400">
                  <strong className="text-zinc-200">Catégorie:</strong>{" "}
                  <Badge className="bg-purple-200 text-purple-800 border border-purple-400 px-2 py-1 rounded">
                    {livre.categorie}
                  </Badge>
                </p>
              )}
              {livre?.date_sortie && (
                <p className="text-zinc-400">
                  <strong className="text-zinc-200">Date de sortie:</strong>{" "}
                  {new Date(livre.date_sortie).toLocaleDateString()}
                </p>
              )}
              {livre?.description && (
                <p className="text-zinc-400">{livre.description}</p>
              )}
            </div>
          </Card>
        </div>


        <Card className="mt-6 bg-zinc-800 p-6">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">
            Exemplaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exemplaires.map((exemplaire) => (
              <div
                key={exemplaire.id_exemplaire}
                className="p-4 bg-zinc-700 border rounded-lg hover:shadow-md transition cursor-pointer"
                onClick={() => loadEmpruntHistory(exemplaire)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium truncate text-zinc-100">
                    {exemplaire.code_unique}
                  </span>
                  <Badge
                    className={`px-2 py-1 rounded ${exemplaire.statut === "disponible"
                      ? "bg-green-200 text-green-800 border-green-400"
                      : exemplaire.statut === "emprunté"
                        ? "bg-yellow-200 text-yellow-800 border-yellow-400"
                        : exemplaire.statut === "réservé"
                          ? "bg-blue-200 text-blue-800 border-blue-400"
                          : "bg-red-200 text-red-800 border-red-400"
                      }`}
                  >
                    {exemplaire.statut}
                  </Badge>
                </div>
                {exemplaire.localisation && (
                  <p className="text-sm text-zinc-400 truncate">
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
