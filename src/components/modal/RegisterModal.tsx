"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { authAPI } from "@/src/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterModal = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.register(
        fullName,
        email,
        password,
        confirmPassword,
      );

      // Redirect ke dashboard setelah register berhasil
      const user = response.data.user;
      if (user.role === "ADMIN") {
        router.push("/products");
      } else {
        router.push("/transactions");
      }
    } catch (err: any) {
      setError(err.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-9 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <Image
            src="/assets/foodstore-logo.png"
            alt="food store logo"
            width={300}
            height={300}
            className="mx-auto"
          />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 mt-4">
            Daftar Akun Baru
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Silakan isi data diri anda untuk mendaftar.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block font-medium mb-2">
              Nama Lengkap
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-900"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email anda"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-900"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-medium mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-red-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block font-medium mb-2">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Masukkan ulang kata sandi"
                className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-red-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-900 hover:bg-red-800 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>

          <div className="border-t my-4"></div>

          {/* Login link */}
          <div className="text-center">
            <span className="text-sm text-gray-700">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-red-900 underline font-medium"
              >
                Silakan login
              </Link>
            </span>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-6">
        &copy; {new Date().getFullYear()} Aplikasi Food Store |{" "}
        <Link href="/privacy" className="underline">
          Kebijakan Privasi
        </Link>{" "}
        dan{" "}
        <Link href="/terms" className="underline">
          Syarat & Ketentuan
        </Link>
      </div>
    </div>
  );
};

export default RegisterModal;
