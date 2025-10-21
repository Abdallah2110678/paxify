// src/pages/Cart/Cart.jsx
import { useEffect, useMemo, useState } from "react";
import { getCartByUser, updateCartItem, removeCartItem, clearCart } from "../../services/cartService";
import useI18n from "../../hooks/useI18n";
import { resolveUrl } from "../../utils/url";

const formatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

export default function Cart() {
    const { t, i18n } = useI18n();
    const isRTL = i18n.language?.startsWith("ar");

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setCart({ items: [] });
                    setLoading(false);
                    return;
                }

                const byUser = await getCartByUser();
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
        if (!cid || newQty < 1) return;
        try {
            const updated = await updateCartItem(cid, itemId, newQty);
            setCart(updated);
        } catch (err) {
            console.error("[Cart] update quantity failed:", err);
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!cid) return;
        try {
            const updated = await removeCartItem(cid, itemId);
            setCart(updated);
        } catch (err) {
            console.error("[Cart] remove item failed:", err);
        }
    };

    const handleClearCart = async () => {
        if (!cid) return;
        try {
            await clearCart(cid);
            setCart({ items: [] });
        } catch (err) {
            console.error("[Cart] clear failed:", err);
        }
    };

    const totals = useMemo(() => {
        const items = Array.isArray(cart?.items) ? cart.items : [];
        const subtotal = items.reduce((acc, item) => acc + (Number(item.product?.price) || 0) * item.quantity, 0);
        const delivery = items.length > 0 ? 5 : 0;
        const tax = subtotal * 0.05;
        const total = subtotal + delivery + tax;
        return { items, subtotal, delivery, tax, total };
    }, [cart]);

    if (loading) {
        return (
            <div className="py-16 bg-gray-50 min-h-screen">
                <div className="container mx-auto max-w-4xl flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#4CB5AB]/30 border-t-[#4CB5AB] rounded-full animate-spin" />
                    <p className="text-gray-600 font-medium">{t("cart.loading", { defaultValue: "Loading your cart…" })}</p>
                </div>
            </div>
        );
    }

    if (!totals.items.length) {
        return (
            <div className="py-16 bg-gray-50 min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
                <div className="container mx-auto max-w-xl bg-white shadow-lg rounded-3xl p-10 text-center space-y-6">
                    <div className="mx-auto w-20 h-20 rounded-full bg-[#4CB5AB]/10 flex items-center justify-center text-4xl text-[#4CB5AB]">
                        🛒
                    </div>
                    <h1 className="text-2xl font-bold text-[#2B2B2B]">
                        {t("cart.emptyTitle", { defaultValue: "Your cart is empty" })}
                    </h1>
                    <p className="text-gray-500 leading-relaxed">
                        {t("cart.emptySubtitle", {
                            defaultValue: "Browse our products and add the items you love to your cart.",
                        })}
                    </p>
                    <button
                        onClick={() => (window.location.href = "/Our Products")}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#4CB5AB] text-white font-semibold hover:bg-[#43a79e] transition"
                    >
                        {t("cart.goShopping", { defaultValue: "Browse Products" })}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-16 bg-gray-50 min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
            <div className="container mx-auto max-w-6xl grid gap-8 lg:grid-cols-[2fr,1fr]">
                <section className="bg-white rounded-3xl shadow-lg border border-[#4CB5AB]/10 overflow-hidden">
                    <header className="px-8 py-6 border-b border-[#4CB5AB]/15 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#2B2B2B]">{t("cart.title", { defaultValue: "Shopping Cart" })}</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {t("cart.itemsCount", {
                                    defaultValue: "{{count}} items",
                                    count: totals.items.length,
                                })}
                            </p>
                        </div>
                        <button
                            onClick={handleClearCart}
                            className="text-sm font-semibold text-[#E68A6C] hover:text-[#cf7556] transition"
                        >
                            {t("cart.clear", { defaultValue: "Clear cart" })}
                        </button>
                    </header>

                    <ul className="divide-y divide-[#4CB5AB]/15">
                        {totals.items.map((item) => {
                            const lineTotal = (Number(item.product?.price) || 0) * item.quantity;
                            return (
                                <li key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1 flex items-start gap-4">
                                        <div className="w-24 h-24 rounded-2xl bg-[#F4EDE4] overflow-hidden flex items-center justify-center">
                                            <img
                                                src={resolveUrl(item.product?.imageUrl) || "/placeholder.jpg"}
                                                alt={item.product?.name || "Product"}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/placeholder.jpg";
                                                }}
                                            />
                                        </div>
                                        <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
                                            <h3 className="text-lg font-semibold text-[#2B2B2B]">
                                                {item.product?.name || t("cart.unknownProduct", { defaultValue: "Unnamed product" })}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {formatter.format(Number(item.product?.price) || 0)}
                                            </p>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-sm font-semibold text-[#E68A6C] hover:text-[#cf7556] transition"
                                            >
                                                {t("cart.remove", { defaultValue: "Remove" })}
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                                        <div className="flex items-center bg-[#F4EDE4] rounded-full px-3 py-2 gap-2">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="w-7 h-7 rounded-full bg-white text-[#4CB5AB] font-bold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                -
                                            </button>
                                            <span className="min-w-[2rem] text-center font-semibold text-[#2B2B2B]">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                className="w-7 h-7 rounded-full bg-white text-[#4CB5AB] font-bold flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-lg font-semibold text-[#2B2B2B]">
                                            {formatter.format(lineTotal)}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <aside className="bg-white rounded-3xl shadow-lg border border-[#4CB5AB]/10 p-6 space-y-6 h-fit">
                    <header>
                        <h2 className="text-xl font-bold text-[#2B2B2B]">
                            {t("cart.summary", { defaultValue: "Order Summary" })}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {t("cart.summarySubtitle", { defaultValue: "Review costs before checkout" })}
                        </p>
                    </header>

                    <dl className="space-y-3 text-sm text-[#2B2B2B]">
                        <div className="flex justify-between">
                            <dt>{t("cart.subtotal", { defaultValue: "Subtotal" })}</dt>
                            <dd>{formatter.format(totals.subtotal)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt>{t("cart.delivery", { defaultValue: "Delivery" })}</dt>
                            <dd>{formatter.format(totals.delivery)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt>{t("cart.tax", { defaultValue: "Taxes" })}</dt>
                            <dd>{formatter.format(totals.tax)}</dd>
                        </div>
                        <div className="h-px bg-[#4CB5AB]/15" />
                        <div className="flex justify-between text-base font-semibold">
                            <dt>{t("cart.total", { defaultValue: "Total" })}</dt>
                            <dd>{formatter.format(totals.total)}</dd>
                        </div>
                    </dl>

                    <button className="w-full rounded-full bg-[#4CB5AB] text-white py-3 font-semibold hover:bg-[#43a79e] transition">
                        {t("cart.checkout", { defaultValue: "Proceed to Checkout" })}
                    </button>
                    <button
                        onClick={() => (window.location.href = "/Our Products")}
                        className="w-full rounded-full border border-[#4CB5AB] text-[#4CB5AB] py-3 font-semibold hover:bg-[#4CB5AB]/10 transition"
                    >
                        {t("cart.continueShopping", { defaultValue: "Continue Shopping" })}
                    </button>
                </aside>
            </div>
        </div>
    );
}
