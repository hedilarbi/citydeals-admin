"use client";

import { useState } from "react";

const initialState = {
  title: "",
  body: "",
  recipient: "guests",
  city: "all",
};

const cityOptions = [
  "Ariana",
  "Béja",
  "Ben Arous",
  "Bizerte",
  "Gabès",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kébili",
  "Le Kef",
  "Mahdia",
  "La Manouba",
  "Médenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
];

export default function NotificationForm() {
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Impossible d'envoyer la notif.");
      }

      setFeedback({
        type: "success",
        message: "Notification envoyée avec succès.",
      });
      setForm(initialState);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Erreur inattendue.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="recipient"
            className="text-sm font-medium text-gray-700 block"
          >
            Destinataire
          </label>
          <select
            id="recipient"
            name="recipient"
            value={form.recipient}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pr/50 bg-white"
          >
            <option value="guests">Invités</option>
            <option value="users">Utilisateurs</option>
            <option value="companies">Entreprises</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="city"
            className="text-sm font-medium text-gray-700 block"
          >
            Ville
          </label>
          <select
            id="city"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pr/50 bg-white"
          >
            <option value="all">Toutes les villes</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="title"
          className="text-sm font-medium text-gray-700 block"
        >
          Titre
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Titre de la notification"
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pr/50"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="body"
          className="text-sm font-medium text-gray-700 block"
        >
          Message
        </label>
        <textarea
          id="body"
          name="body"
          value={form.body}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Texte à envoyer"
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pr/50 resize-none"
        />
      </div>

      {feedback && (
        <div
          className={`text-sm rounded-lg px-4 py-2 ${
            feedback.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-lg bg-pr px-6 py-2 text-sm font-medium text-white transition hover:bg-pr/90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Envoi en cours..." : "Envoyer la notification"}
        </button>
      </div>
    </form>
  );
}
