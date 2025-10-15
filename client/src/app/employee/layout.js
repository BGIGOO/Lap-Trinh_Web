"use client";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const onLogin = pathname?.startsWith("/employee/login");

  if (onLogin) return <>{children}</>;

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-slate-100 border-r p-4">Employee Sidebar</aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}