import { useState } from "react";
import { createGame, uploadGameImage, uploadGameVideo } from "../../services/gameService";

const defaultForm = {
  title: "",
  description: "",
  externalUrl: "",
  active: true,
  image: null,
  video: null,
};

const AddGame = () => {
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (evt) => {
    const { name, value, type, checked } = evt.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (evt) => {
    const { name, files } = evt.target;
    setForm((prev) => ({
      ...prev,
      [name]: files && files.length ? files[0] : null,
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        externalUrl: form.externalUrl.trim() || null,
        active: Boolean(form.active),
      };

      const created = await createGame(payload);

      if (form.image) {
        await uploadGameImage(created.id, form.image);
      }
      if (form.video) {
        await uploadGameVideo(created.id, form.video);
      }

      alert("Game created successfully.");
      setForm(defaultForm);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to create game";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Game</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="What is this game about?"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="externalUrl">
                External URL
              </label>
              <input
                id="externalUrl"
                name="externalUrl"
                type="url"
                value={form.externalUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://example.com/play"
              />
            </div>

            <div className="flex items-center gap-2 md:col-span-2">
              <input
                id="active"
                name="active"
                type="checkbox"
                checked={form.active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="active" className="text-sm text-gray-700">
                Active (visible on the public site)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="image">
                Cover Image
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {form.image && (
                <img
                  src={URL.createObjectURL(form.image)}
                  alt="Preview"
                  className="mt-3 h-24 rounded object-cover"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="video">
                Trailer / Demo Video
              </label>
              <input
                id="video"
                name="video"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
              />
              {form.video && <p className="mt-2 text-sm text-gray-500">{form.video.name}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Create Game"}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddGame;
