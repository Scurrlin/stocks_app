'use client';

import WatchlistCard from './WatchlistCard';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { removeFromWatchlist } from '@/lib/actions/watchlist.actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface WatchlistProps {
  initialStocks: StockWithData[];
  userId: string;
  showViewAll?: boolean;
  maxItems?: number;
}

const Watchlist = ({ initialStocks, userId, showViewAll = true, maxItems }: WatchlistProps) => {
  const [stocks, setStocks] = useState(initialStocks);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const displayStocks = maxItems ? stocks.slice(0, maxItems) : stocks;

  const handleRemove = async (symbol: string) => {
    // Optimistic update
    setStocks(prev => prev.filter(s => s.symbol !== symbol));

    const result = await removeFromWatchlist(userId, symbol);

    if (result.success) {
      toast.success('Removed from watchlist');
      // Refresh the page data
      startTransition(() => {
        router.refresh();
      });
    } else {
      // Revert on error
      setStocks(initialStocks);
      toast.error(result.error || 'Failed to remove from watchlist');
    }
  };

  if (stocks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white mb-2">
            Your watchlist is empty
          </h3>
          <p className="text-gray-400">
            Search for stocks and add them to your watchlist to track their performance
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Your Watchlist</h2>
        {showViewAll && stocks.length > (maxItems || 0) && (
          <Link
            href="/watchlist"
            className="text-yellow-500 hover:text-yellow-400 transition-colors text-sm font-medium"
          >
            View all
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayStocks.map((stock) => (
          <WatchlistCard
            key={stock.symbol}
            stock={stock}
            onRemove={handleRemove}
            showStar={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Watchlist;

