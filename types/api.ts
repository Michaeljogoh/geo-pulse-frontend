/**
 * Backend API contract consumed by the frontend.
 * Base: `${NEXT_PUBLIC_API_BASE_URL}` — paths below are absolute from that origin.
 *
 * Strategy:
 * - Initial load → GET /api/dashboard (one personalized payload + degraded/section meta)
 * - Auto-refresh → GET /api/market, GET /api/status (granular; do not refetch whole dashboard)
 *
 * Authenticated routes require `Authorization: Bearer <Firebase ID token>`.
 */

import type {
  AuthUser,
  Coin,
  DashboardPayload,
  HealthResponse,
  IpIntelligence,
  NewsItem,
  StatusPayload,
  TrendingResult,
  WatchlistItem,
} from '@/types/domain';
import type { ApiResponse } from '@/types/envelope';

/** Public endpoints (no auth). */
export type PublicEndpoints = {
  'GET /api/geo': {
    query: { ip?: string };
    response: ApiResponse<IpIntelligence>;
  };
  'GET /api/market': {
    query: { vs?: string; limit?: number };
    response: ApiResponse<Coin[]>;
  };
  'GET /api/trending': {
    query: { vs?: string };
    response: ApiResponse<TrendingResult>;
  };
  'GET /api/news': {
    query: { country?: string; symbols?: string; lang?: string };
    response: ApiResponse<NewsItem[]>;
  };
  'GET /api/dashboard': {
    query: { ip?: string };
    response: ApiResponse<DashboardPayload>;
  };
  'GET /api/status': {
    query: Record<string, never>;
    response: ApiResponse<StatusPayload>;
  };
  /** No envelope. */
  'GET /health': {
    query: Record<string, never>;
    response: HealthResponse;
  };
};

/** Authenticated endpoints. */
export type AuthedEndpoints = {
  'GET /api/me': {
    query: Record<string, never>;
    response: ApiResponse<AuthUser>;
  };
  'GET /api/watchlist': {
    query: { vs?: string };
    response: ApiResponse<WatchlistItem[]>;
  };
  'PUT /api/watchlist/:coinId': {
    params: { coinId: string };
    response: ApiResponse<WatchlistItem[]>;
  };
  'DELETE /api/watchlist/:coinId': {
    params: { coinId: string };
    response: ApiResponse<WatchlistItem[]>;
  };
};

export type ApiEndpoints = PublicEndpoints & AuthedEndpoints;
