import Aside from "../../components/Aside";
import DashboardHeader from "../../components/DashboardHeader";
import { getSession } from "@/utils/session";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }) {
  const { token } = await getSession();

  if (!token) {
    redirect("/login");
  }

  return (
    <div>
      <DashboardHeader />
      <div className="flex bg-gray-50 ">
        <Aside />
        <main className="flex-1  over relative" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
