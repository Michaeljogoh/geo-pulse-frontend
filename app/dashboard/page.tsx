import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Dashboard } from "@/components/billing-dashboard";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Geo Pulse dashboard overview.",
};

export default function DashboardPage() {
	return (
		<AppShell>
			<Dashboard />
		</AppShell>
	);
}
