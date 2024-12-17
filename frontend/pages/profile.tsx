import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function Profile() {
  const [email, setEmail] = useState("utilisateur@example.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ongoingBorrowings = [
    { book: "Le Seigneur des Anneaux", date: "2024-12-01" },
    { book: "Harry Potter", date: "2024-12-05" },
  ];

  const borrowingHistory = [
    { book: "1984", date: "2024-11-20", returnDate: "2024-12-01" },
    { book: "Le Petit Prince", date: "2024-11-15", returnDate: "2024-11-30" },
  ];

  const handleUpdateProfile = () => {
    if (!email || !password || !confirmPassword) {
      setError("Tous les champs sont requis.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setMessage("Profil mis à jour avec succès !");
    setError(null);
  };

  const handleChangeUsername = () => {
    if (newUsername) {
      setMessage("Pseudo mis à jour avec succès !");
      setIsModalOpen(false);
    } else {
      setError("Le pseudo est requis.");
    }
  };

  return (
    <div className="w-screen h-screen bg-zinc-900 text-zinc-100 rounded-lg shadow-lg flex flex-col">
      <div className="p-6 flex flex-col space-y-4 ">
        <h1 className="text-3xl font-extrabold text-zinc-100">Mon Profil</h1>
      </div>

      <div className=" ml-8 mr-8 mb-8 flex-grow bg-zinc-800 p-8 rounded-lg shadow-lg pt-12">
        <h2 className="text-2xl font-semibold text-zinc-100 mb-4">Bienvenue {email}</h2>
        
        <form onSubmit={(e) => e.preventDefault()} className="w-full space-y-4 space-x-0 mt-12 ml-4">
          <div className="flex flex-col items-start space-y-4">
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-fit bg-zinc-700 border border-zinc-600 text-sm text-zinc-100 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
              aria-label="Adresse email"
            />
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex gap-4">
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-fit bg-zinc-700 border border-zinc-600 text-sm text-zinc-100 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                aria-label="Nouveau mot de passe"
              />
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-fit bg-zinc-700 border border-zinc-600 text-sm text-zinc-100 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                aria-label="Confirmer le mot de passe"
              />
            </div>

            <Button
              onClick={handleUpdateProfile}
              disabled={!email || !password || !confirmPassword}
              className="py-3 px-6 bg-blue-600 text-sm text-zinc-100 rounded-md hover:bg-blue-500 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            >
              Mettre à jour le profil
            </Button>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center transition-all duration-300 ease-in-out">{error}</p>
          )}
          {message && (
            <p className="text-green-500 text-sm text-center transition-all duration-300 ease-in-out">{message}</p>
          )}
        </form>

        <div className="flex gap-48 p-6 mt-8">
          <div className="mt-8 transition-all duration-300 ease-in-out">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Emprunts en cours</h2>
            <ul className="space-y-2">
              {ongoingBorrowings.map((borrowing, index) => (
                <li
                  key={index}
                  className="w-96 bg-zinc-700 text-zinc-100 p-3 rounded-md transform transition-all duration-300 ease-in-out hover:bg-zinc-600 hover:scale-105 hover:shadow-lg"
                >
                  <p className="font-semibold">{borrowing.book}</p>
                  <p className="text-sm">Emprunté le {borrowing.date}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 transition-all duration-300 ease-in-out">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Historique des emprunts</h2>
            <ul className="space-y-2">
              {borrowingHistory.map((history, index) => (
                <li
                  key={index}
                  className="w-96 bg-zinc-700 text-zinc-100 p-3 rounded-md transform transition-all duration-300 ease-in-out hover:bg-zinc-600 hover:scale-105 hover:shadow-lg"
                >
                  <p className="font-semibold">{history.book}</p>
                  <p className="text-sm">Emprunté le {history.date}, Rendu le {history.returnDate}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}