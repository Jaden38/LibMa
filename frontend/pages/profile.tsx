import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/hooks/UseUser";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import { useBorrows } from "@/context/UseBorrows";
import { IBorrow, IBorrowHistory } from "@/types";

const processBorrowHistory = (borrowRequests: IBorrow[], userId: number): IBorrowHistory => {
  const today = new Date();

  return borrowRequests
    .filter(borrow => borrow.user.id === userId)
    .reduce<IBorrowHistory>(
      (result, borrow) => {



        const isPastBorrow =
          borrow.return_date !== null ||
          borrow.status === "terminé" ||
          borrow.status === "annulé";

        if (isPastBorrow) {
          result.pastBorrows.push(borrow);
        } else {

          if (borrow.end_date) {
            const endDate = new Date(borrow.end_date);
            if (endDate < today && borrow.status === "en cours") {
              borrow.status = "en retard";
            }
          }
          result.currentBorrows.push(borrow);
        }

        return result;
      },
      { currentBorrows: [], pastBorrows: [] }
    );
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Non spécifié';

  try {
    const date = new Date(dateString);

    // Options pour le formatteur de date
    const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return dateFormatter.format(date)
      .replace(':', 'h')
      .replace(' à ', ' à ');
  } catch (e) {
    console.error('Erreur de formatage de date:', e);
    return dateString;
  }
};

export default function Profile() {
  const { user } = useUser();
  const router = useRouter();
  const { borrowRequests } = useBorrows();

  const borrowHistory = processBorrowHistory(borrowRequests, user?.id ?? 1);
  const { currentBorrows, pastBorrows } = borrowHistory;


  const [mail, setMail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateProfile = () => {
    if (!mail || !password || !confirmPassword) {
      setError("Tous les champs sont requis.");
      setMessage(null);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setMessage(null);
      return;
    }

    setMessage("Profil mis à jour avec succès !");
    setError(null);
  };

  const handleChangeUsername = () => {
    if (newUsername) {
      setMessage("Pseudo mis à jour avec succès !");
      setIsModalOpen(false);
      setError(null);
    } else {
      setError("Le pseudo est requis.");
      setMessage(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 80%)"
      }}
    >
      {/* Header avec bouton retour */}
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-[#1a1a1a] text-white px-3 py-2 rounded-md hover:bg-[#272727] hover:scale-105 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
          >
            <ArrowLeft size={18} />
            Retour
          </Button>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider">Mon Profil</h1>
        </div>
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-grow w-full max-w-[1400px] mx-auto p-6 bg-[#121212] text-white rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.7)]"
      >
        <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-8 text-center uppercase tracking-wider">
          Bienvenue {user?.firstname}
        </motion.h2>

        {/* Formulaire de mise à jour du profil */}
        <motion.form
          variants={itemVariants}
          onSubmit={(e) => e.preventDefault()}
          className="max-w-xl mx-auto mb-12 space-y-6"
        >
          <div className="flex flex-col space-y-4">
            <motion.input
              whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
              whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
              type="email"
              placeholder="Adresse email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2c2c2c] text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f1a1] transition-transform"
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.input
                whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                type="password"
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#2c2c2c] text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f1a1] transition-transform"
              />
              <motion.input
                whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#2c2c2c] text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f1a1] transition-transform"
              />
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleUpdateProfile}
              disabled={!mail || !password || !confirmPassword}
              className="py-3 px-6 bg-[#00f1a1] text-black font-semibold rounded-md hover:bg-[#05e799] hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00f1a1] disabled:opacity-50"
            >
              Mettre à jour le profil
            </Button>
          </div>

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          {message && <p className="text-[#00f1a1] text-sm text-center mt-2">{message}</p>}
        </motion.form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Emprunts en cours */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Emprunts en cours</h2>
            <div className="space-y-3">
              {currentBorrows.map((borrowing, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, backgroundColor: "#1f1f1f" }}
                  className="bg-[#1a1a1a] text-white p-4 rounded-md border border-[#2c2c2c] transition-all duration-300"
                >
                  <p className="font-semibold text-[#00f1a1]">{borrowing.sample.book.title}</p>
                  <p className="text-sm text-gray-400">Emprunté le {formatDate(borrowing.begin_date)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Historique des emprunts */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Historique des emprunts</h2>
            <div className="space-y-3">
              {pastBorrows.map((history, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, backgroundColor: "#1f1f1f" }}
                  className="bg-[#1a1a1a] text-white p-4 rounded-md border border-[#2c2c2c] transition-all duration-300"
                >
                  <p className="font-semibold text-[#00f1a1]">{history.sample.book.title}</p>
                  <p className="text-sm text-gray-400">
                    Emprunté le {formatDate(history.begin_date)}, Rendu le {formatDate(history.return_date)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.main>

      {/* Modal pour changer le pseudo */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121212] rounded-lg p-6 text-white max-w-sm w-full"
          >
            <h3 className="text-xl font-bold mb-4">Changer de Pseudo</h3>
            <motion.input
              whileHover={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
              whileFocus={{ scale: 1.03, boxShadow: "0 0 8px #00f1a1" }}
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2c2c2c] text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f1a1] transition-transform mb-4"
              placeholder="Nouveau pseudo"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {message && <p className="text-[#00f1a1] text-sm mb-2">{message}</p>}
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#1a1a1a] text-white rounded-md hover:bg-[#272727] transition-all focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
              >
                Annuler
              </Button>
              <Button
                onClick={handleChangeUsername}
                className="px-4 py-2 bg-[#00f1a1] text-black font-semibold rounded-md hover:bg-[#05e799] hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
              >
                Valider
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
