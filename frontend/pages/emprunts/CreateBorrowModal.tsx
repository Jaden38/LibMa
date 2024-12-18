import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Book } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IBook, ISample } from "@/types";
import { fetchSamplesByBookId, fetchUserByEmail, createBorrow } from "@/api";
import DatePicker from "@/components/ui/DatePicker";

interface CreateBorrowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateSuccess: (borrow: any) => void;
    books: IBook[];
    userId?: number;
}

export default function CreateBorrowModal({ isOpen, onClose, onCreateSuccess, books, userId }: CreateBorrowModalProps) {
    const [formError, setFormError] = useState<string | null>(null);
    const [availableSamples, setAvailableSamples] = useState<ISample[]>([]);
    const [newBorrow, setNewBorrow] = useState({
        email: "",
        book: "",
        sample_id: "",
        begin_date: "",
        end_date: "",
    });

    const selectedBook = newBorrow.book ? books.find(b => b.id === parseInt(newBorrow.book)) : null;

    const handleClose = () => {
        onClose();
        setNewBorrow({
            email: "",
            book: "",
            sample_id: "",
            begin_date: "",
            end_date: "",
        });
        setFormError(null);
        setAvailableSamples([]);
    };

    const handleLoadSamples = async (bookId: string) => {
        try {
            const samples = await fetchSamplesByBookId(bookId);
            const filtered = samples.filter(s => s.status === "disponible");
            setAvailableSamples(filtered);
        } catch (err) {
            console.error(err);
            setFormError("Erreur lors de la récupération des exemplaires");
        }
    };

    const handleCreate = async () => {
        const { email, sample_id, begin_date, end_date } = newBorrow;
        if (!email || !sample_id || !begin_date || !end_date) {
            setFormError("Tous les champs sont requis.");
            return;
        }

        if (new Date(end_date) <= new Date(begin_date)) {
            setFormError("La date de fin doit être après la date de début.");
            return;
        }

        const userData = await fetchUserByEmail(email);
        if (!userData) {
            setFormError("Aucun utilisateur trouvé avec cet email.");
            return;
        }

        try {
            const borrowPayload = {
                user_id: userData.id,
                sample_id,
                begin_date,
                end_date
            };
            const data = await createBorrow(borrowPayload);
            onCreateSuccess(data);
            handleClose();
        } catch (err: any) {
            console.error(err);
            setFormError(err.message || "Erreur lors de la création de l'emprunt.");
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
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
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-semibold mb-4 uppercase tracking-wider text-center">
                            Créer un Emprunt
                        </h2>
                        {selectedBook && (
                            <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-[#00f1a1] p-2 rounded">
                                        <Book size={20} className="text-black" />
                                    </span>
                                    <div>
                                        <h3 className="font-medium">{selectedBook.title}</h3>
                                    </div>
                                </div>
                            </div>
                        )}
                        {formError && (
                            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded mb-4 text-center font-medium">
                                {formError}
                            </div>
                        )}
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label htmlFor="email" className="block mb-1 font-semibold">
                                    Email Utilisateur
                                </label>
                                <motion.input
                                    whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                    whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                    type="email"
                                    id="email"
                                    value={newBorrow.email}
                                    onChange={(e) => setNewBorrow({ ...newBorrow, email: e.target.value })}
                                    className="w-full p-2 bg-[#1a1a1a] border border-[#2c2c2c] text-white rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
                                    placeholder="exemple@domaine.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="book" className="block mb-1 font-semibold">
                                    Livre
                                </label>
                                <motion.select
                                    whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                    whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                    id="book"
                                    value={newBorrow.book || ""}
                                    onChange={async (e) => {
                                        const bookId = e.target.value;
                                        setNewBorrow({ ...newBorrow, book: bookId, sample_id: "" });
                                        if (bookId) {
                                            await handleLoadSamples(bookId);
                                        } else {
                                            setAvailableSamples([]);
                                        }
                                    }}
                                    className="w-full p-2 bg-[#1a1a1a] border border-[#2c2c2c] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
                                >
                                    <option value="">Sélectionner un livre</option>
                                    {books.map((book) => (
                                        <option key={book.id} value={book.id.toString()}>
                                            {book.title} par {book.author}
                                        </option>
                                    ))}
                                </motion.select>
                            </div>
                            {newBorrow.book && availableSamples.length > 0 && (
                                <div>
                                    <label htmlFor="sample" className="block mb-1 font-semibold">
                                        Exemplaire disponible
                                    </label>
                                    <motion.select
                                        whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                        whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                        id="sample"
                                        value={newBorrow.sample_id}
                                        onChange={(e) => setNewBorrow({ ...newBorrow, sample_id: e.target.value })}
                                        className="w-full p-2 bg-[#1a1a1a] border border-[#2c2c2c] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
                                    >
                                        <option value="">Sélectionner un exemplaire</option>
                                        {availableSamples.map((sample) => (
                                            <option key={sample.id} value={sample.id.toString()}>
                                                Code: {sample.unique_code} - Étagère: {sample.localization}
                                            </option>
                                        ))}
                                    </motion.select>
                                </div>
                            )}
                            {newBorrow.book && availableSamples.length === 0 && (
                                <div className="text-yellow-500 text-sm font-medium bg-yellow-500/10 p-3 rounded">
                                    Aucun exemplaire disponible pour ce livre. Création d'une réservation recommandée.
                                </div>
                            )}
                            <DatePicker
                                label="Date de début"
                                value={newBorrow.begin_date}
                                onChange={(date) => setNewBorrow({ ...newBorrow, begin_date: date })}
                            />
                            <DatePicker
                                label="Date de fin"
                                value={newBorrow.end_date}
                                onChange={(date) => setNewBorrow({ ...newBorrow, end_date: date })}
                            />
                            <div className="flex gap-4 mt-4">
                                <Button
                                    onClick={handleCreate}
                                    className="bg-[#00f1a1] text-black hover:bg-[#00d891] hover:scale-105 transition-all flex-1 focus:outline-none focus:ring-2 focus:ring-[#00f1a1] focus:ring-offset-2 focus:ring-offset-[#121212]"
                                >
                                    <Save size={16} className="inline-block mr-2" /> Créer
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    className="bg-[#1a1a1a] text-white hover:bg-[#2c2c2c] hover:scale-105 transition-all flex-1 focus:outline-none focus:ring-2 focus:ring-[#2c2c2c] focus:ring-offset-2 focus:ring-offset-[#121212]"
                                >
                                    <X size={16} className="inline-block mr-2" /> Annuler
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
