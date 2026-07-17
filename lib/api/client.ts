import type { ErrorCode, ResponseMeta } from '@/types/envelope';
import { responseMetaSchema } from '@/lib/api/schemas';

/** Client-only codes (not returned by the backend envelope). */
export type ApiClientErrorCode =
	| ErrorCode
	| 'INVALID_RESPONSE'
	| 'TIMEOUT'
	| 'NETWORK_ERROR';

export class ApiClientError extends Error {
	readonly code: ApiClientErrorCode;
	readonly requestId: string | null;
	readonly status: number | null;
	readonly details?: unknown;

	constructor(
		code: ApiClientErrorCode,
		message: string,
		options?: { requestId?: string | null; status?: number | null; details?: unknown }
	) {
		super(message);
		this.name = 'ApiClientError';
		this.code = code;
		this.requestId = options?.requestId ?? null;
		this.status = options?.status ?? null;
		this.details = options?.details;
	}
}

export type AuthTokenProvider = () => Promise<string | null> | string | null;

let authTokenProvider: AuthTokenProvider | null = null;

/** Injected by AuthProvider. Returns a fresh Firebase ID token or null. */
export function setAuthTokenProvider(provider: AuthTokenProvider | null): void {
	authTokenProvider = provider;
}

function getRequestTimeoutMs(): number {
	const raw = process.env.NEXT_PUBLIC_API_TIMEOUT_MS;
	const parsed = raw ? Number(raw) : 10_000;
	return Number.isFinite(parsed) && parsed > 0 ? parsed : 10_000;
}

type HttpMethod = 'GET' | 'PUT' | 'DELETE' | 'POST' | 'PATCH';

export type ApiRequestOptions = {
	params?: Record<string, string | number | boolean | null | undefined>;
	auth?: boolean;
	body?: unknown;
};

export type ApiSuccess<T> = {
	data: T;
	meta: ResponseMeta;
};

function getBaseUrl(): string {
	const base = process.env.NEXT_PUBLIC_API_BASE_URL;
	if (!base) {
		throw new ApiClientError(
			'INTERNAL',
			'NEXT_PUBLIC_API_BASE_URL is not configured'
		);
	}
	return base.replace(/\/$/, '');
}

function buildUrl(
	path: string,
	params?: ApiRequestOptions['params']
): string {
	const url = new URL(
		path.startsWith('/') ? path : `/${path}`,
		`${getBaseUrl()}/`
	);
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (value === undefined || value === null || value === '') continue;
			url.searchParams.set(key, String(value));
		}
	}
	return url.toString();
}

function isAbortError(error: unknown): boolean {
	if (typeof DOMException !== 'undefined' && error instanceof DOMException) {
		return error.name === 'AbortError';
	}
	if (error instanceof Error) {
		return (
			error.name === 'AbortError' || /aborted/i.test(error.message)
		);
	}
	return false;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Typed fetch against the GeoPulse API envelope.
 * Never call `fetch` from components — use `endpoints.ts` wrappers.
 */
export async function apiRequest<T>(
	method: HttpMethod,
	path: string,
	options: ApiRequestOptions = {}
): Promise<ApiSuccess<T>> {
	const { params, auth = false, body } = options;

	const headers: Record<string, string> = {
		Accept: 'application/json',
	};

	if (auth) {
		const token = authTokenProvider ? await authTokenProvider() : null;
		if (!token) {
			throw new ApiClientError(
				'UNAUTHENTICATED',
				'Authentication required',
				{ status: 401 }
			);
		}
		headers.Authorization = `Bearer ${token}`;
	}

	if (body !== undefined) {
		headers['Content-Type'] = 'application/json';
	}

	const timeoutMs = getRequestTimeoutMs();
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	let response: Response;
	try {
		response = await fetch(buildUrl(path, params), {
			method,
			headers,
			body: body === undefined ? undefined : JSON.stringify(body),
			signal: controller.signal,
		});
	} catch (error) {
		clearTimeout(timeoutId);
		if (isAbortError(error)) {
			throw new ApiClientError(
				'TIMEOUT',
				`Request timed out after ${timeoutMs}ms`,
				{ status: null }
			);
		}
		throw new ApiClientError(
			'NETWORK_ERROR',
			error instanceof Error ? error.message : 'Network request failed',
			{ status: null }
		);
	} finally {
		clearTimeout(timeoutId);
	}

	let payload: unknown;
	try {
		payload = await response.json();
	} catch {
		throw new ApiClientError(
			'INVALID_RESPONSE',
			'Response body is not valid JSON',
			{ status: response.status }
		);
	}

	if (!isRecord(payload)) {
		throw new ApiClientError(
			'INVALID_RESPONSE',
			'Response is not an API envelope object',
			{ status: response.status }
		);
	}

	const metaRaw = isRecord(payload.meta) ? payload.meta : null;
	const requestId =
		metaRaw && typeof metaRaw.requestId === 'string'
			? metaRaw.requestId
			: null;

	const envelopeError = isRecord(payload.error) ? payload.error : null;

	if (!response.ok || envelopeError) {
		const code =
			envelopeError && typeof envelopeError.code === 'string'
				? (envelopeError.code as ApiClientErrorCode)
				: 'INTERNAL';
		const message =
			envelopeError && typeof envelopeError.message === 'string'
				? envelopeError.message
				: `Request failed with status ${response.status}`;
		throw new ApiClientError(code, message, {
			requestId,
			status: response.status,
			details: envelopeError?.details,
		});
	}

	const metaParsed = responseMetaSchema.safeParse(payload.meta);
	if (!metaParsed.success) {
		throw new ApiClientError(
			'INVALID_RESPONSE',
			'Response meta failed schema validation',
			{
				status: response.status,
				requestId,
				details: metaParsed.error.flatten(),
			}
		);
	}

	return {
		data: payload.data as T,
		meta: metaParsed.data,
	};
}

export function apiGet<T>(
	path: string,
	options?: Omit<ApiRequestOptions, 'auth' | 'body'>
): Promise<ApiSuccess<T>> {
	return apiRequest<T>('GET', path, options);
}

export function apiGetAuth<T>(
	path: string,
	options?: Omit<ApiRequestOptions, 'auth' | 'body'>
): Promise<ApiSuccess<T>> {
	return apiRequest<T>('GET', path, { ...options, auth: true });
}

export function apiPutAuth<T>(
	path: string,
	options?: Omit<ApiRequestOptions, 'auth'>
): Promise<ApiSuccess<T>> {
	return apiRequest<T>('PUT', path, { ...options, auth: true });
}

export function apiDeleteAuth<T>(
	path: string,
	options?: Omit<ApiRequestOptions, 'auth' | 'body'>
): Promise<ApiSuccess<T>> {
	return apiRequest<T>('DELETE', path, { ...options, auth: true });
}
