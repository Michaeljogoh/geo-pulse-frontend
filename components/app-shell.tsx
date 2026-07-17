import { cn } from '@/lib/utils';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SkipToContent } from '@/components/common/SkipToContent';

/**
 * Landmarks: skip link, complementary nav, main.
 * Main fills SidebarInset so content expands when the sidebar collapses.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<SkipToContent />
			<AppSidebar />
			<SidebarInset className="min-w-0">
				<AppHeader />
				<main
					id="main-content"
					tabIndex={-1}
					className={cn(
						'flex w-full min-w-0 flex-1 flex-col p-4 md:p-6',
						'outline-none'
					)}
				>
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
