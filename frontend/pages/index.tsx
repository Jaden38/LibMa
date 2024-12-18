import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/UseUser";
import { DoorOpen, UserPlus, User, Book, BookCopy } from "lucide-react";
import { IBook } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { user, isLoggedIn, logout } = useUser();
  const router = useRouter();
  const [Books, setBooks] = useState<IBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<IBook[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterGenre, setFilterGenre] = useState<string | null>(null);
  const [filterCategorie, setFilterCategorie] = useState<string | null>(null);

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
          setBooks(data);
          setFilteredBooks(data);
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

  const filterBooks = () => {
    let filtered = Books;

    if (search) {
      filtered = filtered.filter(
        (Book) =>
          Book.title.toLowerCase().includes(search.toLowerCase()) ||
          Book.author.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterGenre) {
      filtered = filtered.filter((Book) => Book.genre === filterGenre);
    }

    if (filterCategorie) {
      filtered = filtered.filter((Book) => Book.category === filterCategorie);
    }

    setFilteredBooks(filtered);
  };

  useEffect(() => {
    filterBooks();
  }, [search, filterGenre, filterCategorie]);

  const handleViewDetails = (BookId: number) => {
    router.push(`/livres/${BookId}`);
  };

  if (loading) {
    return (
      <main
        className="flex items-center justify-center h-screen text-white"
        style={{
          background: "radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 80%)"
        }}
      >
        <p className="text-2xl font-semibold">Chargement...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main
        className="flex items-center justify-center h-screen text-[#00f1a1]"
        style={{
          background: "radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 80%)"
        }}
      >
        <p className="text-xl font-semibold">Erreur: {error}</p>
      </main>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 80%)"
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          LibMa
        </h1>
        <div className="flex gap-4 items-center">
          {isLoggedIn && (
            <Link href="/profile">
              <Button className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 rounded-lg hover:bg-[#272727] transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]">
                <User /> Profil
              </Button>
            </Link>
          )}
          {user?.role === "bibliothecaire" && (
            <Link href="/emprunts">
              <Button className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 rounded-lg hover:bg-[#272727] transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]">
                <BookCopy /> Emprunts
              </Button>
            </Link>
          )}
          {user?.role === "administrateur" && (
            <Link href="/gestion">
              <Button className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 rounded-lg hover:bg-[#272727] transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]">
                <User /> Libraires
              </Button>
            </Link>
          )}
          <Link href="/auth">
            {!isLoggedIn ? (
              <Button className="flex items-center gap-2 bg-[#00f1a1] text-black px-4 py-2 rounded-lg hover:bg-[#05e799] transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]">
                <UserPlus /> Auth
              </Button>
            ) : (
              <Button
                className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 rounded-lg hover:bg-[#272727] transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
                onClick={() => logout()}
              >
                <DoorOpen /> Déconnexion
              </Button>
            )}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex-grow flex flex-col items-center justify-center text-center pt-24 pb-16 px-4"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 uppercase tracking-wider">
          Découvrez notre Collection
        </h2>
        <p className="text-lg text-gray-300 max-w-md mb-8">
          Parcourez, filtrez et trouvez le livre parfait. Réservez d'un clic.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl justify-center">
          <motion.input
            whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
            whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
            type="text"
            placeholder="Rechercher un livre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#2c2c2c] text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f1a1] transition-transform"
          />
          <motion.select
            whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
            whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
            value={filterGenre || ""}
            onChange={(e) => setFilterGenre(e.target.value || null)}
            className="px-4 py-3 bg-[#1a1a1a] border border-[#2c2c2c] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#00f1a1] transition-transform"
          >
            <option value="">Genre</option>
            {Array.from(new Set(Books.map((Book) => Book.genre).filter(Boolean))).map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </motion.select>
          <motion.select
            whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
            whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
            value={filterCategorie || ""}
            onChange={(e) => setFilterCategorie(e.target.value || null)}
            className="px-4 py-3 bg-[#1a1a1a] border border-[#2c2c2c] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#00f1a1] transition-transform"
          >
            <option value="">Catégorie</option>
            {Array.from(new Set(Books.map((Book) => Book.category).filter(Boolean))).map(
              (categorie) => (
                <option key={categorie} value={categorie}>
                  {categorie}
                </option>
              )
            )}
          </motion.select>
        </div>
      </motion.section>

      {/* Catalogue */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-[1400px] w-full mx-auto p-6 bg-[#121212] text-white rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.7)] mb-10"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-white uppercase tracking-wider">
          Catalogue des Livres
        </h2>
        {filteredBooks.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-300"
          >
            Aucun livre ne correspond à vos critères.
          </motion.p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="sync">
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredBooks.map((Book) => (
                   <motion.div
                   key={Book.id}
                   variants={itemVariants}
                   whileHover={{ 
                     scale: 1.03,
                     transition: { duration: 0.2 }
                   }}
                   whileTap={{ scale: 0.97 }}
                   onClick={() => handleViewDetails(Book.id)}
                   className="bg-[#1a1a1a] p-5 rounded-xl shadow-md flex flex-col justify-between
                              hover:shadow-xl hover:shadow-[#00f1a133] transition-all duration-300 relative
                              cursor-pointer"
                 >
                    <div>
                      <h3 className="text-lg font-semibold truncate text-white mb-2">
                        {Book.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">{Book.author}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                        {Book.genre && (
                          <span
                            className="px-2 py-1 rounded-md border border-[#00f1a1] text-[#00f1a1] bg-transparent"
                          >
                            {Book.genre}
                          </span>
                        )}
                        {Book.category && (
                          <span
                            className="px-2 py-1 rounded-md border border-[#00f1a1] text-[#00f1a1] bg-transparent"
                          >
                            {Book.category}
                          </span>
                        )}
                        {Book.release_date && (
                          <span className="text-gray-400">
                            Publié le {new Date(Book.release_date).toLocaleDateString("fr-FR")}
                          </span>
                        )}
                      </div>
                      {Book.description && (
                        <p className="text-sm text-gray-300 line-clamp-3">{Book.description}</p>
                      )}
                    </div>
                    <div className="mt-4 flex justify-center gap-4">
                      <button
                        onClick={() => handleViewDetails(Book.id)}
                        className="px-4 py-1.5 rounded-md border border-[#00f1a1] text-[#00f1a1] hover:bg-[#00f1a1] hover:text-black transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
                      >
                        Détails
                      </button>
                      {isLoggedIn && (
                        <button
                          className="px-4 py-1.5 rounded-md border border-[#00f1a1] text-[#00f1a1] hover:bg-[#00f1a1] hover:text-black transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
                        >
                          Réserver
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}
