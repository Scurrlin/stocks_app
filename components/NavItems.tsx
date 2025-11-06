'use client'

import {NAV_ITEMS} from "@/lib/constants";
import Link from "next/link";
import {usePathname} from "next/navigation";
import SearchCommand from "@/components/SearchCommand";
import {DropdownMenuItem, DropdownMenuSeparator} from "@/components/ui/dropdown-menu";

const NavItems = ({initialStocks, isGuest = false, inDropdown = false}: { initialStocks: StockWithWatchlistStatus[], isGuest?: boolean, inDropdown?: boolean}) => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';

        return pathname.startsWith(path);
    }

    // Filter out watchlist for guests
    const navItems = isGuest 
        ? NAV_ITEMS.filter(item => item.href !== '/watchlist')
        : NAV_ITEMS;

    if (inDropdown) {
        return (
            <>
                {navItems.map(({ href, label }, index) => (
                    <div key={href}>
                        {index > 0 && <DropdownMenuSeparator className="bg-gray-600"/>}
                        {href === '/search' ? (
                            <DropdownMenuItem asChild className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
                                <div>
                                    <SearchCommand
                                        renderAs="text"
                                        label="Search"
                                        initialStocks={initialStocks}
                                    />
                                </div>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem asChild className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
                                <Link href={href} className="w-full">
                                    {label}
                                </Link>
                            </DropdownMenuItem>
                        )}
                    </div>
                ))}
            </>
        )
    }

    return (
        <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
            {navItems.map(({ href, label }) => {
                if(href === '/search') return (
                    <li key="search-trigger">
                        <SearchCommand
                            renderAs="text"
                            label="Search"
                            initialStocks={initialStocks}
                        />
                    </li>
                )

                return <li key={href}>
                    <Link href={href} className={`hover:text-yellow-500 transition-colors ${
                        isActive(href) ? 'text-gray-100' : ''
                    }`}>
                        {label}
                    </Link>
                </li>
            })}
        </ul>
    )
}
export default NavItems
