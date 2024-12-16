import React, { useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/router";

const Profile: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("utilisateur@example.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-zinc-100">
      <div className="w-full max-w-lg bg-zinc-800 rounded-lg shadow-lg p-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 text-sm bg-zinc-700 text-zinc-100 rounded-md hover:bg-zinc-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Retour
        </button>

        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-6 text-zinc-100">
          Gérer votre profil
        </h1>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 text-sm text-zinc-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Adresse email"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 text-sm text-zinc-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Nouveau mot de passe"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Confirmer le nouveau mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 text-sm text-zinc-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Confirmer le nouveau mot de passe"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          <Button
            onClick={handleUpdateProfile}
            disabled={!email || !password || !confirmPassword}
            className="w-full py-3 bg-blue-600 text-sm text-zinc-100 rounded-md hover:bg-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          >
            Mettre à jour le profil
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
