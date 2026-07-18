'use client';

import {
	ActivityIcon,
	GlobeIcon,
	LineChartIcon,
	NewspaperIcon,
	ShieldCheckIcon,
	StarIcon,
	TrendingUpIcon,
	WifiIcon,
} from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useEffectiveCurrency } from '@/hooks/useEffectiveCurrency';
import { useGeo } from '@/hooks/useGeo';
import { useMarket } from '@/hooks/useMarket';
import { useNews } from '@/hooks/useNews';
import { useStatus } from '@/hooks/useStatus';
import { useTrending } from '@/hooks/useTrending';
import { useWatchlist } from '@/hooks/useWatchlist';
import { MARKET_LIMIT } from '@/config/constants';
import { displayValue, networkTypeLabel } from '@/lib/display';
import {
	formatCurrency,
	formatHitRatio,
	formatPercent,
	formatUptime,
} from '@/lib/format';
import { deriveLocale } from '@/lib/locale';
import type { SummaryMetric } from '@/components/dashboard/page-shell';

function MetricValueSkeleton({ className }: { className?: string }) {
	return <Skeleton className={className ?? 'h-7 w-24'} aria-hidden />;
}

function MetricHintSkeleton() {
	return <Skeleton className="h-3 w-32" aria-hidden />;
}

export function useOverviewMetrics(): SummaryMetric[] {
	const { data: geo, isLoading: geoLoading } = useGeo();
	const vs = useEffectiveCurrency(geo?.currency);
	const { data: market, isLoading: marketLoading } = useMarket(
		vs,
		MARKET_LIMIT
	);
	const { data: trending, isLoading: trendingLoading } = useTrending(vs);
	const { data: news, isLoading: newsLoading } = useNews({
		country: geo?.countryCode ?? undefined,
	});
	const { status } = useAuth();
	const { data: watchlist, isLoading: watchlistLoading } = useWatchlist(vs);
	const locale = deriveLocale(geo?.countryCode, geo?.timezone);
	const top = market?.[0];

	const fourthLoading =
		status === 'loading' ||
		(status === 'authed' ? watchlistLoading : newsLoading);

	return [
		{
			label: 'Location',
			value: geoLoading ? (
				<MetricValueSkeleton />
			) : (
				displayValue(geo?.city ?? geo?.country, 'Unknown')
			),
			hint: geoLoading ? (
				<MetricHintSkeleton />
			) : (
				`${displayValue(geo?.countryCode, '—')} · ${vs}`
			),
			icon: <GlobeIcon />,
			tone: 'brand',
		},
		{
			label: 'Top coin',
			value: marketLoading ? (
				<MetricValueSkeleton className="h-7 w-28" />
			) : top ? (
				formatCurrency(top.currentPrice, top.currency, locale)
			) : (
				'—'
			),
			hint: marketLoading ? (
				<MetricHintSkeleton />
			) : top ? (
				`${top.symbol} · 24h ${formatPercent(top.priceChangePct24h ?? 0)}`
			) : (
				'Market unavailable'
			),
			icon: <LineChartIcon />,
			tone:
				marketLoading || top?.priceChangePct24h == null
					? 'default'
					: top.priceChangePct24h >= 0
						? 'gain'
						: 'loss',
		},
		{
			label: 'Trending',
			value: trendingLoading ? (
				<MetricValueSkeleton className="h-7 w-16" />
			) : (
				String(trending?.trending.length ?? '—')
			),
			hint: trendingLoading ? (
				<MetricHintSkeleton />
			) : (
				`${trending?.gainers.length ?? 0} gainers · ${trending?.losers.length ?? 0} losers`
			),
			icon: <TrendingUpIcon />,
		},
		{
			label: status === 'authed' ? 'Watchlist' : 'News',
			value: fourthLoading ? (
				<MetricValueSkeleton className="h-7 w-16" />
			) : status === 'authed' ? (
				String(watchlist?.length ?? 0)
			) : (
				String(news?.length ?? '—')
			),
			hint: fourthLoading ? (
				<MetricHintSkeleton />
			) : status === 'authed' ? (
				'Coins saved to your account'
			) : (
				'Headlines for your region'
			),
			icon: status === 'authed' ? <StarIcon /> : <NewspaperIcon />,
		},
	];
}

