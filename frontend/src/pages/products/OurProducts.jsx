import { useEffect, useState } from "react";
import { getProducts } from "./../../services/productService.js";

const OurProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Loading products...</div>;
    }

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="container mx-auto max-w-7xl px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10">
                    Our Products
                </h2>

                {products.length === 0 ? (
                    <p className="text-center text-gray-500">No products available</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((p) => (
                            <div
                                key={p.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={p.imageUrl ? p.imageUrl : "/placeholder.jpg"}
                                    alt={p.name}
                                    className="w-full h-56 object-cover"
                                />
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {p.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-3">{p.category}</p>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {p.description?.substring(0, 80)}...
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-blue-600">
                                            ${Number(p.price).toFixed(2)}
                                        </span>
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full ${p.stock > 0
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {p.stock > 0 ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OurProducts;
