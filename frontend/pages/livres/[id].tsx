import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import BookCover from "@/components/ui/BookCover";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoanHistoryDialog } from "@/components/ui/LoanHistoryDialog";
import { useUser } from "@/hooks/UseUser";
import { IBook, IBorrow, ISample } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "@/components/ui/StatusBadge";

export default function BookDetails() {
  const { user, isLoggedIn } = useUser();
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState<IBook | null>(null);
  const [samples, setSamples] = useState<ISample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [borrows, setBorrows] = useState<IBorrow[]>([]);
  const [selectedSample, setSelectedSample] = useState<ISample | null>(null);
  const [borrowsLoading, setborrowsLoading] = useState(false);

  const loadEmpruntHistory = async (exemplaire: ISample) => {
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
      <main
        className="flex items-center justify-center h-screen text-white"
        style={{
          background:
            "radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 80%)",
        }}
      >
        <p className="text-lg font-bold">Chargement...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main
        className="flex flex-col items-center justify-center h-screen text-[#00f1a1]"
        style={{
          background:
            "radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 80%)",
        }}
      >
        <p className="text-xl font-semibold">{error}</p>
        <Button
          onClick={() => router.back()}
          className="mt-4 bg-[#1a1a1a] text-white px-4 py-2 rounded hover:bg-[#272727] transition focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
        >
          Retour
        </Button>
      </main>
    );
  }

  // Variantes d'animation
  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const samplesContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const sampleItemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
    hover: { scale: 1.03, boxShadow: "0 0 10px #00f1a1" },
  };

  // Statut => couleur unique adaptée au thème
  const getStatusBadgeClasses = (status: string) => {
    let color = "#00f1a1"; // accent par défaut
    return `border border-[${color}] text-[${color}]`;
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 80%)",
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl font-bold text-white truncate"
        >
          {book?.title}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#1a1a1a] text-white hover:bg-[#272727] transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
          >
            Retour
          </Button>
        </motion.div>
      </header>

      <motion.div
        className="flex-grow p-6 overflow-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-[#1a1a1a] p-4 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <BookCover
                cover={book?.cover_image || ""}
                title={book?.title || ""}
                className="w-full h-[300px] object-cover rounded-md"
              />
            </motion.div>
          </Card>

          <Card className="lg:col-span-2 bg-[#1a1a1a] p-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-4 text-white"
            >
              {book?.author && (
                <p>
                  <strong className="text-gray-200">Auteur :</strong>{" "}
                  {book.author}
                </p>
              )}
              {book?.genre && (
                <p>
                  <strong className="text-gray-200">Genre :</strong>{" "}
                  <Badge className="border border-[#00f1a1] text-[#00f1a1] px-2 py-1 rounded">
                    {book.genre}
                  </Badge>
                </p>
              )}
              {book?.category && (
                <p>
                  <strong className="text-gray-200">Catégorie :</strong>{" "}
                  <Badge className="border border-[#00f1a1] text-[#00f1a1] px-2 py-1 rounded">
                    {book.category}
                  </Badge>
                </p>
              )}
              {book?.release_date && (
                <p>
                  <strong className="text-gray-200">Date de sortie :</strong>{" "}
                  {new Date(book.release_date).toLocaleDateString()}
                </p>
              )}
              {book?.description && (
                <p className="text-gray-300">
                  <strong className="text-gray-200">Description :</strong>{" "}
                  {book.description}
                </p>
              )}
            </motion.div>
          </Card>
        </div>

        {isLoggedIn && (
          <motion.div
            className="mt-6 bg-[#1a1a1a] p-6 rounded-lg"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-xl font-semibold text-white mb-4 uppercase tracking-wide">
              Exemplaires
            </h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={samplesContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {samples.map((sample) => (
                  <motion.div
                    key={sample.id}
                    variants={sampleItemVariants}
                    whileHover="hover"
                    className="p-4 bg-[#121212] border border-[#2c2c2c] rounded-lg hover:shadow-md transition cursor-pointer"
                    onClick={() => loadEmpruntHistory(sample)}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium truncate text-white">
                        {sample.unique_code}
                      </span>
                      <StatusBadge status={sample.status} />
                    </div>
                    {sample.localization && (
                      <p className="text-sm text-gray-400 truncate">
                        {sample.localization}
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

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
