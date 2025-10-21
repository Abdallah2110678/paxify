import { useEffect, useMemo, useState } from "react";
import {
  deleteGame,
  getAllGames,
  updateGame,
  uploadGameImage,
  uploadGameVideo,
} from "../../services/gameService";

const AdminGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);
  const [editing, setEditing] = useState(null);
  const [mediaFiles, setMediaFiles] = useState({ image: null, video: null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await getAllGames();
        setGames(list);
        setError("");
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || "Failed to load games";
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredGames = useMemo(() => {
    const term = search.trim().toLowerCase();
    return games.filter((g) => {
      const matchesSearch =
        !term ||
        (g.title || "").toLowerCase().includes(term) ||
        (g.description || "").toLowerCase().includes(term);
      const matchesActive = !onlyActive || Boolean(g.active);
      return matchesSearch && matchesActive;
    });
  }, [games, search, onlyActive]);

  const beginEdit = (game) => {
    setEditing({
      id: game.id,
      title: game.title || "",
      description: game.description || "",
      externalUrl: game.externalUrl || "",
      active: Boolean(game.active),
    });
    setMediaFiles({ image: null, video: null });
  };

  const cancelEdit = () => {
    setEditing(null);
    setMediaFiles({ image: null, video: null });
  };

  const handleEditChange = (evt) => {
    if (!editing) return;
    const { name, value, type, checked } = evt.target;
    setEditing((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMediaChange = (evt) => {
    const { name, files } = evt.target;
    setMediaFiles((prev) => ({
      ...prev,
      [name]: files && files.length ? files[0] : null,
    }));
  };

  const handleUpdate = async (evt) => {
    evt.preventDefault();
    if (!editing) return;
    setSaving(true);

    try {
      const payload = {
        title: editing.title.trim(),
        description: editing.description.trim(),
        externalUrl: editing.externalUrl.trim() || null,
        active: Boolean(editing.active),
      };

      await updateGame(editing.id, payload);

      if (mediaFiles.image) {
        await uploadGameImage(editing.id, mediaFiles.image);
      }
      if (mediaFiles.video) {
        await uploadGameVideo(editing.id, mediaFiles.video);
      }

      const latest = await getAllGames();
      setGames(latest);
      setError("");
      cancelEdit();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to update game";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this game?")) return;
    try {
      await deleteGame(id);
      setGames((prev) => prev.filter((g) => g.id !== id));
      if (editing?.id === id) {
        cancelEdit();
      }
      setError("");
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to delete game";
      setError(message);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Games</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage therapeutic games that appear on the public site.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(evt) => setSearch(evt.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Search by title or description"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={onlyActive}
                onChange={(evt) => setOnlyActive(evt.target.checked)}
                className="h-4 w-4"
              />
              Show only active
            </label>
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading games…</p>}
        {error && !loading && <p className="text-red-500">{error}</p>}

        {!loading && filteredGames.length === 0 && (
          <p className="text-gray-500">No games match your filters.</p>
        )}

        {!loading && filteredGames.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Game
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGames.map((game) => (
                  <tr key={game.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={game.imageUrl || "/logo.png"}
                          alt={game.title}
                          className="h-16 w-16 rounded object-cover bg-gray-100"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{game.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {game.description || "No description provided."}
                          </p>
                          {game.externalUrl && (
                            <a
                              href={game.externalUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Visit external link
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${game.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {game.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {game.createdAt ? new Date(game.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => beginEdit(game)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(game.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editing && (
          <form onSubmit={handleUpdate} className="mt-8 border-t border-gray-200 pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Edit Game</h3>
              <button type="button" className="text-sm text-gray-500 hover:underline" onClick={cancelEdit}>
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="edit-title">
                  Title
                </label>
                <input
                  id="edit-title"
                  name="title"
                  type="text"
                  value={editing.title}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="edit-description">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows="4"
                  value={editing.description}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="edit-externalUrl">
                  External URL
                </label>
                <input
                  id="edit-externalUrl"
                  name="externalUrl"
                  type="url"
                  value={editing.externalUrl}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://example.com/play"
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  id="edit-active"
                  name="active"
                  type="checkbox"
                  checked={editing.active}
                  onChange={handleEditChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="edit-active" className="text-sm text-gray-700">
                  Active (visible on the public site)
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="edit-image">
                  Replace Cover Image
                </label>
                <input
                  id="edit-image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleMediaChange}
                />
                {mediaFiles.image && (
                  <img
                    src={URL.createObjectURL(mediaFiles.image)}
                    alt="Preview"
                    className="mt-3 h-24 rounded object-cover"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="edit-video">
                  Replace Video
                </label>
                <input
                  id="edit-video"
                  name="video"
                  type="file"
                  accept="video/*"
                  onChange={handleMediaChange}
                />
                {mediaFiles.video && (
                  <p className="mt-2 text-sm text-gray-500">Selected: {mediaFiles.video.name}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminGames;
