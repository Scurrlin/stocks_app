'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { fetchJSON } from './finnhub.actions';

const FINNHUB_BASE_URL = process.env.FINNHUB_BASE_URL;
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? '';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function addToWatchlist(userId: string, symbol: string, company: string) {
  if (!userId || !symbol || !company) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    await connectToDatabase();

    const upperSymbol = symbol.toUpperCase().trim();
    const trimmedCompany = company.trim();

    // Check if already exists
    const existing = await Watchlist.findOne({ userId, symbol: upperSymbol });
    if (existing) {
      return { success: false, error: 'Stock already in watchlist' };
    }

    // Create new watchlist item
    await Watchlist.create({
      userId,
      symbol: upperSymbol,
      company: trimmedCompany,
      addedAt: new Date(),
    });

    return { success: true };
  } catch (err: unknown) {
    console.error('addToWatchlist error:', err);
    const error = err as { message?: string };
    return { success: false, error: error.message || 'Failed to add to watchlist' };
  }
}

export async function removeFromWatchlist(userId: string, symbol: string) {
  if (!userId || !symbol) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    await connectToDatabase();

    const upperSymbol = symbol.toUpperCase().trim();

    const result = await Watchlist.deleteOne({ userId, symbol: upperSymbol });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Stock not found in watchlist' };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('removeFromWatchlist error:', err);
    const error = err as { message?: string };
    return { success: false, error: error.message || 'Failed to remove from watchlist' };
  }
}

export async function getWatchlistWithData(email: string): Promise<StockWithData[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Get user
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    // Get watchlist items
    const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();
    if (!items || items.length === 0) return [];

    const token = process.env.FINNHUB_API_KEY ?? NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      console.error('FINNHUB API key not configured');
      return items.map(item => ({
        userId: item.userId,
        symbol: item.symbol,
        company: item.company,
        addedAt: item.addedAt,
      }));
    }

    // Fetch live data for each stock
    const enrichedStocks = await Promise.all(
      items.map(async (item) => {
        try {
          // Fetch quote data (current price and change) and profile (logo)
          const quoteUrl = `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(item.symbol)}&token=${token}`;
          const profileUrl = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${encodeURIComponent(item.symbol)}&token=${token}`;
          
          const [quote, profile] = await Promise.all([
            fetchJSON<QuoteData>(quoteUrl).catch(() => null),
            fetchJSON<ProfileData>(profileUrl).catch(() => null),
          ]);

          const currentPrice = quote?.c;
          const changePercent = quote?.dp;
          const logo = (profile as ProfileData & { logo?: string })?.logo || undefined;

          // Format the data
          const priceFormatted = currentPrice ? `$${currentPrice.toFixed(2)}` : undefined;
          const changeFormatted = changePercent !== undefined 
            ? `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%` 
            : undefined;

          return {
            userId: item.userId,
            symbol: item.symbol,
            company: item.company,
            addedAt: item.addedAt,
            currentPrice,
            changePercent,
            priceFormatted,
            changeFormatted,
            logo,
          };
        } catch (err) {
          console.error(`Error fetching data for ${item.symbol}:`, err);
          // Return basic data without live prices
          return {
            userId: item.userId,
            symbol: item.symbol,
            company: item.company,
            addedAt: item.addedAt,
          };
        }
      })
    );

    return enrichedStocks;
  } catch (err) {
    console.error('getWatchlistWithData error:', err);
    return [];
  }
}
