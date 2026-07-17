import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "GeoPulse personalized crypto intelligence dashboard.",
};

export default function DashboardPage() {
	return (
		<AppShell>
			<Dashboard />
		</AppShell>
	);
}
