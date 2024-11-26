// pages/profile.tsx
import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const Profile: React.FC = () => {
  const [email, setEmail] = useState("user@example.com"); // Exemple d'email initial
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateProfile = () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Si tout est valide, on simule une mise à jour réussie
    setMessage("Profile updated successfully!");
    setError(null); // Reset error message if success
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#003366]">Manage Your Profile</h1>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#4a6fa5] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#003366]"
            aria-label="Email address"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#4a6fa5] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#003366]"
            aria-label="New password"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-[#4a6fa5] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#003366]"
            aria-label="Confirm new password"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}
        <Button
          onClick={handleUpdateProfile}
          disabled={!email || !password || !confirmPassword}
          className="w-full py-3 mt-4 bg-[#003366] text-white rounded-xl hover:bg-[#002244] focus:outline-none focus:ring-2 focus:ring-[#002244]"
        >
          Update Profile
        </Button>
      </form>
    </div>
  );
};

export default Profile;