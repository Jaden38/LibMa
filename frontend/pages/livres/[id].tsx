import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import BookCover from "@/components/ui/BookCover";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoanHistoryDialog } from "@/components/ui/LoanHistoryDialog";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  category: string;
  release_date: string;
  description: string;
  image_url: string;
}

interface Sample {
  id: number;
  unique_code: string;
  status: "disponible" | "emprunté" | "réservé" | "indisponible";
  localization: string | null;
}

interface Borrow {
  id: number;
  begin_date: string;
  end_date: string;
  return_date: string | null;
  status: "en cours" | "terminé" | "en retard" | "annulé";
  user: {
    id: number;
    lastname: string;
    firstname: string;
  };
}

export default function BookDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState<Book | null>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [selectedSample, setSelectedSample] =
    useState<Sample | null>(null);
  const [borrowsLoading, setborrowsLoading] = useState(false);

  const loadEmpruntHistory = async (exemplaire: Sample) => {
    setSelectedSample(exemplaire);
    setDialogOpen(true);
    setborrowsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/exemplaires/${exemplaire.id}/emprunts`
      );
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des emprunts");
      const data = await response.json();
      setBorrows(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setborrowsLoading(false);
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

        setBook(livreData);
        setSamples(exemplairesData);
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
          {book?.title}
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
              imageUrl={book?.image_url || ""}
              title={book?.title || ""}
              className="w-full h-[300px] object-cover rounded-md"
            />
          </Card>


          <Card className="lg:col-span-2 bg-zinc-800 p-6">
            <div className="space-y-4">
              <p className="text-zinc-400 px-2 py-1">
                <strong className="text-zinc-200">Auteur:</strong>{" "}
                {book?.author}
              </p>
              {book?.genre && (
                <p className="text-zinc-400 px-2 py-1">
                  <strong className="text-zinc-200">Genre:</strong>{" "}
                  <Badge className="bg-blue-200 text-blue-800 border border-blue-400 px-2 py-1 rounded">
                    {book.genre}
                  </Badge>
                </p>
              )}
              {book?.category && (
                <p className="text-zinc-400 px-2 py-1">
                  <strong className="text-zinc-200">Catégorie:</strong>{" "}
                  <Badge className="bg-purple-200 text-purple-800 border border-purple-400 px-2 py-1 rounded">
                    {book.category}
                  </Badge>
                </p>
              )}
              {book?.release_date && (
                <p className="text-zinc-400 px-2 py-1">
                  <strong className="text-zinc-200">Date de sortie:</strong>{" "}
                  {new Date(book.release_date).toLocaleDateString()}
                </p>
              )}
              {book?.description && (
                <p className="text-zinc-400 px-2 py-1">
                <strong className="text-zinc-200">Description:</strong>{" "}
                {book.description}
                </p>
              )}
            </div>
          </Card>
        </div>


        <Card className="mt-6 bg-zinc-800 p-6">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">
            Exemplaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {samples.map((sample) => (
              <div
                key={sample.id}
                className="p-4 bg-zinc-700 border rounded-lg hover:shadow-md transition cursor-pointer"
                onClick={() => loadEmpruntHistory(sample)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium truncate text-zinc-100">
                    {sample.unique_code}
                  </span>
                  <Badge
                    className={`px-2 py-1 rounded ${sample.status === "disponible"
                      ? "bg-green-200 text-green-800 border-green-400"
                      : sample.status === "emprunté"
                        ? "bg-yellow-200 text-yellow-800 border-yellow-400"
                        : sample.status === "réservé"
                          ? "bg-blue-200 text-blue-800 border-blue-400"
                          : "bg-red-200 text-red-800 border-red-400"
                      }`}
                  >
                    {sample.status}
                  </Badge>
                </div>
                {sample.localization && (
                  <p className="text-sm text-zinc-400 truncate">
                    {sample.localization}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <LoanHistoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        sample={selectedSample}
        borrows={borrows}
        loading={borrowsLoading}
      />
    </div>
  );
}
