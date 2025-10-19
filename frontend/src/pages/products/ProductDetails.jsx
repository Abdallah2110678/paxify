import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "./../../services/productService";
import { addToCart } from "./../../services/cartService";

export default function ProductDetails() {
    const { id } = useParams(); // productId from route
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleAddToCart = async (productId) => {
        try {
            const userId = localStorage.getItem("userId"); // already stored at login
            if (!userId) {
                alert("⚠ Please log in first to use the cart.");
                return;
            }

            await addToCart(userId, productId, 1);
            alert("✅ Added to cart!");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to add to cart");
        }
    };


    if (loading) return <div className="p-6">Loading...</div>;
    if (!product) return <div className="p-6">Product not found</div>;

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="container mx-auto max-w-4xl bg-white shadow rounded-lg p-6">
                <img
                    src={product.imageUrl || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded"
                />
                <h2 className="text-3xl font-bold mt-6">{product.name}</h2>
                <p className="text-gray-600 mt-2">{product.category}</p>
                <p className="text-gray-700 mt-4">{product.description}</p>
                <p className="text-blue-600 text-2xl font-bold mt-4">
                    ${Number(product.price).toFixed(2)}
                </p>
                <div className="flex items-center gap-3 mt-4">
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-20 border px-2 py-1 rounded"
                    />
                    <button
                        onClick={handleAddToCart}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
