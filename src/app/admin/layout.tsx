'use client';
import { useAuth } from '@/lib/hooks/use-auth';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children } : { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div>Carregando...</div>;

    if (user?.role !== 'admin') {
        redirect('/');
    }
    return <>{children}</>;
}