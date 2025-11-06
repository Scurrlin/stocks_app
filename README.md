# Signalist
A [stock market analysis app](https://stocks-app-s2l1.onrender.com/) that lets users create custom watchlists for better informed trading decisions. Built with NextJS, Tailwind CSS, TypeScript, MongoDB, TradingView, and Finnhub.

![banner_image](public/assets/images/dashboard.png)

## Running with Docker

### Build the image
```bash
docker build -t stocks-app .
```

### Run the container
```bash
docker run -p 3000:3000 --env-file .env stocks-app
```

Access the app at `http://localhost:3000`

### Environment Variables
Ensure your `.env` file includes:
- `MONGODB_URI` - MongoDB connection string
- `NEXT_PUBLIC_FINNHUB_API_KEY` - Finnhub public API key
- `FINNHUB_BASE_URL` - Finnhub base URL
- `BETTER_AUTH_SECRET` - Better Auth secret
- `BETTER_AUTH_URL` - Better Auth URL

## Technologies Used
* NextJS
* Tailwind CSS
* TypeScript
* MongoDB
* TradingView
* Finnhub API
* Docker