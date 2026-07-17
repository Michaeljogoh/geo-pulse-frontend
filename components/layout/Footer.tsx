import Link from 'next/link';
import { Container } from '@/components/layout/Container';

/** Phase 5 — minimal footer matching dashboard chrome. */
export function Footer() {
	return (
		<footer className="mt-auto border-t border-border py-4 text-muted-foreground text-xs">
			<Container className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<p>© {new Date().getFullYear()} GeoPulse</p>
				<nav className="flex gap-4">
					<Link href="/" className="hover:text-foreground">
						Home
					</Link>
					<Link href="/dashboard" className="hover:text-foreground">
						Dashboard
					</Link>
				</nav>
			</Container>
		</footer>
	);
}
