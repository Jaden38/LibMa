import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Book } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IBorrow, IBook } from '@/types';
import { updateBorrow } from '@/api';
import DatePicker from '@/components/ui/DatePicker';

interface EditBorrowModalProps {
    isOpen: boolean;
    onClose: () => void;
    borrow: IBorrow | null;
    book: IBook | null;
    onUpdateSuccess: (updated: IBorrow) => void;
}

export default function EditBorrowModal({ isOpen, onClose, borrow, book, onUpdateSuccess }: EditBorrowModalProps) {
    const [formError, setFormError] = useState<string | null>(null);
    const [editBorrow, setEditBorrow] = useState<IBorrow | null>(borrow);

    useEffect(() => {
        setEditBorrow(borrow);
    }, [borrow]);

    const handleClose = () => {
        onClose();
        setFormError(null);
    };

    const handleEdit = async () => {
        if (!editBorrow) return;
        if (!editBorrow.begin_date || !editBorrow.end_date) {
            setFormError("Les dates sont requises.");
            return;
        }
        if (new Date(editBorrow.end_date) <= new Date(editBorrow.begin_date)) {
            setFormError("La date de fin doit être après la date de début.");
            return;
        }

        try {
            const updated = await updateBorrow(editBorrow.id, {
                begin_date: editBorrow.begin_date,
                end_date: editBorrow.end_date,
                status: editBorrow.status,
                return_date: editBorrow.return_date
            });
            onUpdateSuccess(updated);
            handleClose();
        } catch (err: any) {
            console.error(err);
            setFormError(err.message || "Erreur lors de la mise à jour de l'emprunt.");
        }
    };

    if (!isOpen || !editBorrow) return null;

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
                            Modifier l'Emprunt
                        </h2>

                        {book && (
                            <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-[#00f1a1] p-2 rounded">
                                        <Book size={20} className="text-black" />
                                    </span>
                                    <div>
                                        <h3 className="font-medium">{book.title}</h3>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Emprunteur:</span>
                                        <p className="font-medium">{editBorrow.user.firstname} {editBorrow.user.lastname}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Emplacement:</span>
                                        <p className="font-medium">{editBorrow.sample.localization}</p>
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
                            <DatePicker
                                label="Date de début"
                                value={editBorrow.begin_date}
                                onChange={(date) => setEditBorrow({ ...editBorrow, begin_date: date })}
                            />

                            <DatePicker
                                label="Date de fin"
                                value={editBorrow.end_date || ''}
                                onChange={(date) => setEditBorrow({ ...editBorrow, end_date: date })}
                            />

                            <div>
                                <label className="block mb-1 font-semibold">
                                    Statut de l'emprunt
                                </label>
                                <motion.select
                                    whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                    whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                                    value={editBorrow.status}
                                    onChange={(e) => setEditBorrow({ ...editBorrow, status: e.target.value as IBorrow["status"] })}
                                    className="w-full p-2 bg-[#1a1a1a] border border-[#2c2c2c] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
                                >
                                    <option value="en cours">En cours</option>
                                    <option value="terminé">Terminé</option>
                                    <option value="en retard">En retard</option>
                                    <option value="annulé">Annulé</option>
                                </motion.select>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <Button
                                    onClick={handleEdit}
                                    className="bg-[#00f1a1] text-black hover:bg-[#00d891] hover:scale-105 transition-all flex-1 focus:outline-none focus:ring-2 focus:ring-[#00f1a1] focus:ring-offset-2 focus:ring-offset-[#121212]"
                                >
                                    <Save size={16} className="inline-block mr-2" /> Sauvegarder
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