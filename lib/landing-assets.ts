export type CryptoAsset = {
	id: string;
	symbol: string;
	name: string;
	/** Local path under /public */
	image: string;
};

export type ProviderAsset = {
	id: string;
	name: string;
	role: string;
	logo: string;
};

/** High-res CoinGecko logos cached in /public/landing/crypto */
export const CRYPTO_ASSETS: CryptoAsset[] = [
	{ id: "bitcoin", symbol: "BTC", name: "Bitcoin", image: "/landing/crypto/btc.png" },
	{ id: "ethereum", symbol: "ETH", name: "Ethereum", image: "/landing/crypto/eth.png" },
	{ id: "solana", symbol: "SOL", name: "Solana", image: "/landing/crypto/sol.png" },
	{ id: "binancecoin", symbol: "BNB", name: "BNB", image: "/landing/crypto/bnb.png" },
	{ id: "ripple", symbol: "XRP", name: "XRP", image: "/landing/crypto/xrp.png" },
	{ id: "tether", symbol: "USDT", name: "Tether", image: "/landing/crypto/usdt.png" },
	{ id: "dogwifcoin", symbol: "WIF", name: "dogwifhat", image: "/landing/crypto/wif.png" },
	{ id: "pepe", symbol: "PEPE", name: "Pepe", image: "/landing/crypto/pepe.png" },
	{ id: "bonk", symbol: "BONK", name: "Bonk", image: "/landing/crypto/bonk.png" },
	{ id: "render-token", symbol: "RENDER", name: "Render", image: "/landing/crypto/render.png" },
];

export const MARKET_PREVIEW = [
	{
		...CRYPTO_ASSETS[0],
		price: "$97,240",
		change: "+2.14%",
		up: true,
	},
	{
		...CRYPTO_ASSETS[1],
		price: "$3,412",
		change: "-0.38%",
		up: false,
	},
	{
		...CRYPTO_ASSETS[2],
		price: "$178.20",
		change: "+5.71%",
		up: true,
	},
] as const;

export const TRENDING_PREVIEW = CRYPTO_ASSETS.slice(6, 10);

export const LANDING_IMAGES = {
	dashboard: "/landing/geopulse-dashboard-mock.png",
	dashboardUi: "/landing/dashboard-preview.png",
	network: "/landing/geopulse-hero-network.png",
} as const;

export const PROVIDER_ASSETS: ProviderAsset[] = [
	{
		id: "coingecko",
		name: "CoinGecko",
		role: "Live prices",
		logo: "/integrations/coingecko.svg",
	},
	{
		id: "ip-api",
		name: "ip-api",
		role: "Location",
		logo: "/integrations/ip-api.svg",
	},
	{
		id: "ipwho",
		name: "ipwho.is",
		role: "Backup location",
		logo: "/integrations/ipwho.svg",
	},
	{
		id: "cryptocompare",
		name: "CryptoCompare",
		role: "Crypto news",
		logo: "/integrations/cryptocompare.svg",
	},
	{
		id: "gnews",
		name: "GNews",
		role: "Local headlines",
		logo: "/integrations/gnews.svg",
	},
	{
		id: "firebase",
		name: "Firebase",
		role: "Secure accounts",
		logo: "/integrations/firebase.svg",
	},
	{
		id: "firestore",
		name: "Firestore",
		role: "Saved watchlists",
		logo: "/integrations/firestore.svg",
	},
];

export function cryptoBySymbol(symbol: string) {
	return CRYPTO_ASSETS.find(
		(coin) => coin.symbol.toLowerCase() === symbol.toLowerCase()
	);
}
