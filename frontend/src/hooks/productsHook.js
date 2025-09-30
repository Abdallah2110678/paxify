import { useState, useEffect, useMemo } from "react";
import { getProducts } from "../services/productService";
import api from "../services/api";

// ✅ helper just like in useProfile
export function resolveUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path; // already full url
  const base = (api?.defaults?.baseURL || "").replace(/\/$/, "");
  return `${base}${path}`;
}

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bust, setBust] = useState(0); // bust cache when uploading

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 👇 memoize resolved image URLs
  const productsWithResolvedUrls = useMemo(
    () =>
      products.map((p) => ({
        ...p,
        imageUrl: p.imageUrl ? `${resolveUrl(p.imageUrl)}?t=${bust}` : null,
      })),
    [products, bust]
  );

  return { products: productsWithResolvedUrls, loading, reload: setBust };
}