export function useVisitorMetrics(): SummaryMetric[] {
	const { data: geo, meta, isLoading } = useGeo();

	return [
		{
			label: 'Country',
			value: isLoading ? (
				<MetricValueSkeleton />
			) : (
				displayValue(geo?.country, 'Unknown')
			),
			hint: isLoading ? (
				<MetricHintSkeleton />
			) : geo?.city ? (
				displayValue(geo.city)
			) : (
				'Unknown city'
			),
			icon: <GlobeIcon />,
			tone: 'brand',
		},
		{
			label: 'Network',
			value: isLoading ? (
				<MetricValueSkeleton />
			) : geo?.networkType ? (
				networkTypeLabel(geo.networkType)
			) : (
				'Unknown'
			),
			hint: isLoading ? (
				<MetricHintSkeleton />
			) : geo?.isp ? (
				displayValue(geo.isp)
			) : (
				'ISP unavailable'
			),
			icon: <WifiIcon />,
		},
		{
			label: 'Currency',
			value: isLoading ? (
				<MetricValueSkeleton className="h-7 w-16" />
			) : (
				displayValue(geo?.currency, '—')
			),
			hint: isLoading ? (
				<MetricHintSkeleton />
			) : geo?.timezone ? (
				displayValue(geo.timezone)
			) : (
				'Unknown timezone'
			),
			icon: <LineChartIcon />,
		},
		{
			label: 'Confidence',
			value: isLoading ? (
				<MetricValueSkeleton className="h-7 w-16" />
			) : geo?.confidence != null ? (
				`${Math.round(geo.confidence * 100)}%`
			) : (
				'—'
			),
			hint: isLoading ? (
				<MetricHintSkeleton />
			) : meta?.source ? (
				`Source · ${meta.source}`
			) : (
				'IP intelligence'
			),
			icon: <ShieldCheckIcon />,
			tone: 'brand',
		},
	];
}

export function useMarketMetrics(): SummaryMetric[] {
	const { data: geo, isLoading: geoLoading } = useGeo();
	const vs = useEffectiveCurrency(geo?.currency);
	const {
		data: market,
		meta,
		isLoading: marketLoading,
		isFetching,
	} = useMarket(vs, MARKET_LIMIT);
	const locale = deriveLocale(geo?.countryCode, geo?.timezone);
	const top = market?.[0];
	const avgChange =
		market && market.length > 0
			? market.reduce((sum, c) => sum + (c.priceChangePct24h ?? 0), 0) /
				market.length
			: null;

	return [
		{
			label: 'Currency',
			value: geoLoading ? <MetricValueSkeleton className="h-7 w-14" /> : vs,
			hint: geoLoading ? (
				<MetricHintSkeleton />
			) : isFetching && !marketLoading ? (
				'Refreshing…'
			) : (
				'Effective display currency'
			),
			icon: <LineChartIcon />,
			tone: 'brand',
		},
		{
			label: 'Leader',
			value: marketLoading ? (
				<MetricValueSkeleton className="h-7 w-16" />
			) : (
				(top?.symbol ?? '—')
			),
			hint: marketLoading ? (
				<MetricHintSkeleton />
			) : top ? (
				formatCurrency(top.currentPrice, top.currency, locale)
			) : (
				'Market unavailable'
			),
			icon: <TrendingUpIcon />,
		},
		{
			label: 'Avg 24h',
			value: marketLoading ? (
				<MetricValueSkeleton className="h-7 w-16" />
			) : avgChange == null ? (
				'—'
			) : (
				formatPercent(avgChange)
			),
			hint: marketLoading ? (
				<MetricHintSkeleton />
			) : (
				`${market?.length ?? 0} coins in view`
			),
			tone:
				marketLoading || avgChange == null
					? 'default'
					: avgChange >= 0
						? 'gain'
						: 'loss',
			icon: <ActivityIcon />,
		},
		{
			label: 'Feed',
			value: marketLoading ? (
				<MetricValueSkeleton className="h-7 w-16" />
			) : (
				(meta?.source ?? '—')
			),
			hint: marketLoading ? (
				<MetricHintSkeleton />
			) : meta?.latencyMs != null ? (
				`${Math.round(meta.latencyMs)} ms`
			) : (
				'Provider latency'
			),
			icon: <ShieldCheckIcon />,
		},
	];
}

