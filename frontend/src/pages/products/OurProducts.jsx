// src/pages/OurProducts/OurProducts.jsx
import { useNavigate } from "react-router-dom";
import useProducts from "../../hooks/productsHook";
import { addToCart } from "../../services/cartService";

const OurProducts = () => {
    const { products, loading } = useProducts();
    const navigate = useNavigate();

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    const handleAddToCart = async (productId) => {
        const token = localStorage.getItem("token");
        if (!token) { alert("Please log in first"); navigate("/login"); return; }

        const cart = await addToCart(productId, 1);
        if (cart?.id) localStorage.setItem("cartId", String(cart.id));
        alert("Added to cart!");
    };


    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="container mx-auto max-w-7xl px-6">
                {products.length === 0 ? (
                    <p className="text-center text-gray-500">No products available</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((p) => (
                            <div key={p.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition">
                                <div onClick={() => navigate(`/products/${p.id}`)} className="cursor-pointer">
                                    <img src={p.imageUrl || "/placeholder.jpg"} alt={p.name} className="w-full h-56 object-cover" />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold hover:underline cursor-pointer" onClick={() => navigate(`/products/${p.id}`)}>
                                        {p.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">{p.category}</p>
                                    <p className="text-gray-600 text-sm mb-3">{p.description?.substring(0, 60)}...</p>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-blue-600 font-bold">${Number(p.price).toFixed(2)}</span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {p.stock > 0 ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(p.id)}
                                        disabled={p.stock <= 0}
                                        className={`w-full py-2 px-4 rounded-lg text-white font-medium transition ${p.stock > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        {p.stock > 0 ? "Add to Cart" : "Out of Stock"}
                                    </button>
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
