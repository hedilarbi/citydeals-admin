import NotificationForm from "@/components/notifications/NotificationForm";

export default function NotificationsPage() {
  return (
    <section className="p-6 lg:p-8 space-y-6 h-[calc(100vh-100px)] overflow-y-auto">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-400">Notifications</p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">
          Envoyer une notification push
        </h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Définissez un titre et un message puis envoyez-les vers l&apos;app
          mobile en utilisant le token de test configuré dans l&apos;API.
        </p>
      </div>

      <NotificationForm />
    </section>
  );
}
