import Link from 'next/link';
import { Button } from '@/components/ui/button';

/** App-level 404 page. */
export default function NotFound() {
	return (
		<main
			className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center"
			data-slot="not-found"
		>
			<h1 className="font-heading text-heading-xl">Page not found</h1>
			<p className="text-muted-foreground max-w-md text-body-md">
				The page you requested does not exist.
			</p>
			<Button render={<Link href="/" />} nativeButton={false}>
				Go home
			</Button>
		</main>
	);
}
