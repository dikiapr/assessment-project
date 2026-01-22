import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse, errorResponse } from "@/src/lib/response";
import bcrypt from "bcryptjs";
import { generateToken } from "@/src/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, confirmPassword } = body;

    if (!fullName || !email || !password || !confirmPassword) {
      return errorResponse("Semua field harus diisi");
    }

    if (password !== confirmPassword) {
      return errorResponse("Password dan konfirmasi password tidak sama");
    }

    if (password.length < 6) {
      return errorResponse("Password minimal 6 karakter");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse("Email sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: "KASIR",
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    return successResponse(
      {
        user: userWithoutPassword,
        token,
      },
      "Registrasi berhasil",
      201,
    );
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse("Terjadi kesalahan server", 500);
  }
}
