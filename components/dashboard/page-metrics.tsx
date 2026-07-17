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

export function useOverviewMetrics(): SummaryMetric[] {
	const { data: geo } = useGeo();
	const vs = useEffectiveCurrency(geo?.currency);
	const { data: market } = useMarket(vs, MARKET_LIMIT);
	const { data: trending } = useTrending(vs);
	const { data: news } = useNews({ country: geo?.countryCode ?? undefined });
	const { status } = useAuth();
	const { data: watchlist } = useWatchlist(vs);
	const locale = deriveLocale(geo?.countryCode, geo?.timezone);
	const top = market?.[0];

	return [
		{
			label: 'Location',
			value: displayValue(geo?.city ?? geo?.country, 'Unknown'),
			hint: `${displayValue(geo?.countryCode, '—')} · ${vs}`,
			icon: <GlobeIcon />,
			tone: 'brand',
		},
		{
			label: 'Top coin',
			value: top
				? formatCurrency(top.currentPrice, top.currency, locale)
				: '—',
			hint: top ? `${top.symbol} · 24h ${formatPercent(top.priceChangePct24h ?? 0)}` : 'Loading market',
			icon: <LineChartIcon />,
			tone:
				top?.priceChangePct24h == null
					? 'default'
					: top.priceChangePct24h >= 0
						? 'gain'
						: 'loss',
		},
		{
			label: 'Trending',
			value: String(trending?.trending.length ?? '—'),
			hint: `${trending?.gainers.length ?? 0} gainers · ${trending?.losers.length ?? 0} losers`,
			icon: <TrendingUpIcon />,
		},
		{
			label: status === 'authed' ? 'Watchlist' : 'News',
			value:
				status === 'authed'
					? String(watchlist?.length ?? 0)
					: String(news?.length ?? '—'),
			hint:
				status === 'authed'
					? 'Coins saved to your account'
					: 'Headlines for your region',
			icon: status === 'authed' ? <StarIcon /> : <NewspaperIcon />,
		},
	];
}

export function useVisitorMetrics(): SummaryMetric[] {
	const { data: geo, meta } = useGeo();

	return [
		{
			label: 'Country',
			value: displayValue(geo?.country, 'Unknown'),
			hint: geo?.city ? displayValue(geo.city) : 'Unknown city',
			icon: <GlobeIcon />,
			tone: 'brand',
		},
		{
			label: 'Network',
			value: geo?.networkType
				? networkTypeLabel(geo.networkType)
				: 'Unknown',
			hint: geo?.isp ? displayValue(geo.isp) : 'ISP unavailable',
			icon: <WifiIcon />,
		},
		{
			label: 'Currency',
			value: displayValue(geo?.currency, '—'),
			hint: geo?.timezone ? displayValue(geo.timezone) : 'Unknown timezone',
			icon: <LineChartIcon />,
		},
		{
			label: 'Confidence',
			value:
				geo?.confidence != null
					? `${Math.round(geo.confidence * 100)}%`
					: '—',
			hint: meta?.source ? `Source · ${meta.source}` : 'IP intelligence',
			icon: <ShieldCheckIcon />,
			tone: 'brand',
		},
	];
}

export function useMarketMetrics(): SummaryMetric[] {
	const { data: geo } = useGeo();
	const vs = useEffectiveCurrency(geo?.currency);
	const { data: market, meta, isFetching } = useMarket(vs, MARKET_LIMIT);
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
			value: vs,
			hint: isFetching ? 'Refreshing…' : 'Effective display currency',
			icon: <LineChartIcon />,
			tone: 'brand',
		},
		{
			label: 'Leader',
			value: top?.symbol ?? '—',
			hint: top
				? formatCurrency(top.currentPrice, top.currency, locale)
				: 'Waiting for market',
			icon: <TrendingUpIcon />,
		},
		{
			label: 'Avg 24h',
			value: avgChange == null ? '—' : formatPercent(avgChange),
			hint: `${market?.length ?? 0} coins in view`,
			tone:
				avgChange == null ? 'default' : avgChange >= 0 ? 'gain' : 'loss',
			icon: <ActivityIcon />,
		},
		{
			label: 'Feed',
			value: meta?.source ?? '—',
			hint:
				meta?.latencyMs != null
					? `${Math.round(meta.latencyMs)} ms`
					: 'Provider latency',
			icon: <ShieldCheckIcon />,
		},
	];
}

