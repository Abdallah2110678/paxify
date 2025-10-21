// src/pages/OurProducts/OurProducts.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProducts from "../../hooks/productsHook";
import { addToCart } from "../../services/cartService";
import ProductFilters from "./../../components/therapists/ProductFilter";

const OurProducts = () => {
    const { products: allProducts, loading } = useProducts();
    const navigate = useNavigate();

    // -------- filters state --------
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState([0, 1000]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sort, setSort] = useState("relevance");

    // -------- options derived from data --------
    const options = useMemo(() => {
        const categories = Array.from(
            new Set((allProducts || []).map((p) => p.category).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b));

        const prices = (allProducts || [])
            .map((p) => Number(p.price || 0))
            .filter((n) => !Number.isNaN(n));
        const min = prices.length ? Math.floor(Math.min(...prices)) : 0;
        const max = prices.length ? Math.ceil(Math.max(...prices)) : 1000;

        // keep sliders within bounds when data loads/changes
        setPrice((prev) => [Math.max(min, prev[0]), Math.min(max, prev[1])]);

        return { categories, initialRange: [min, max] };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allProducts?.length]);

    // -------- filtering + sorting --------
    const filtered = useMemo(() => {
        let list = Array.isArray(allProducts) ? [...allProducts] : [];

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(
                (p) =>
                    p.name?.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q) ||
                    p.category?.toLowerCase().includes(q)
            );
        }

        if (category) list = list.filter((p) => p.category === category);

        list = list.filter((p) => {
            const val = Number(p.price || 0);
            return val >= price[0] && val <= price[1];
        });

        if (inStockOnly) list = list.filter((p) => Number(p.stock || 0) > 0);

        switch (sort) {
            case "price-asc":
                list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
                break;
            case "price-desc":
                list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
                break;
            case "name-asc":
                list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
                break;
            case "name-desc":
                list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
                break;
            default:
                // relevance → original order
                break;
        }

        return list;
    }, [allProducts, search, category, price, inStockOnly, sort]);

    const clearAll = () => {
        setSearch("");
        setCategory("");
        setInStockOnly(false);
        setSort("relevance");
        setPrice(options.initialRange); // reset to current data range
    };

    // -------- add to cart --------
    const handleAddToCart = async (productId, qty = 1) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("⚠ Please log in first");
                navigate("/login");
                return;
            }

            const cart = await addToCart(productId, qty);
            if (cart?.id) localStorage.setItem("cartId", String(cart.id));
            alert("✅ Added to cart!");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to add to cart");
        }
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="container mx-auto max-w-7xl px-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-6">Our Products</h1>

                <div className="grid grid-cols-1 lg:grid-cols-[18rem,1fr] gap-6">
                    {/* Filters Sidebar */}
                    <ProductFilters
                        search={search}
                        category={category}
                        price={price}
                        inStockOnly={inStockOnly}
                        sort={sort}
                        options={options}
                        onSearchChange={setSearch}
                        onCategoryChange={setCategory}
                        onPriceChange={setPrice}
                        onInStockChange={setInStockOnly}
                        onSortChange={setSort}
                        onClear={clearAll}
                    />

                    {/* Products Grid */}
                    <section>
                        {filtered.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                No products match your filters.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filtered.map((p) => (
                                    <div
                                        key={p.id}
                                        className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
                                    >
                                        <div
                                            onClick={() => navigate(`/products/${p.id}`)}
                                            className="cursor-pointer"
                                        >
                                            <img
                                                src={p.imageUrl || "/placeholder.jpg"}
                                                alt={p.name}
                                                className="w-full h-56 object-cover"
                                            />
                                        </div>

                                        <div className="p-5">
                                            <h3
                                                className="text-lg font-semibold hover:underline cursor-pointer"
                                                onClick={() => navigate(`/products/${p.id}`)}
                                            >
                                                {p.name}
                                            </h3>

                                            <p className="text-sm text-gray-500">{p.category}</p>

                                            {p.description && (
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                    {p.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-blue-600 font-bold">
                                                    ${Number(p.price || 0).toFixed(2)}
                                                </span>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${Number(p.stock || 0) > 0
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {Number(p.stock || 0) > 0 ? "In Stock" : "Out of Stock"}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(p.id, 1)}
                                                disabled={Number(p.stock || 0) <= 0}
                                                className={`w-full py-2 px-4 rounded-lg text-white font-medium transition ${Number(p.stock || 0) > 0
                                                        ? "bg-blue-600 hover:bg-blue-700"
                                                        : "bg-gray-400 cursor-not-allowed"
                                                    }`}
                                            >
                                                {Number(p.stock || 0) > 0 ? "Add to Cart" : "Out of Stock"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default OurProducts;
