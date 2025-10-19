import { useId } from "react";

export default function ProductFilters({
    // controlled state
    search = "",
    category = "",
    price = [0, 1000],
    inStockOnly = false,
    sort = "relevance",

    // options
    options = {
        categories: [],
        initialRange: [0, 1000],
    },

    // handlers
    onSearchChange,
    onCategoryChange,
    onPriceChange,
    onInStockChange,
    onSortChange,
    onClear,
}) {
    const searchId = useId();
    const min = options.initialRange?.[0] ?? 0;
    const max = options.initialRange?.[1] ?? 1000;

    return (
        <>
            {/* Mobile: collapsible filter trigger */}
            <details className="mt-6 lg:hidden mb-4 bg-white border border-slate-200 rounded-2xl">
                <summary className="flex items-center justify-between cursor-pointer select-none px-4 py-3 rounded-2xl">
                    <span className="text-base font-medium text-slate-800">Filter</span>
                    <span className="text-slate-500 text-sm">Tap to expand</span>
                </summary>

                <div className="px-4 pb-4 space-y-4">
                    {/* Search */}
                    <div>
                        <label htmlFor={searchId} className="block text-sm text-slate-600 mb-1">
                            Search
                        </label>
                        <input
                            id={searchId}
                            value={search}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            placeholder="Search products…"
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => onCategoryChange?.(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">All</option>
                            {options.categories?.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm text-slate-600 mb-2">
                            Price: ${price[0]} – ${price[1]}
                        </label>
                        <div className="px-2">
                            <input
                                type="range"
                                min={min}
                                max={max}
                                value={price[0]}
                                onChange={(e) => onPriceChange?.([Number(e.target.value), price[1]])}
                                className="w-full mb-2"
                            />
                            <input
                                type="range"
                                min={min}
                                max={max}
                                value={price[1]}
                                onChange={(e) => onPriceChange?.([price[0], Number(e.target.value)])}
                                className="w-full"
                            />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>${min}</span>
                            <span>${max}</span>
                        </div>
                    </div>

                    {/* Stock & Sort */}
                    <div className="flex items-center justify-between gap-3">
                        <label className="inline-flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => onInStockChange?.(e.target.checked)}
                            />
                            In stock only
                        </label>

                        <select
                            value={sort}
                            onChange={(e) => onSortChange?.(e.target.value)}
                            className="border rounded-lg px-2 py-1 text-sm"
                        >
                            <option value="relevance">Sort: Relevance</option>
                            <option value="price-asc">Price ↑</option>
                            <option value="price-desc">Price ↓</option>
                            <option value="name-asc">Name A–Z</option>
                            <option value="name-desc">Name Z–A</option>
                        </select>
                    </div>

                    <button
                        onClick={onClear}
                        className="w-full mt-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>
            </details>

            {/* Desktop: sidebar */}
            <aside className="hidden lg:block w-72 bg-white border border-slate-200 rounded-2xl p-4 h-max sticky top-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Filters</h3>

                {/* Search */}
                <div className="mb-4">
                    <label htmlFor={`${searchId}-desk`} className="block text-sm text-slate-600 mb-1">
                        Search
                    </label>
                    <input
                        id={`${searchId}-desk`}
                        value={search}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        placeholder="Search products…"
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                </div>

                {/* Category */}
                <div className="mb-4">
                    <label className="block text-sm text-slate-600 mb-1">Category</label>
                    <select
                        value={category}
                        onChange={(e) => onCategoryChange?.(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="">All</option>
                        {options.categories?.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price */}
                <div className="mb-4">
                    <label className="block text-sm text-slate-600 mb-2">
                        Price: ${price[0]} – ${price[1]}
                    </label>
                    <div className="px-2">
                        <input
                            type="range"
                            min={min}
                            max={max}
                            value={price[0]}
                            onChange={(e) => onPriceChange?.([Number(e.target.value), price[1]])}
                            className="w-full mb-2"
                        />
                        <input
                            type="range"
                            min={min}
                            max={max}
                            value={price[1]}
                            onChange={(e) => onPriceChange?.([price[0], Number(e.target.value)])}
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>${min}</span>
                        <span>${max}</span>
                    </div>
                </div>

                {/* Stock */}
                <div className="mb-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={(e) => onInStockChange?.(e.target.checked)}
                        />
                        In stock only
                    </label>
                </div>

                {/* Sort */}
                <div className="mb-4">
                    <label className="block text-sm text-slate-600 mb-1">Sort by</label>
                    <select
                        value={sort}
                        onChange={(e) => onSortChange?.(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="relevance">Relevance</option>
                        <option value="price-asc">Price ↑</option>
                        <option value="price-desc">Price ↓</option>
                        <option value="name-asc">Name A–Z</option>
                        <option value="name-desc">Name Z–A</option>
                    </select>
                </div>

                <button
                    onClick={onClear}
                    className="w-full mt-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                    Clear All Filters
                </button>
            </aside>
        </>
    );
}
