import { cn } from '@/lib/utils';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SkipToContent } from '@/components/common/SkipToContent';

/** Phase 13 — landmarks: skip link, complementary nav, main. */
export function AppShell({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider className={cn('[--app-wrapper-max-width:80rem]')}>
			<SkipToContent />
			<AppSidebar />
			<SidebarInset>
				<AppHeader />
				<main
					id="main-content"
					tabIndex={-1}
					className={cn(
						'flex flex-1 flex-col p-4 md:p-6',
						'mx-auto w-full max-w-(--app-wrapper-max-width)',
						'outline-none'
					)}
				>
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
