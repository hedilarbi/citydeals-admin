import UsersExplorer from "@/components/users/UsersExplorer";
import { fetchUsers } from "@/services/users";

export const dynamic = "force-dynamic";

const fallbackPayload = {
  users: [],
  pagination: null,
};

export default async function UsersPage({ searchParams }) {
  const resolvedParams = (await searchParams) ?? {};
  const { q = "", sort = "", direction = "" } = resolvedParams;

  let payload = fallbackPayload;
  let isError = false;

  try {
    const response = await fetchUsers({ q, sort, direction });
    payload = {
      users: response?.users ?? [],
      pagination: response?.pagination ?? null,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs", error);
    isError = true;
  }

  return (
    <section className="p-6 lg:p-8 space-y-6 h-[calc(100vh-100px)] overflow-y-auto">
      <UsersExplorer
        users={payload.users}
        pagination={payload.pagination}
        query={{ q, sort, direction }}
        isError={isError}
      />
    </section>
  );
}
