import { JWT } from 'google-auth-library';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';

const getAuthClient = () => {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  // Vercel env vars might escape newlines or wrap in quotes
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ?.replace(/\\n/g, '\n')
    .replace(/^"|"$/g, '');

  if (!clientEmail || !privateKey) {
    throw new Error('Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY environment variables');
  }

  return new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/analytics.readonly"
    ],
  });
};

export const getGA4Client = () => {
  const authClient = getAuthClient();
  return new BetaAnalyticsDataClient({
    authClient,
  });
};

export const getSheetsClient = async () => {
  const authClient = getAuthClient();
  return google.sheets({ version: 'v4', auth: authClient });
};
