import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("qusay_admin_session")?.value;

  if (adminSession !== "true") {
    redirect("/admin/login");
  }

  return children;
}
