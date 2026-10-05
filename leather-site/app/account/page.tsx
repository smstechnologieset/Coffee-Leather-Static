import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import AccountClient from './AccountClient';

const ADMIN_EMAIL = 'admin@mixed.com';

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const name = user.user_metadata?.full_name ?? user.email ?? '';
  const email = user.email ?? '';
  let isAdmin = email.toLowerCase() === ADMIN_EMAIL;

  // Check public.staff table in Supabase
  const { data: staffMember } = await supabase
    .from('staff')
    .select('role')
    .eq('id', user.id)
    .single();

  if (staffMember && (staffMember.role === 'admin' || staffMember.role === 'staff')) {
    isAdmin = true;
  }

  return (
    <AccountClient
      initialEmail={email}
      initialName={name}
      userId={user.id}
      isAdmin={isAdmin}
    />
  );
}
