// pages/register.tsx
import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(null); // Reset error message if validation is successful
    // Logic for registration (front-end only for now)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#003366]">Register</h1>
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#4a6fa5] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              aria-label="Password"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-[#4a6fa5] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              aria-label="Confirm password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            onClick={handleRegister}
            disabled={!email || !password || !confirmPassword}
            className="w-full py-3 mt-4 bg-[#003366] text-white rounded-xl hover:bg-[#002244] focus:outline-none focus:ring-2 focus:ring-[#002244]"
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;