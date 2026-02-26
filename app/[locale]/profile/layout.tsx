'use client';

import { AuthProvider } from '@/components/providers/auth-provider';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
