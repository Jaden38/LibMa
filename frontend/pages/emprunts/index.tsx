import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUser } from "@/hooks/UseUser";
import { IBorrow, IUser, IBook } from "@/types";
import { ArrowLeft, Book, Edit, Save, X } from "lucide-react";

export default function Borrows() {
    const { user, logout } = useUser();
    const router = useRouter();
    const [borrowRequests, setBorrowRequests] = useState<IBorrow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [newBorrow, setNewBorrow] = useState({ email: '', bookId: '', begin_date: '', end_date: '' });
    const [editBorrow, setEditBorrow] = useState<IBorrow | null>(null);
    const [books, setBooks] = useState<IBook[]>([]);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fonction pour récupérer les emprunts et les livres
    useEffect(() => {
        if (!(user?.role !== "bibliothecaire")) {
            router.push("/"); // Rediriger si l'utilisateur n'est pas bibliothécaire
            return;
        }

        setLoading(true);
        // Fetch les emprunts et les livres en parallèle
        Promise.all([
            fetch("/api/borrows"),
            fetch("/api/books")
        ])
            .then(async ([borrowRes, booksRes]) => {
                if (!borrowRes.ok) throw new Error("Erreur lors de la récupération des emprunts");
                if (!booksRes.ok) throw new Error("Erreur lors de la récupération des livres");

                const borrowsData = await borrowRes.json();
                const booksData = await booksRes.json();

                setBorrowRequests(borrowsData);
                setBooks(booksData);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [user, router]);

    // Fonction pour rechercher un utilisateur par email
    const fetchUserByEmail = async (email: string): Promise<IUser | null> => {
        try {
            const res = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
            if (!res.ok) {
                throw new Error("Utilisateur non trouvé");
            }
            const userData: IUser = await res.json();
            return userData;
        } catch (err) {
            console.error("Erreur lors de la recherche de l'utilisateur:", err);
            return null;
        }
    };

    const handleApproveBorrow = async (borrowId: number) => {
        try {
            const res = await fetch(`/api/borrows/${borrowId}/approve`, {
                method: "PATCH",
            });
            if (!res.ok) throw new Error("Erreur lors de l'approbation");
            setBorrowRequests((prev) => prev.filter((req) => req.id !== borrowId));
            setSuccessMessage("Emprunt approuvé avec succès !");
        } catch (err) {
            console.error("Erreur lors de l'approbation", err);
            setError("Erreur lors de l'approbation de l'emprunt.");
        }
    };

    const handleRejectBorrow = async (borrowId: number) => {
        try {
            const res = await fetch(`/api/borrows/${borrowId}/reject`, {
                method: "PATCH",
            });
            if (!res.ok) throw new Error("Erreur lors du rejet");
            setBorrowRequests((prev) => prev.filter((req) => req.id !== borrowId));
            setSuccessMessage("Emprunt rejeté avec succès !");
        } catch (err) {
            console.error("Erreur lors du rejet", err);
            setError("Erreur lors du rejet de l'emprunt.");
        }
    };

    const handleCreateBorrow = async () => {
        // Validation simple
        if (!newBorrow.email || !newBorrow.bookId || !newBorrow.begin_date || !newBorrow.end_date) {
            setFormError("Tous les champs sont requis.");
            return;
        }

        // Vérifier que la date de fin est après la date de début
        if (new Date(newBorrow.end_date) <= new Date(newBorrow.begin_date)) {
            setFormError("La date de fin doit être après la date de début.");
            return;
        }

        // Rechercher l'utilisateur par email
        const userData = await fetchUserByEmail(newBorrow.email);
        if (!userData) {
            setFormError("Aucun utilisateur trouvé avec cet email.");
            return;
        }

        const borrowPayload = {
            userId: userData.id,
            bookId: newBorrow.bookId,
            begin_date: newBorrow.begin_date,
            end_date: newBorrow.end_date
        };

        try {
            const res = await fetch("/api/borrows", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(borrowPayload),
            });
            if (!res.ok) throw new Error("Erreur lors de la création de l'emprunt");
            const data: IBorrow = await res.json();
            setBorrowRequests((prev) => [...prev, data]);
            setIsCreateFormOpen(false);
            setNewBorrow({ email: '', bookId: '', begin_date: '', end_date: '' });
            setFormError(null);
            setSuccessMessage("Emprunt créé avec succès !");
        } catch (err) {
            console.error("Erreur lors de la création de l'emprunt", err);
            setFormError("Erreur lors de la création de l'emprunt.");
        }
    };

    const handleEditBorrow = async () => {
        if (!editBorrow) return;

        // Validation simple
        if (!editBorrow.begin_date || !editBorrow.end_date) {
            setFormError("Les dates sont requises.");
            return;
        }

        // Vérifier que la date de fin est après la date de début
        if (new Date(editBorrow.end_date) <= new Date(editBorrow.begin_date)) {
            setFormError("La date de fin doit être après la date de début.");
            return;
        }

        try {
            const res = await fetch(`/api/borrows/${editBorrow.id}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    begin_date: editBorrow.begin_date,
                    end_date: editBorrow.end_date
                }),
            });
            if (!res.ok) throw new Error("Erreur lors de la mise à jour de l'emprunt");
            const updatedBorrow: IBorrow = await res.json();
            setBorrowRequests((prev) => prev.map((req) => req.id === updatedBorrow.id ? updatedBorrow : req));
            setIsEditFormOpen(false);
            setEditBorrow(null);
            setFormError(null);
            setSuccessMessage("Emprunt mis à jour avec succès !");
        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'emprunt", err);
            setFormError("Erreur lors de la mise à jour de l'emprunt.");
        }
    };

    const openEditForm = (borrow: IBorrow) => {
        setEditBorrow(borrow);
        setIsEditFormOpen(true);
        setFormError(null);
    };

    const handleCloseCreateForm = () => {
        setIsCreateFormOpen(false);
        setNewBorrow({ email: '', bookId: '', begin_date: '', end_date: '' });
        setFormError(null);
    };

    const handleCloseEditForm = () => {
        setIsEditFormOpen(false);
        setEditBorrow(null);
        setFormError(null);
    };

    // if (loading) {
    //     return (
    //         <main className="flex items-center justify-center h-screen bg-zinc-900 text-zinc-100">
    //             <p className="text-2xl font-semibold">Chargement des demandes d'emprunt...</p>
    //         </main>
    //     );
    // }

    // if (error) {
    //     return (
    //         <main className="flex items-center justify-center h-screen bg-zinc-900 text-red-500">
    //             <p className="text-xl font-semibold">Erreur : {error}</p>
    //         </main>
    //     );
    // }

    return (
        <main className="container mx-auto p-6 bg-zinc-900 text-zinc-100 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold">Gestion des Emprunts</h1>
                <Link href="/">
                    <Button className="flex items-center gap-2 bg-zinc-800 text-zinc-100 px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all">
                        <ArrowLeft size={20} /> Retour à l'accueil
                    </Button>
                </Link>
            </div>

            <div className="flex justify-between items-center mb-6">
                <Button
                    onClick={() => setIsCreateFormOpen(true)}
                    className="bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                    <Book size={20} /> Créer un nouvel emprunt
                </Button>

                {successMessage && (
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
                        {successMessage}
                    </div>
                )}
            </div>

            {/* Formulaire de Création d'Emprunt */}
            {isCreateFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl">Créer un emprunt</h2>
                            <button onClick={handleCloseCreateForm}>
                                <X size={20} className="text-zinc-400 hover:text-zinc-200 transition-colors" />
                            </button>
                        </div>
                        {formError && (
                            <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">
                                {formError}
                            </div>
                        )}
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label htmlFor="email" className="block mb-1">Email Utilisateur</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={newBorrow.email}
                                    onChange={(e) => setNewBorrow({ ...newBorrow, email: e.target.value })}
                                    className="w-full p-2 bg-zinc-700 text-zinc-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="exemple@domaine.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="book" className="block mb-1">Livre</label>
                                <select
                                    id="book"
                                    value={newBorrow.bookId}
                                    onChange={(e) => setNewBorrow({ ...newBorrow, bookId: e.target.value })}
                                    className="w-full p-2 bg-zinc-700 text-zinc-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">Sélectionner un livre</option>
                                    {books.map((bk) => (
                                        <option key={bk.id} value={bk.id}>
                                            {bk.title} par {bk.author}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="begin_date" className="block mb-1">Date de début</label>
                                <input
                                    type="date"
                                    id="begin_date"
                                    value={newBorrow.begin_date}
                                    onChange={(e) => setNewBorrow({ ...newBorrow, begin_date: e.target.value })}
                                    className="w-full p-2 bg-zinc-700 text-zinc-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label htmlFor="end_date" className="block mb-1">Date de fin</label>
                                <input
                                    type="date"
                                    id="end_date"
                                    value={newBorrow.end_date}
                                    onChange={(e) => setNewBorrow({ ...newBorrow, end_date: e.target.value })}
                                    className="w-full p-2 bg-zinc-700 text-zinc-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div className="flex gap-4 mt-4">
                                <Button
                                    onClick={handleCreateBorrow}
                                    className="bg-green-500 text-white hover:bg-green-600 transition-colors flex-1"
                                >
                                    <Save size={16} className="mr-2" /> Créer
                                </Button>
                                <Button
                                    onClick={handleCloseCreateForm}
                                    className="bg-red-500 text-white hover:bg-red-600 transition-colors flex-1"
                                >
                                    <X size={16} className="mr-2" /> Annuler
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Formulaire de Modification d'Emprunt */}
            {isEditFormOpen && editBorrow && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl">Modifier l'emprunt</h2>
                            <button onClick={handleCloseEditForm}>
                                <X size={20} className="text-zinc-400 hover:text-zinc-200 transition-colors" />
                            </button>
                        </div>
                        {formError && (
                            <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">
                                {formError}
                            </div>
                        )}
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label htmlFor="editbegin_date" className="block mb-1">Date de début</label>
                                <input
                                    type="date"
                                    id="editbegin_date"
                                    value={editBorrow.begin_date}
                                    onChange={(e) => setEditBorrow({ ...editBorrow, begin_date: e.target.value })}
                                    className="w-full p-2 bg-zinc-700 text-zinc-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label htmlFor="editend_date" className="block mb-1">Date de fin</label>
                                <input
                                    type="date"
                                    id="editend_date"
                                    value={editBorrow.end_date ? editBorrow.end_date : ""}
                                    onChange={(e) => setEditBorrow({ ...editBorrow, end_date: e.target.value })}
                                    className="w-full p-2 bg-zinc-700 text-zinc-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div className="flex gap-4 mt-4">
                                <Button
                                    onClick={handleEditBorrow}
                                    className="bg-green-500 text-white hover:bg-green-600 transition-colors flex-1"
                                >
                                    <Save size={16} className="mr-2" /> Sauvegarder
                                </Button>
                                <Button
                                    onClick={handleCloseEditForm}
                                    className="bg-red-500 text-white hover:bg-red-600 transition-colors flex-1"
                                >
                                    <X size={16} className="mr-2" /> Annuler
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Liste des Emprunts */}
            <section className="bg-zinc-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Liste des Emprunts</h2>

                <table className="w-full bg-zinc-700 rounded-lg">
                    <thead>
                        <tr>
                            <th className="p-4 text-left">Livre</th>
                            <th className="p-4 text-left">Utilisateur</th>
                            <th className="p-4 text-left">Date de début</th>
                            <th className="p-4 text-left">Date de fin</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {borrowRequests.map((request) => (
                            <tr key={request.id} className="border-b border-zinc-600">
                                <td className="p-4">{request.sample.title}</td>
                                <td className="p-4">{request.user.firstname} {request.user.lastname}</td>
                                <td className="p-4">{new Date(request.begin_date).toLocaleDateString()}</td>
                                <td className="p-4">{new Date(request.end_date ? request.end_date : "").toLocaleDateString()}</td>
                                <td className="p-4 flex gap-2">
                                    <Button
                                        className="bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-1"
                                        onClick={() => handleApproveBorrow(request.id)}
                                    >
                                        Approuver
                                    </Button>
                                    <Button
                                        className="bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-1"
                                        onClick={() => handleRejectBorrow(request.id)}
                                    >
                                        Rejeter
                                    </Button>
                                    <Button
                                        className="bg-yellow-500 text-white hover:bg-yellow-600 transition-colors flex items-center gap-1"
                                        onClick={() => openEditForm(request)}
                                    >
                                        <Edit size={16} /> Modifier
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {borrowRequests.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-zinc-400">
                                    Aucune demande d'emprunt en attente.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </main>
    );
}
