import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/UseUser";

const AuthPage: React.FC = () => {
  const { login } = useUser();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("L'email et le mot de passe sont requis.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error("Email et mot de passe requis");
          case 401:
            throw new Error("Email ou mot de passe incorrect");
          case 403:
            throw new Error("Compte inactif");
          default:
            throw new Error(data.error || "Échec de la connexion");
        }
      }

      const userData = {
        id: data.user_id,
        role: data.user_role,
        ...data.user,
      };

      const tokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("tokens", JSON.stringify(tokens));

      login({ tokens, user: userData });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !firstname || !lastname) {
      setError("Tous les champs sont requis.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstname,
          lastname,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Échec de l'inscription");
      }

      const userData = {
        id: data.user_id,
        role: data.user_role,
        ...data.user,
      };

      const tokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("tokens", JSON.stringify(tokens));

      login({ tokens, user: userData });

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      style={{
        background: "#0d0d0d"
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-[#121212] border border-[#1e1e1e] rounded-lg p-8 max-w-md w-full mx-4 
                   shadow-[0_0_30px_rgba(0,0,0,0.7)]"
      >
        <div className="relative flex justify-between items-center mb-8">
          <div className="flex w-full">
            <button
              onClick={() => {
                setActiveTab("login");
                setError(null);
              }}
              className={`relative flex-1 text-center py-2 text-sm font-semibold 
                          transition-colors 
                          ${activeTab === "login" ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
            >
              Se connecter
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setError(null);
              }}
              className={`relative flex-1 text-center py-2 text-sm font-semibold 
                          transition-colors 
                          ${activeTab === "register" ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
            >
              S'inscrire
            </button>
          </div>
          <motion.div
            layoutId="underline"
            className="absolute bottom-0 h-[2px] bg-[#00f1a1]"
            style={{
              width: "50%",
              left: activeTab === "login" ? "0%" : "50%",
            }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white text-center mb-4"
          >
            {activeTab === "login" ? "Connexion" : "Inscription"}
          </motion.h1>

          {activeTab === "register" && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Nom"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full bg-[#1a1a1a] text-white placeholder-gray-400 
                           rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
                aria-label="Nom"
              />
              <Input
                type="text"
                placeholder="Prénom"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-full bg-[#1a1a1a] text-white placeholder-gray-400 
                           rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
                aria-label="Prénom"
              />
            </div>
          )}

          <Input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1a1a1a] text-white placeholder-gray-400 
                       rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
            aria-label="Adresse email"
          />

          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1a1a1a] text-white placeholder-gray-400 
                       rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
            aria-label="Mot de passe"
          />

          {activeTab === "register" && (
            <Input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white placeholder-gray-400 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
              aria-label="Confirmer le mot de passe"
            />
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm font-medium text-center"
            >
              {error}
            </motion.p>
          )}

          <Button
            onClick={activeTab === "login" ? handleLogin : handleRegister}
            disabled={
              isLoading ||
              !email ||
              !password ||
              (activeTab === "register" &&
                (!confirmPassword || !firstname || !lastname))
            }
            className={`w-full py-3 text-white font-semibold rounded-md
                        transition focus:outline-none focus:ring-2 focus:ring-[#00f1a1]
                        ${isLoading ? "bg-[#333]" : "bg-[#00f1a1] hover:bg-[#05e799]"}`}
          >
            {isLoading
              ? "Chargement..."
              : activeTab === "login"
                ? "Se connecter"
                : "S'inscrire"}
          </Button>
        </form>
      </motion.div>

      <motion.button
        onClick={() => router.push("/")}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-10 px-6 py-3 bg-[#1f1f1f] text-gray-300 font-medium rounded-md hover:text-white hover:bg-[#2a2a2a] transition focus:outline-none focus:ring-2 focus:ring-[#00f1a1]"
      >
        Retour à l'accueil
      </motion.button>
    </div>
  );
};

export default AuthPage;
