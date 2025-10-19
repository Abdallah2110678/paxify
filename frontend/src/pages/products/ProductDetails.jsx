// src/pages/ProductDetails/ProductDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../../services/productService";
import { addToCart } from "../../services/cartService";
// If your resolver lives elsewhere, import from there.
// I recommend moving it to: src/utils/url.js
import { resolveUrl } from "./../../utils/url"; // or "../../utils/url"

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            setErr("");
            try {
                const data = await getProductById(id);
                if (alive) setProduct(data);
            } catch (e) {
                console.error("Failed to load product", e);
                if (alive) setErr("Failed to load product.");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [id]);

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("⚠ Please log in first to use the cart.");
                return;
            }
            await addToCart(product.id, quantity);
            alert("✅ Added to cart!");
        } catch (e) {
            console.error(e);
            alert("❌ Failed to add to cart");
        }
    };

    if (loading) return <div className="p-6">Loading…</div>;
    if (err) return <div className="p-6 text-red-600">{err}</div>;
    if (!product) return <div className="p-6">Product not found</div>;

    const imgSrc = resolveUrl(product.imageUrl);

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="container mx-auto max-w-4xl bg-white shadow rounded-lg p-6">
                <img
                    src={imgSrc || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded"
                    onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
                />

                <h2 className="text-3xl font-bold mt-6">{product.name}</h2>
                <p className="text-gray-600 mt-2">{product.category}</p>
                <p className="text-gray-700 mt-4">{product.description}</p>

                <p className="text-blue-600 text-2xl font-bold mt-4">
                    ${Number(product.price).toFixed(2)}
                </p>

                <div className="flex items-center gap-3 mt-5">
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(Math.max(1, Number(e.target.value) || 1))
                        }
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
