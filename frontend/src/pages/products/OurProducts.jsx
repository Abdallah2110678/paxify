import useProducts from "./../../hooks/productsHook";

const OurProducts = () => {
    const { products, loading } = useProducts();

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="container mx-auto max-w-7xl px-6">

                {products.length === 0 ? (
                    <p className="text-center text-gray-500">No products available</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((p) => (
                            <div key={p.id} className="bg-white shadow rounded-lg overflow-hidden">
                                <img
                                    src={p.imageUrl || "/placeholder.jpg"}
                                    alt={p.name}
                                    className="w-full h-56 object-cover"
                                />
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold">{p.name}</h3>
                                    <p className="text-sm text-gray-500">{p.category}</p>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {p.description?.substring(0, 60)}...
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-600 font-bold">
                                            ${Number(p.price).toFixed(2)}
                                        </span>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${p.stock > 0
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
