import { useState } from "react";
import { createProduct, uploadProductImage } from "./../../services/productService.js";

const AddProduct = () => {
    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        image: null,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setForm({ ...form, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Create product (without image)
            const payload = {
                name: form.name,
                category: form.category,
                price: parseFloat(form.price),
                stock: parseInt(form.stock, 10),
                description: form.description,
                imageUrl: null, // will be updated later
            };

            const createdProduct = await createProduct(payload);

            // 2. Upload image if provided
            if (form.image) {
                await uploadProductImage(createdProduct.id, form.image);
            }

            alert("✅ Product added successfully!");

            // reset form
            setForm({
                name: "",
                category: "",
                price: "",
                stock: "",
                description: "",
                image: null,
            });
        } catch (err) {
            setError("❌ Failed to add product: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            {form.image && (
                                <img
                                    src={URL.createObjectURL(form.image)}
                                    alt="Preview"
                                    className="mt-3 h-24 rounded"
                                />
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Adding..." : "Add Product"}
                        </button>
                    </div>

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default AddProduct;