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
          Choisissez un destinataire (invités, utilisateurs ou entreprises),
          ciblez éventuellement une ville, puis envoyez le titre et le message
          vers les appareils correspondants.
        </p>
      </div>

      <NotificationForm />
    </section>
  );
}
