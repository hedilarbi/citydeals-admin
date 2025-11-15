import LoginForm from "@/components/auth/LoginForm";
import { authenticateAdmin } from "@/services/auth";
import { persistSession } from "@/utils/session";
import { redirect } from "next/navigation";

async function loginAction(prevState, formData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      message: "Merci de remplir tous les champs.",
    };
  }

  try {
    const payload = await authenticateAdmin({ email, password });
    await persistSession({ token: payload.token, admin: payload.admin });
    redirect("/");
  } catch (error) {
    if (error?.digest?.toString()?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      message: error.message ?? "Impossible de vous connecter. Réessayez.",
    };
  }
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-linear-to-br from-pr/10 via-white to-white flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center space-y-6 text-center mb-10 md:mb-0">
        <LoginForm action={loginAction} />
      </div>
    </div>
  );
}
