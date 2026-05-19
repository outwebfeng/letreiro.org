const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const vercelUrl = process.env.VERCEL_URL;

export const BASE_URL = siteUrl || (vercelUrl ? `https://${vercelUrl}` : 'https://letreiro.org');

export const { GOOGLE_TRACKING_ID, GOOGLE_ADSENSE_URL, GOOGLE_ADSENSE_ACCOUNT } = process.env as Record<string, string>;