export function useWatchlistMetrics(): SummaryMetric[] {
	const { status } = useAuth();
	const { data: geo } = useGeo();
	const vs = useEffectiveCurrency(geo?.currency);
	const { data, isLoading } = useWatchlist(vs);
	const authLoading = status === 'loading';
	const listLoading = authLoading || (status === 'authed' && isLoading);
	const available = data?.filter((i) => i.available).length ?? 0;
	const unavailable = (data?.length ?? 0) - available;

	return [
		{
			label: 'Status',
			value: authLoading ? (
				<MetricValueSkeleton className="h-7 w-20" />
			) : status === 'authed' ? (
				'Signed in'
			) : (
				'Guest'
			),
			hint: authLoading ? (
				<MetricHintSkeleton />
			) : status === 'authed' ? (
				'Watchlist synced to your account'
			) : (
				'Sign in to track coins'
			),
			icon: <StarIcon />,
			tone: status === 'authed' ? 'brand' : 'default',
		},
		{
			label: 'Tracked',
			value: listLoading ? (
				<MetricValueSkeleton className="h-7 w-12" />
			) : (
				String(data?.length ?? 0)
			),
			hint: listLoading ? <MetricHintSkeleton /> : `Cap · 50 · ${vs}`,
			icon: <LineChartIcon />,
		},
		{
			label: 'Priced',
			value: listLoading ? (
				<MetricValueSkeleton className="h-7 w-12" />
			) : (
				String(available)
			),
			hint: listLoading ? <MetricHintSkeleton /> : 'Live quotes available',
			tone: listLoading ? 'default' : 'gain',
			icon: <TrendingUpIcon />,
		},
		{
			label: 'Unavailable',
			value: listLoading ? (
				<MetricValueSkeleton className="h-7 w-12" />
			) : (
				String(Math.max(unavailable, 0))
			),
			hint: listLoading ? (
				<MetricHintSkeleton />
			) : (
				'Never fabricate missing prices'
			),
			tone: !listLoading && unavailable > 0 ? 'loss' : 'default',
			icon: <ShieldCheckIcon />,
		},
	];
}

export function useTrendingMetrics(): SummaryMetric[] {
	const { data: geo } = useGeo();
	const vs = useEffectiveCurrency(geo?.currency);
	const { data, meta, isLoading } = useTrending(vs);
	const topGainer = data?.gainers[0];
	const topLoser = data?.losers[0];

	return [
		{
			label: 'Trending',
			value: isLoading ? (
				<MetricValueSkeleton className="h-7 w-12" />
			) : (
				String(data?.trending.length ?? '—')
			),
			hint: isLoading ? (
				<MetricHintSkeleton />
			) : (
				'Coins catching attention'
			),
			icon: <TrendingUpIcon />,
			tone: 'brand',
		},
		{
			label: 'Top gainer',
			value: isLoading ? (
				<MetricValueSkeleton className="h-7 w-16" />
			) : (
				(topGainer?.symbol ?? '—')
			),
			hint: isLoading ? (
				<MetricHintSkeleton />
			) : topGainer?.priceChangePct24h != null ? (
				formatPercent(topGainer.priceChangePct24h)
			) : (
				'No gainer yet'
			),
			tone: 'gain',
			icon: <ActivityIcon />,
		},
		{
			label: 'Top loser',
			value: isLoading ? (
				<MetricValueSkeleton className="h-7 w-16" />
			) : (
				(topLoser?.symbol ?? '—')
			),
			hint: isLoading ? (
				<MetricHintSkeleton />
			) : topLoser?.priceChangePct24h != null ? (
				formatPercent(topLoser.priceChangePct24h)
			) : (
				'No loser yet'
			),
			tone: 'loss',
			icon: <ActivityIcon />,
		},
		{
			label: 'Source',
			value: isLoading ? (
				<MetricValueSkeleton className="h-7 w-16" />
			) : (
				(meta?.provider ?? meta?.source ?? '—')
			),
			hint: isLoading ? <MetricHintSkeleton /> : vs,
			icon: <ShieldCheckIcon />,
		},
	];
}

