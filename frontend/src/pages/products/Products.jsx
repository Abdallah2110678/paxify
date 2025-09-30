import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "./../../services/productService.js";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(id);
            setProducts(products.filter((p) => p.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    // filter logic
    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                    <div className="flex gap-4">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <svg
                                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            <option value="medications">Medications</option>
                            <option value="supplies">Medical Supplies</option>
                            <option value="equipment">Equipment</option>
                        </select>
                    </div>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((p) => (
                                <tr key={p.id}>
                                    {/* Product name + image */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                className="h-10 w-10 rounded-lg object-cover mr-3"
                                                src={p.imageUrl || "/placeholder.jpg"}
                                                alt={p.name}
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {p.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {p.description?.substring(0, 40)}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="px-6 py-4 whitespace-nowrap">{p.category}</td>

                                    {/* Stock */}
                                    <td className="px-6 py-4 whitespace-nowrap">{p.stock}</td>

                                    {/* Price */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ${Number(p.price).toFixed(2)}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                            title="Edit"
                                            // TODO: hook this up to edit page
                                            onClick={() => alert("Edit not implemented yet")}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900 transition-colors"
                                            title="Delete"
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (placeholder for now) */}
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-500">
                        Showing {filteredProducts.length} of {products.length} products
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
