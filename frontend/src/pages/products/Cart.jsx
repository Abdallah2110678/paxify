// src/pages/Cart/Cart.jsx
import { useEffect, useState } from "react";
import { getCartByUser, updateCartItem, removeCartItem, clearCart } from "../../services/cartService";

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) { setCart({ items: [] }); return; }

                const byUser = await getCartByUser(userId);
                console.log("[Cart] /by-user:", byUser);

                if (byUser?.id) localStorage.setItem("cartId", String(byUser.id));
                setCart(byUser || { items: [] });
            } catch (e) {
                console.error("[Cart] load error:", e);
                setCart({ items: [] });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const cid = localStorage.getItem("cartId");

    const handleUpdateQuantity = async (itemId, newQty) => {
        if (!cid) return;
        const updated = await updateCartItem(cid, itemId, newQty);
        setCart(updated);
    };
    const handleRemoveItem = async (itemId) => {
        if (!cid) return;
        const updated = await removeCartItem(cid, itemId);
        setCart(updated);
    };
    const handleClearCart = async () => {
        if (!cid) return;
        await clearCart(cid);
        setCart({ items: [] });
    };

    if (loading) return <div className="p-6">Loading cart...</div>;

    // TEMP: show raw payload if empty so we can see exactly what backend sent
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
        return (
            <div className="p-6">
                Your cart is empty
                <pre className="mt-4 text-xs text-gray-500 bg-gray-100 p-2 rounded">
                    {JSON.stringify(cart, null, 2)}
                </pre>
            </div>
        );
    }

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="container mx-auto max-w-5xl bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Product</th>
                            <th className="px-4 py-2">Quantity</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.items.map((item) => (
                            <tr key={item.id} className="border-t">
                                <td className="px-4 py-2">{item.product?.name ?? "(no name)"}</td>
                                <td className="px-4 py-2">
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        min="1"
                                        onChange={(e) => handleUpdateQuantity(item.id, Number(e.target.value))}
                                        className="w-20 border px-2 py-1 rounded"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    ${((item.product?.price ?? 0) * item.quantity).toFixed(2)}
                                </td>
                                <td className="px-4 py-2">
                                    <button onClick={() => handleRemoveItem(item.id)} className="text-red-600 hover:text-red-800">
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between items-center mt-6">
                    <button onClick={handleClearCart} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                        Clear Cart
                    </button>
                    <span className="text-xl font-bold">
                        Total: $
                        {cart.items.reduce((acc, i) => acc + (i.product?.price ?? 0) * i.quantity, 0).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
