import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaUser, FaUserPlus, FaBook } from "react-icons/fa";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  category: string;
  release_date: string;
  description: string;
}

export default function Home() {
  const router = useRouter();
  const [Books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tagColors, setTagColors] = useState<{ [key: string]: string }>({});
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
          generateTagColors(data);
        } else {
          throw new Error("Data received is not an array");
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des Books:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const generateTagColors = (data: Book[]) => {
    const colors = [
      "bg-pink-200 text-pink-800 border-pink-400",
      "bg-blue-200 text-blue-800 border-blue-400",
      "bg-green-200 text-green-800 border-green-400",
      "bg-yellow-200 text-yellow-800 border-yellow-400",
      "bg-purple-200 text-purple-800 border-purple-400",
      "bg-orange-200 text-orange-800 border-orange-400",
      "bg-teal-200 text-teal-800 border-teal-400",
    ];
    const usedColors: { [key: string]: string } = {};
    let colorIndex = 0;

    data.forEach((Book) => {
      [Book.genre, Book.category].forEach((tag) => {
        if (tag && !usedColors[tag]) {
          usedColors[tag] = colors[colorIndex % colors.length];
          colorIndex++;
        }
      });
    });

    setTagColors(usedColors);
  };

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
      <main className="flex items-center justify-center h-screen bg-zinc-900 text-zinc-100">
        <p className="text-2xl font-semibold">Chargement...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center h-screen bg-zinc-900 text-red-400">
        <p className="text-xl font-semibold">Erreur: {error}</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6 bg-zinc-900 text-zinc-100 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-extrabold text-zinc-100">LibMa</h1>
        <div className="flex space-x-4">
          <Link href="/profile">
            <Button className="flex items-center gap-2 bg-zinc-800 text-zinc-100 px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all">
              <FaUser /> Mon Profil
            </Button>
          </Link>
          <Link href="/auth">
            <Button className="flex items-center gap-2 bg-zinc-800 text-zinc-100 px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all">
              <FaUserPlus /> Authentification
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap justify-between gap-4 items-center">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Rechercher un livre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-zinc-700 border border-zinc-600 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={filterGenre || ""}
            onChange={(e) => setFilterGenre(e.target.value || null)}
            className="px-4 py-2 bg-zinc-700 border border-zinc-600 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Tous les genres</option>
            {Array.from(new Set(Books.map((Book) => Book.genre).filter(Boolean))).map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <select
            value={filterCategorie || ""}
            onChange={(e) => setFilterCategorie(e.target.value || null)}
            className="px-4 py-2 bg-zinc-700 border border-zinc-600 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Toutes les catégories</option>
            {Array.from(new Set(Books.map((Book) => Book.category).filter(Boolean))).map(
              (categorie) => (
                <option key={categorie} value={categorie}>
                  {categorie}
                </option>
              )
            )}
          </select>
        </div>

        <Link href="/add-book">
          <Button className="inline-flex items-center gap-2 bg-zinc-800 text-zinc-100 px-6 py-3 rounded-lg hover:bg-zinc-700 transition-all">
            <FaBook /> Ajouter un livre
          </Button>
        </Link>
      </div>

      <section className="bg-zinc-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-zinc-200">Catalogue des livres</h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredBooks.map((Book) => (
            <div
              key={Book.id}
              className="bg-zinc-700 p-5 rounded-xl shadow-lg flex flex-col justify-between hover:shadow-md"
            >
              <div>
                <h3 className="text-lg font-semibold truncate text-zinc-100 mb-2">
                  {Book.title}
                </h3>
                <p className="text-sm text-zinc-400 mb-3">{Book.author}</p>

                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                  {Book.genre && (
                    <span
                      className={`px-2 py-1 rounded-md border ${tagColors[Book.genre] || "bg-gray-200 text-gray-800 border-gray-400"
                        }`}
                    >
                      {Book.genre}
                    </span>
                  )}
                  {Book.category && (
                    <span
                      className={`px-2 py-1 rounded-md border ${tagColors[Book.category] || "bg-gray-200 text-gray-800 border-gray-400"
                        }`}
                    >
                      {Book.category}
                    </span>
                  )}
                  {Book.release_date && (
                    <span className="text-zinc-400">
                      Publié le {new Date(Book.release_date).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>

                {Book.description && (
                  <p className="text-sm text-zinc-300 line-clamp-3">{Book.description}</p>
                )}
              </div>

              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={() => handleViewDetails(Book.id)}
                  className="px-4 my-0.5 rounded-md border border-indigo-400 text-indigo-400 hover:bg-indigo-600 hover:text-zinc-100 transition-all"
                >
                  Détails
                </button>
                <button
                  className="px-4 my-0.5 rounded-md border border-teal-400 text-teal-400 hover:bg-teal-600 hover:text-zinc-100 transition-all"
                >
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
