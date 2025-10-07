import { redirect } from 'next/navigation';
export default function AdminIndex() {
  redirect('/admin123/login');
  return null;
}