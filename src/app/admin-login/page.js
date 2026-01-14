// src/app/admin-login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "SriVenkateswaraKolatam",
    password: "",
  });

  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    if (credentials.username === "SriVenkateswaraKolatam" && credentials.password === "svk@2025") {
      localStorage.setItem("isAdmin", "true");
      router.push("/admin/dashboard");
    } else {
      alert("❌ Invalid username or password");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6  rounded-2xl" >
      <form
        onSubmit={handleLogin}
        className="w-full max-w-xl  transition-all transform  hover:-translate-y-2  max-w-xl mx-auto bg-gradient-to-br from-black/40 to-black/20 rounded-2xl p-6 sm:p-15 shadow-xl transform transition-all hover:-translate-y-0.5">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          className="w-full p-3 rounded mb-4 bg-white/90 border border-amber-900 text-green-900 font-bold text-3xl"
        />

        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          className="w-full p-3 rounded mb-4 bg-white/90 border border-amber-900 text-green-900 font-bold text-3xl"
        />
<div className="flex justify-center">
        <button
          type="submit"
          className="w-30  bg-blue-900 hover:bg-green-900 py-2 rounded font-semibold transition-all hover:shadow-lg"
        >
          Login
        </button>
        </div>
      </form>
    </main>
  );
}
