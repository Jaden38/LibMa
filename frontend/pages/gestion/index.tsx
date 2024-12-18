import { IUser } from "@/types";
import { useUser } from "@/hooks/UseUser";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Plus, X, Trash, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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


    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

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
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLibrarian = async (librarianId: number) => {
        try {
            const res = await fetch(`http://localhost:5000/libraires/${librarianId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Erreur lors de la suppression");
            setLibrarians((prev) => prev.filter((lib) => lib.id !== librarianId));
            setSuccessMessage("Libraire supprimé avec succès !");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            console.error("Erreur lors de la suppression", err);
            setError(err.message || "Erreur lors de la suppression du libraire.");
            setTimeout(() => setError(null), 3000);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    const handleCreateLibrarian = async (e: FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);

        if (!firstname || !lastname || !email || !password) {
            setFormError("Tous les champs sont obligatoires.");
            setFormLoading(false);
            return;
        }

        try {
            const tokens = localStorage.getItem("tokens");
            if (!tokens) {
                throw new Error("No tokens found in localStorage");
            }

            const { access_token } = JSON.parse(tokens);

            const res = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`,
                },
                body: JSON.stringify({
                    firstname,
                    lastname,
                    email,
                    password,
                    role: "bibliothecaire",
                }),
            });

            if (!res.ok) {
                throw new Error("Erreur lors de la création du libraire");
            }

            const response = await res.json();

            if (response.message === "User created successfully") {
                await fetchLibrarians();
                setSuccessMessage("Libraire ajouté avec succès !");
                setFirstname("");
                setLastname("");
                setEmail("");
                setPassword("");
                setIsModalOpen(false);
                setTimeout(() => setSuccessMessage(null), 3000);
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


    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const tableRowVariants = {
        hidden: { opacity: 0, y: 5 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background: "radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 80%)"
            }}
        >
            {/* Header */}
            <header className="p-6 flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-4"
                >
                    <Button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 bg-[#1a1a1a] text-white px-3 py-2 rounded-md hover:bg-[#272727] hover:scale-105 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
                    >
                        <ArrowLeft size={18} />
                        Retour
                    </Button>
                    <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider">Gestion</h1>
                </motion.div>
            </header>

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-center text-white mb-8"
            >
                <h2 className="text-4xl font-extrabold uppercase tracking-wider mb-2">
                    Gestion des Libraires
                </h2>
                <p className="text-gray-300 max-w-md mx-auto">
                    Ajoutez, supprimez ou gérez vos libraires en toute simplicité.
                </p>
            </motion.section>

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-grow w-full max-w-[1400px] mx-auto p-6 bg-[#121212] text-white rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.7)]"
            >
                <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[#00f1a1] text-black px-4 py-2 rounded-lg hover:bg-[#05e799] hover:scale-105 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
                    >
                        <Plus size={20} /> Ajouter un Libraire
                    </Button>
                </motion.div>

                {/* Messages Succès/Erreur */}
                <div className="mb-6">
                    <AnimatePresence>
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-[#00f1a1] text-black px-4 py-2 rounded-lg font-semibold mb-4 text-center"
                            >
                                {successMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-red-500 text-white px-4 py-2 rounded mb-4 text-center font-semibold"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Modal de Création de Libraire */}
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-[#121212] p-6 rounded-lg shadow-lg w-full max-w-md relative text-white"
                            >
                                <button
                                    onClick={handleCloseModal}
                                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition"
                                >
                                    <X size={24} />
                                </button>
                                <h2 className="text-2xl font-semibold mb-4 uppercase tracking-wider text-center">
                                    Nouveau Libraire
                                </h2>
                                {formError && (
                                    <div className="bg-red-500 text-white px-4 py-2 rounded mb-4 text-center font-semibold">
                                        {formError}
                                    </div>
                                )}
                                <form onSubmit={handleCreateLibrarian} className="flex flex-col space-y-4">
                                    <div>
                                        <label htmlFor="firstname" className="block mb-1 font-semibold">
                                            Prénom
                                        </label>
                                        <motion.input
                                            whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                            whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                            type="text"
                                            id="firstname"
                                            value={firstname}
                                            onChange={(e) => setFirstname(e.target.value)}
                                            className="w-full p-2 rounded bg-[#1a1a1a] border border-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f1a1] transition-transform"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastname" className="block mb-1 font-semibold">
                                            Nom
                                        </label>
                                        <motion.input
                                            whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                            whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                            type="text"
                                            id="lastname"
                                            value={lastname}
                                            onChange={(e) => setLastname(e.target.value)}
                                            className="w-full p-2 rounded bg-[#1a1a1a] border border-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f1a1] transition-transform"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="mail" className="block mb-1 font-semibold">
                                            Email
                                        </label>
                                        <motion.input
                                            whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                            whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                            type="email"
                                            id="mail"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full p-2 rounded bg-[#1a1a1a] border border-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f1a1] transition-transform"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block mb-1 font-semibold">
                                            Mot de Passe
                                        </label>
                                        <motion.input
                                            whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                            whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full p-2 rounded bg-[#1a1a1a] border border-[#2c2c2c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f1a1] transition-transform"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-4 mt-4">
                                        <Button
                                            type="submit"
                                            disabled={formLoading}
                                            className="flex-1 bg-[#00f1a1] text-black font-semibold rounded-md hover:bg-[#05e799] hover:scale-105 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
                                        >
                                            {formLoading ? "Ajout..." : "Ajouter"}
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="flex-1 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 hover:scale-105 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                                        >
                                            Annuler
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.section variants={itemVariants} className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg overflow-x-auto mt-8">
                    {loading ? (
                        <p className="text-center text-gray-300">Chargement des libraires...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">Erreur : {error}</p>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-center mb-6 text-white uppercase tracking-wider">Liste des Libraires</h2>
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-[#2c2c2c]">
                                            <th className="p-4 text-sm font-semibold text-gray-300 uppercase">Nom</th>
                                            <th className="p-4 text-sm font-semibold text-gray-300 uppercase">Email</th>
                                            <th className="p-4 text-sm font-semibold text-gray-300 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence>
                                            {librarians.length === 0 && (
                                                <tr>
                                                    <td colSpan={3} className="p-4 text-center text-gray-500">
                                                        Aucun libraire trouvé.
                                                    </td>
                                                </tr>
                                            )}
                                            {librarians.map((librarian) => (
                                                <motion.tr
                                                    key={librarian.id}
                                                    variants={tableRowVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                    className="border-b border-[#2c2c2c] hover:bg-[#1f1f1f] transition cursor-default"
                                                >
                                                    <td className="p-4 text-white">{librarian.firstname} {librarian.lastname}</td>
                                                    <td className="p-4 text-gray-300">{librarian.email}</td>
                                                    <td className="p-4 flex items-center gap-2">
                                                        {confirmDeleteId === librarian.id ? (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -5 }}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Button
                                                                    onClick={() => handleDeleteLibrarian(librarian.id)}
                                                                    className="bg-red-500 hover:bg-red-600 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                                                                >
                                                                    <Check size={16} /> Confirmer
                                                                </Button>
                                                                <Button
                                                                    onClick={() => setConfirmDeleteId(null)}
                                                                    className="bg-gray-600 hover:bg-gray-700 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                                >
                                                                    <X size={16} /> Annuler
                                                                </Button>
                                                            </motion.div>
                                                        ) : (
                                                            <Button
                                                                onClick={() => setConfirmDeleteId(librarian.id)}
                                                                className="bg-red-500 hover:bg-red-600 hover:scale-105 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center gap-1"
                                                            >
                                                                <Trash size={16} /> Supprimer
                                                            </Button>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </motion.section>
            </motion.main>
        </div>
    );
}
