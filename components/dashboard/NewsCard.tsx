'use client';

import Image from 'next/image';
import { memo } from 'react';

import { ExternalLink } from '@/components/common/ExternalLink';
import { Badge } from '@/components/ui/badge';
import { displayValue } from '@/lib/display';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { NewsItem } from '@/types/domain';

function SentimentBadge({
	sentiment,
}: {
	sentiment: NonNullable<NewsItem['sentiment']>;
}) {
	const tone =
		sentiment === 'positive'
			? 'border-transparent bg-gain-bg text-gain'
			: sentiment === 'negative'
				? 'border-transparent bg-loss-bg text-loss'
				: 'border-border bg-muted text-muted-foreground';

	return (
		<Badge variant="outline" className={cn('capitalize', tone)}>
			{sentiment}
		</Badge>
	);
}

/** Phase 9 / 13 / Section 11 — news card with next/image + safe external links. */
export const NewsCard = memo(function NewsCard({ item }: { item: NewsItem }) {
	return (
		<article
			className="flex min-w-0 flex-col gap-2 py-1"
			data-slot="news-card"
		>
			{item.imageUrl ? (
				<Image
					src={item.imageUrl}
					alt={`Illustration for ${item.title}`}
					width={320}
					height={160}
					className="aspect-[2/1] w-full object-cover bg-muted"
					unoptimized
				/>
			) : null}

			<div className="min-w-0 space-y-1.5">
				<ExternalLink
					href={item.url}
					className="text-sm font-medium text-foreground underline-offset-2 hover:underline focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:outline-none"
				>
					{item.title}
				</ExternalLink>

				<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
					<span>{displayValue(item.source, 'Unknown')}</span>
					<span aria-hidden>·</span>
					<time dateTime={item.publishedAt}>
						{formatRelativeTime(item.publishedAt)}
					</time>
					{item.sentiment ? (
						<SentimentBadge sentiment={item.sentiment} />
					) : null}
				</div>
			</div>
		</article>
	);
});
