"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { authAPI } from "@/src/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginModal = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = authAPI.getCurrentUser();
    if (user) {
      // Redirect based on role
      if (user.role === "ADMIN") {
        router.push("/products");
      } else {
        router.push("/transactions");
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);

      // Redirect ke dashboard setelah login berhasil
      const user = response.data.user;
      if (user.role === "ADMIN") {
        router.push("/products");
      } else {
        router.push("/transactions");
      }
    } catch (err: any) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-9 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center mb-6 ">
          <Image
            src="/assets/foodstore-logo.png"
            alt="food store logo"
            width={300}
            height={300}
            className="mx-auto"
          />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 mt-4">
            Selamat Datang!
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Silakan login ke akun anda.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm sm:text-base text-gray-800 font-medium mb-2"
            >
              Nama Pengguna / Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email anda"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm sm:text-base text-gray-800 font-medium mb-2"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent pr-10 sm:pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-900 hover:bg-red-800 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>

          {/* line */}
          <div className="border-t border-gray-300 my-3 sm:my-4"></div>

          <div className="text-center">
            <span className="text-xs sm:text-sm font-light text-gray-700">
              Belum mendaftar? Ayo{" "}
              <Link
                href="/register"
                className="text-red-900 hover:text-red-800 font-medium underline"
              >
                daftar sekarang
              </Link>
            </span>
          </div>
        </form>
      </div>

      {/* Privacy policy and terms */}
      <div className="text-center text-xs text-gray-500 mt-4 sm:mt-6 w-full max-w-md sm:max-w-lg lg:max-w-xl px-4">
        <span>&copy; {new Date().getFullYear()} Aplikasi Food Store | </span>
        <Link href="/login" className="underline hover:text-gray-700">
          Kebijakan Privasi
        </Link>
        <span> dan </span>
        <Link href="/login" className="underline hover:text-gray-700">
          Syarat & Ketentuan
        </Link>
        .
      </div>
    </div>
  );
};

export default LoginModal;