export function useNewsMetrics(): SummaryMetric[] {
	const { data: geo, isLoading: geoLoading } = useGeo();
	const { data, meta, isLoading: newsLoading } = useNews({
		country: geo?.countryCode ?? undefined,
	});
	const withSentiment =
		data?.filter((n) => n.sentiment != null).length ?? 0;

	return [
		{
			label: 'Region',
			value: geoLoading ? (
				<MetricValueSkeleton className="h-7 w-14" />
			) : geo?.countryCode ? (
				displayValue(geo.countryCode)
			) : (
				'Global'
			),
			hint: geoLoading ? (
				<MetricHintSkeleton />
			) : geo?.country ? (
				displayValue(geo.country)
			) : (
				'Worldwide feed'
			),
			icon: <GlobeIcon />,
			tone: 'brand',
		},
		{
			label: 'Headlines',
			value: newsLoading ? (
				<MetricValueSkeleton className="h-7 w-12" />
			) : (
				String(data?.length ?? '—')
			),
			hint: newsLoading ? (
				<MetricHintSkeleton />
			) : (
				'Localized crypto news'
			),
			icon: <NewspaperIcon />,
		},
		{
			label: 'Sentiment',
			value: newsLoading ? (
				<MetricValueSkeleton className="h-7 w-12" />
			) : (
				String(withSentiment)
			),
			hint: newsLoading ? (
				<MetricHintSkeleton />
			) : (
				'Articles with tone tags'
			),
			icon: <ActivityIcon />,
		},
		{
			label: 'Provider',
			value: newsLoading ? (
				<MetricValueSkeleton className="h-7 w-20" />
			) : (
				(meta?.provider ?? '—')
			),
			hint: newsLoading ? (
				<MetricHintSkeleton />
			) : (
				(meta?.source ?? 'News feed')
			),
			icon: <ShieldCheckIcon />,
		},
	];
}

export function useHealthMetrics(): SummaryMetric[] {
	const { data, meta, isLoading } = useStatus();
	const degraded =
		data?.providers.filter((p) => p.state !== 'closed').length ?? 0;
	const healthy =
		data?.providers.filter((p) => p.state === 'closed').length ?? 0;

	return [
		{
			label: 'Providers',
			value: isLoading ? (
				<MetricValueSkeleton className="h-7 w-12" />
			) : (
				String(data?.providers.length ?? '—')
			),
			hint: isLoading ? (
				<MetricHintSkeleton />
			) : (
				`${healthy} healthy · ${degraded} degraded`
			),
			icon: <ActivityIcon />,
			tone: isLoading ? 'default' : degraded > 0 ? 'loss' : 'gain',
		},
		{
			label: 'Uptime',
			value: isLoading ? (
				<MetricValueSkeleton className="h-7 w-20" />
			) : data?.uptimeSeconds != null ? (
				formatUptime(data.uptimeSeconds)
			) : (
				'—'
			),
			hint: isLoading ? <MetricHintSkeleton /> : 'Process uptime',
			icon: <ShieldCheckIcon />,
			tone: 'brand',
		},
		{
			label: 'Cache hit',
			value: isLoading ? (
				<MetricValueSkeleton className="h-7 w-16" />
			) : data?.cache.hitRatio != null ? (
				formatHitRatio(data.cache.hitRatio)
			) : (
				'—'
			),
			hint: isLoading ? (
				<MetricHintSkeleton />
			) : (
				`${data?.cache.l1Keys ?? 0} L1 keys`
			),
			icon: <LineChartIcon />,
		},
		{
			label: 'Status feed',
			value: isLoading ? (
				<MetricValueSkeleton className="h-7 w-14" />
			) : (
				(meta?.source ?? 'live')
			),
			hint: isLoading ? (
				<MetricHintSkeleton />
			) : meta?.latencyMs != null ? (
				`${Math.round(meta.latencyMs)} ms`
			) : (
				'Auto-refresh enabled'
			),
			icon: <WifiIcon />,
		},
	];
}
