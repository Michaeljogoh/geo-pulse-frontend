import { AppShell } from '@/components/app-shell';
import { RequireAuth } from '@/components/auth/RequireAuth';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<RequireAuth>
			<AppShell>{children}</AppShell>
		</RequireAuth>
	);
}
