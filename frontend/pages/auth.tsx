import React, { useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/router";

const AuthPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setError(null);
    // todo(1): Add login logic here
  };

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    // todo(2): Add register logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-zinc-100">
      <div className="w-full max-w-lg bg-zinc-800 rounded-lg shadow-lg p-6">

        <div className="flex justify-around mb-6">
          <button
            onClick={() => {
              setActiveTab("login");
              setError(null);
            }}
            className={`text-sm font-medium px-4 py-2 rounded-md ${activeTab === "login"
                ? "bg-zinc-700 text-zinc-100"
                : "text-zinc-400 hover:text-zinc-100"
              }`}
          >
            Se connecter
          </button>
          <button
            onClick={() => {
              setActiveTab("register");
              setError(null);
            }}
            className={`text-sm font-medium px-4 py-2 rounded-md ${activeTab === "register"
                ? "bg-zinc-700 text-zinc-100"
                : "text-zinc-400 hover:text-zinc-100"
              }`}
          >
            S'inscrire
          </button>
        </div>


        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <h1 className="text-2xl font-bold text-center">
            {activeTab === "login" ? "Connexion" : "Inscription"}
          </h1>
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 text-sm text-zinc-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Email address"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 text-sm text-zinc-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Mot de passe"
            />
          </div>
          {activeTab === "register" && (
            <div>
              <Input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-zinc-700 border border-zinc-600 text-sm text-zinc-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Confirmer le mot de passe"
              />
            </div>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            onClick={
              activeTab === "login" ? handleLogin : handleRegister
            }
            disabled={!email || !password || (activeTab === "register" && !confirmPassword)}
            className="w-full py-3 bg-blue-600 text-sm text-zinc-100 rounded-md hover:bg-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          >
            {activeTab === "login" ? "Se connecter" : "S'inscrire"}
          </Button>
        </form>
      </div>


      <button
        onClick={() => router.push("/")}
        className="mt-4 px-4 py-2 bg-zinc-800 text-zinc-100 text-sm rounded-md hover:bg-zinc-700 transition"
      >
        Retour à l'accueil
      </button>
    </div>
  );
};

export default AuthPage;
