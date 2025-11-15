"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FaArrowRight, FaEnvelope, FaLock } from "react-icons/fa6";

const initialState = {
  message: null,
};

const LoginForm = ({ action }) => {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-light-gray p-8 space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
          CityDeals Admin
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">Connexion</h1>
      </div>

      <form action={formAction} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="text-xs font-semibold tracking-wide text-gray-500"
          >
            Email
          </label>
          <div className="mt-1 flex items-center border border-light-gray rounded-2xl px-3 py-2 focus-within:border-pr transition-colors">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="nom@company.com"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-xs font-semibold tracking-wide text-gray-500"
          >
            Mot de passe
          </label>
          <div className="mt-1 flex items-center border border-light-gray rounded-2xl px-3 py-2 focus-within:border-pr transition-colors">
            <FaLock className="text-gray-400 mr-3" />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <div className="text-right mt-2 text-xs">
            <Link href="#" className="text-pr hover:text-pr-dark">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        {state?.message && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-3 py-2">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-pr text-white py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-pr-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Connexion en cours..." : "Se connecter"}
          <FaArrowRight className="text-xs" />
        </button>
      </form>

      <p className="text-center text-xs text-gray-400">
        Accès réservé aux équipes CityDeals.{" "}
        <Link href="#" className="text-pr hover:text-pr-dark">
          Besoin d’aide ?
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
