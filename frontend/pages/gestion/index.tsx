import { IUser } from "@/types";
import { useUser } from "@/hooks/UseUser";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Plus, X, Trash } from "lucide-react";

export default function Gestion() {
    const { user } = useUser();
    const router = useRouter();
    const [librarians, setLibrarians] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (user?.role !== "administrateur") {
            router.push("/");
            return;
        }

        fetchLibrarians();
    }, [user, router]);

    const fetchLibrarians = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:5000/libraires");
            if (!res.ok) throw new Error("Erreur lors de la récupération des libraires");
            const data: IUser[] = await res.json();
            setLibrarians(data);
        } catch (err: any) {
            setError(err.message || "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLibrarian = async (librarianId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce libraire ?")) return;

        try {
            const res = await fetch(`http://localhost:5000/libraires/${librarianId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Erreur lors de la suppression");
            setLibrarians((prev) => prev.filter((lib) => lib.id !== librarianId));
            setSuccessMessage("Libraire supprimé avec succès !");
        } catch (err: any) {
            console.error("Erreur lors de la suppression", err);
            setError(err.message || "Erreur lors de la suppression du libraire.");
        }
    };

    const handleCreateLibrarian = async (e: FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);
        setSuccessMessage(null);

        // Validation basique
        if (!firstname || !lastname || !email || !password) {
            setFormError("Tous les champs sont obligatoires.");
            setFormLoading(false);
            return;
        }

        const newLibrarian = {
            firstname,
            lastname,
            email,
            password: password,
            role: "bibliothecaire",
        };

        try {
            const res = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    firstname,
                    lastname,
                    email,
                    password,
                    role: "bibliothecaire"
                }),
            });

            if (!res.ok) {
                throw new Error("Erreur lors de la création du libraire");
            }

            const response = await res.json();

            if (response.message === 'User created successfully') {
                // Actualiser la liste des libraires
                await fetchLibrarians();
                setSuccessMessage("Libraire ajouté avec succès !");

                // Réinitialiser le formulaire
                setFirstname("");
                setLastname("");
                setEmail("");
                setPassword("");

                // Fermer la modal
                setIsModalOpen(false);
            }
        } catch (err: any) {
            console.error("Erreur lors de la création du libraire:", err);
            setFormError(err.message || "Erreur lors de la création du libraire");
        } finally {
            setFormLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormError(null);
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
    };

    return (
        <main className="container mx-auto p-6 bg-zinc-900 text-zinc-100 min-h-screen rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold">Gestion</h1>
                <Button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 transition-all"
                >
                    <ArrowLeft size={20} /> Retour
                </Button>
            </div>

            <div className="flex justify-between items-center mb-6">
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-500 hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} /> Ajouter un Libraire
                </Button>

                {successMessage && (
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
                        {successMessage}
                    </div>
                )}
            </div>

            {/* Modal de Création de Libraire */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-semibold mb-4">Ajouter un Nouveau Libraire</h2>
                        {formError && (
                            <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">
                                {formError}
                            </div>
                        )}
                        <form onSubmit={handleCreateLibrarian} className="flex flex-col space-y-4">
                            <div>
                                <label htmlFor="firstname" className="block mb-1">
                                    Prénom
                                </label>
                                <input
                                    type="text"
                                    id="firstname"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    className="w-full p-2 rounded bg-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastname" className="block mb-1">
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    id="lastname"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    className="w-full p-2 rounded bg-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="mail" className="block mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-2 rounded bg-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-1">
                                    Mot de Passe
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2 rounded bg-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="flex gap-4 mt-4">
                                <Button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    {formLoading ? "Ajout en cours..." : "Ajouter"}
                                    <Plus size={16} />
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <X size={16} /> Annuler
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tableau des Libraires */}
            <section className="bg-zinc-800 p-6 rounded-lg shadow-lg overflow-x-auto">
                {loading ? (
                    <p className="text-center">Chargement des libraires...</p>
                ) : error ? (
                    <p className="text-center text-red-500">Erreur : {error}</p>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-center mb-6">Liste des Libraires</h2>
                        <table className="w-full bg-zinc-700 rounded-lg">
                            <thead>
                                <tr>
                                    <th className="p-4 text-left">Nom</th>
                                    <th className="p-4 text-left">Email</th>
                                    <th className="p-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {librarians.map((librarian) => (
                                    <tr key={librarian.id} className="border-b border-zinc-600">
                                        <td className="p-4">
                                            {librarian.firstname} {librarian.lastname}
                                        </td>
                                        <td className="p-4">{librarian.email}</td>
                                        <td className="p-4 flex gap-2">
                                            <Button
                                                onClick={() => handleDeleteLibrarian(librarian.id)}
                                                className="bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-1"
                                            >
                                                <Trash size={16} /> Supprimer
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {librarians.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-4 text-center text-zinc-400">
                                            Aucun libraire trouvé.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                )}
            </section>
        </main>
    );
}
