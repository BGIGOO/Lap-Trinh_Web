import { redirect } from "next/navigation";

export default function AdminEntry() {
  // Khi người dùng truy cập /admin123 -> tự động redirect đến /admin/login
  redirect("/admin123/login");
}