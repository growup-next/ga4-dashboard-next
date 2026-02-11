# GA4 Analysis Dashboard

AI-powered GA4 analytics dashboard for executives.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19** + **Tailwind CSS**
- **Recharts** for data visualization
- **GA4 Data API** for analytics data
- **Google Sheets API** for property management

## Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_EMAIL` | Service account email |
| `GOOGLE_PRIVATE_KEY` | Service account private key |
| `GOOGLE_SHEET_URL` | Spreadsheet URL for property ID lookup |

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.
