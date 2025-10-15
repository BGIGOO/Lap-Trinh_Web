import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminIndex() {
  const store = await cookies();                       // 👈 phải await
  const name = process.env.SESSION_COOKIE_NAME || "token";
  const hasToken = !!store.get(name)?.value;

  redirect(hasToken ? "/employee/dashboard" : "/employee/login");
}