export function useWatchlistMetrics(): SummaryMetric[] {
	const { status } = useAuth();
	const { data: geo } = useGeo();
	const vs = useEffectiveCurrency(geo?.currency);
	const { data, isLoading } = useWatchlist(vs);
	const available = data?.filter((i) => i.available).length ?? 0;
	const unavailable = (data?.length ?? 0) - available;

	return [
		{
			label: 'Status',
			value: status === 'authed' ? 'Signed in' : 'Guest',
			hint:
				status === 'authed'
					? 'Watchlist synced to your account'
					: 'Sign in to track coins',
			icon: <StarIcon />,
			tone: status === 'authed' ? 'brand' : 'default',
		},
		{
			label: 'Tracked',
			value: isLoading ? '…' : String(data?.length ?? 0),
			hint: `Cap · 50 · ${vs}`,
			icon: <LineChartIcon />,
		},
		{
			label: 'Priced',
			value: String(available),
			hint: 'Live quotes available',
			tone: 'gain',
			icon: <TrendingUpIcon />,
		},
		{
			label: 'Unavailable',
			value: String(Math.max(unavailable, 0)),
			hint: 'Never fabricate missing prices',
			tone: unavailable > 0 ? 'loss' : 'default',
			icon: <ShieldCheckIcon />,
		},
	];
}

export function useTrendingMetrics(): SummaryMetric[] {
	const { data: geo } = useGeo();
	const vs = useEffectiveCurrency(geo?.currency);
	const { data, meta } = useTrending(vs);
	const topGainer = data?.gainers[0];
	const topLoser = data?.losers[0];

	return [
		{
			label: 'Trending',
			value: String(data?.trending.length ?? '—'),
			hint: 'Coins catching attention',
			icon: <TrendingUpIcon />,
			tone: 'brand',
		},
		{
			label: 'Top gainer',
			value: topGainer?.symbol ?? '—',
			hint:
				topGainer?.priceChangePct24h != null
					? formatPercent(topGainer.priceChangePct24h)
					: 'No gainer yet',
			tone: 'gain',
			icon: <ActivityIcon />,
		},
		{
			label: 'Top loser',
			value: topLoser?.symbol ?? '—',
			hint:
				topLoser?.priceChangePct24h != null
					? formatPercent(topLoser.priceChangePct24h)
					: 'No loser yet',
			tone: 'loss',
			icon: <ActivityIcon />,
		},
		{
			label: 'Source',
			value: meta?.provider ?? meta?.source ?? '—',
			hint: vs,
			icon: <ShieldCheckIcon />,
		},
	];
}

export function useNewsMetrics(): SummaryMetric[] {
	const { data: geo } = useGeo();
	const { data, meta } = useNews({
		country: geo?.countryCode ?? undefined,
	});
	const withSentiment =
		data?.filter((n) => n.sentiment != null).length ?? 0;

	return [
		{
			label: 'Region',
			value: geo?.countryCode ? displayValue(geo.countryCode) : 'Global',
			hint: geo?.country ? displayValue(geo.country) : 'Worldwide feed',
			icon: <GlobeIcon />,
			tone: 'brand',
		},
		{
			label: 'Headlines',
			value: String(data?.length ?? '—'),
			hint: 'Localized crypto news',
			icon: <NewspaperIcon />,
		},
		{
			label: 'Sentiment',
			value: String(withSentiment),
			hint: 'Articles with tone tags',
			icon: <ActivityIcon />,
		},
		{
			label: 'Provider',
			value: meta?.provider ?? '—',
			hint: meta?.source ?? 'News feed',
			icon: <ShieldCheckIcon />,
		},
	];
}

export function useHealthMetrics(): SummaryMetric[] {
	const { data, meta } = useStatus();
	const degraded =
		data?.providers.filter((p) => p.state !== 'closed').length ?? 0;
	const healthy =
		data?.providers.filter((p) => p.state === 'closed').length ?? 0;

	return [
		{
			label: 'Providers',
			value: String(data?.providers.length ?? '—'),
			hint: `${healthy} healthy · ${degraded} degraded`,
			icon: <ActivityIcon />,
			tone: degraded > 0 ? 'loss' : 'gain',
		},
		{
			label: 'Uptime',
			value:
				data?.uptimeSeconds != null
					? formatUptime(data.uptimeSeconds)
					: '—',
			hint: 'Process uptime',
			icon: <ShieldCheckIcon />,
			tone: 'brand',
		},
		{
			label: 'Cache hit',
			value:
				data?.cache.hitRatio != null
					? formatHitRatio(data.cache.hitRatio)
					: '—',
			hint: `${data?.cache.l1Keys ?? 0} L1 keys`,
			icon: <LineChartIcon />,
		},
		{
			label: 'Status feed',
			value: meta?.source ?? 'live',
			hint:
				meta?.latencyMs != null
					? `${Math.round(meta.latencyMs)} ms`
					: 'Auto-refresh enabled',
			icon: <WifiIcon />,
		},
	];
}
