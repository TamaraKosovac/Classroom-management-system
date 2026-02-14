"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setSuccess("Registration successful! Redirecting...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e9ecef] text-black">
      <div className="w-full max-w-lg min-h-[650px] bg-white py-6 px-8 rounded-2xl shadow-lg shadow-gray-500/30">

        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt="UniSpace Logo"
            width={50}
            height={50}
            priority
          />

          <h1 className="text-3xl font-bold mt-2 tracking-tight text-gray-600">
            UniSpace
          </h1>

          <p className="text-center text-sm mt-1 text-gray-600 leading-relaxed">
            Reserve. Manage. Simplify.
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col">

          <label className="text-sm font-medium mb-2 text-gray-600 ml-2">
            First Name
          </label>
          <input
            type="text"
            placeholder="Enter your first name"
            className="w-full border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <div className="mt-4">
            <label className="text-sm font-medium mb-2 block text-gray-600 ml-2">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="w-full border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium mb-2 block text-gray-600 ml-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium mb-2 block text-gray-600 ml-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.828M9.88 5.09A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.293 5.063M6.228 6.228A9.956 9.956 0 002.458 12c.63 2.106 1.978 3.918 3.77 5.228" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-16 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition"
          >
            Register
          </button>
        </form>

        {error && (
          <p className="text-red-600 mt-6 text-center text-sm">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 mt-6 text-center text-sm">
            {success}
          </p>
        )}

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-gray-500 hover:text-gray-700 font-medium transition"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}