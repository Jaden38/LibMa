import { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/UseUser";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IBorrow, IBook } from '@/types';
import { useBorrows } from '@/context/UseBorrows';
import { useApprovers } from '@/context/UseApprovers';
import CreateBorrowModal from './CreateBorrowModal';
import EditBorrowModal from './EditBorrowModal';
import BorrowsTable from './BorrowsTable';

import { approveBorrow, rejectBorrow } from '@/api';

export default function Borrows() {
  const { user } = useUser();
  const router = useRouter();

  const { borrowRequests, setBorrowRequests, loading, bookMap } = useBorrows();
  const { approvers, getApprover } = useApprovers();

  const [successMessage, setSuccessMessage] = useState<string|null>(null);
  const [formError, setFormError] = useState<string|null>(null);

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editBorrow, setEditBorrow] = useState<IBorrow|null>(null);
  const [bookEditBorrow, setBookEditBorrow] = useState<IBook|null>(null);

  useEffect(() => {
    if (user?.role !== "bibliothecaire") {
      router.push("/");
    }
  }, [user, router]);

  const handleApproveBorrow = async (borrowId: number) => {
    if (!user) return;
    try {
      await approveBorrow(borrowId, user.id);
      setBorrowRequests((prev) => prev.filter((req) => req.id !== borrowId));
      setSuccessMessage("Emprunt approuvé avec succès !");
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Erreur lors de l'approbation.");
    }
  };

  const handleRejectBorrow = async (borrowId: number) => {
    if (!user) return;
    try {
      await rejectBorrow(borrowId, user.id);
      setBorrowRequests((prev) => prev.filter((req) => req.id !== borrowId));
      setSuccessMessage("Emprunt rejeté avec succès !");
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Erreur lors du rejet.");
    }
  };

  const handleCreateSuccess = (borrow: IBorrow) => {
    setBorrowRequests((prev) => [borrow, ...prev ]);
    setSuccessMessage("Emprunt créé avec succès !");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const openEditForm = (borrow: IBorrow) => {
    setEditBorrow(borrow);
    const relatedBook = bookMap[borrow.sample.id] || null;
    setBookEditBorrow(relatedBook);
    setIsEditFormOpen(true);
  };

  const handleUpdateSuccess = (updated: IBorrow) => {
    setBorrowRequests((prev) =>
      prev.map((req) => (req.id === updated.id ? updated : req))
    );
    setSuccessMessage("Emprunt mis à jour avec succès !");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0d0d0d" }}>
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-[#00f1a1] text-black px-4 py-2 rounded-lg font-semibold shadow-lg z-50"
          >
            {successMessage}
          </motion.div>
        )}
        {formError && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg z-50"
          >
            {formError}
          </motion.div>
        )}
      </AnimatePresence>
      <header className="p-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <Link href="/">
            <Button className="flex items-center gap-2 bg-[#1a1a1a] text-white px-3 py-2 rounded-md hover:bg-[#272727] hover:scale-105 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]">
              <ArrowLeft size={20} /> Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider">
            Gestion des Emprunts
          </h1>
        </motion.div>
      </header>
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center text-white mb-8 px-4"
      >
        <h2 className="text-4xl font-extrabold uppercase tracking-wider mb-2">
          Administrez les Emprunts
        </h2>
        <p className="text-gray-300 max-w-md mx-auto">
          Créez, modifiez, approuvez ou rejetez les demandes d'emprunt en un clin d'œil.
        </p>
      </motion.section>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex-grow w-full max-w-[1400px] mx-auto p-6 bg-[#121212] text-white rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.7)]"
      >
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => setIsCreateFormOpen(true)}
            className="flex items-center gap-2 bg-[#00f1a1] text-black px-4 py-2 rounded-lg hover:bg-[#05e799] hover:scale-105 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
          >
            Créer un nouvel emprunt
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-300">Chargement des emprunts...</p>
        ) : (
            <BorrowsTable
            borrows={borrowRequests}
            onApprove={handleApproveBorrow}
            onReject={handleRejectBorrow}
            onEdit={openEditForm}
            approvers={approvers}
            getApprover={getApprover}
          />
        )}
      </motion.main>
      <CreateBorrowModal
        isOpen={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onCreateSuccess={handleCreateSuccess}
        books={Object.values(bookMap)}
        userId={user?.id}
      />
      <EditBorrowModal
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        borrow={editBorrow}
        book={bookEditBorrow}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}