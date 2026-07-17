'use client';

import { useSyncExternalStore } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

function useIsClient() {
	return useSyncExternalStore(
		() => () => {},
		() => true,
		() => false
	);
}

/** Theme toggle for dashboard header controls. */
export function ThemeToggleButton({
	className,
}: {
	className?: string;
}) {
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useIsClient();

	return (
		<Button
			type="button"
			size="icon-sm"
			variant="outline"
			className={className}
			aria-label="Toggle theme"
			onClick={() =>
				setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
			}
		>
			{mounted && resolvedTheme === 'dark' ? (
				<SunIcon />
			) : (
				<MoonIcon />
			)}
		</Button>
	);
}
