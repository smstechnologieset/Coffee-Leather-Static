import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import AccountClient from './AccountClient';

const ADMIN_EMAIL = 'admin@mixed.com';

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const user = session.user;
  const name = user.user_metadata?.full_name ?? user.email ?? '';
  const email = user.email ?? '';
  const isAdmin = email === ADMIN_EMAIL;

  return (
    <AccountClient
      initialEmail={email}
      initialName={name}
      userId={user.id}
      isAdmin={isAdmin}
    />
  );
}
