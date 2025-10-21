import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicGames } from "../../services/gameService";
import api from "../../services/api";
import useI18n from "../../hooks/useI18n";

const Games = () => {
  const { t } = useI18n();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiBase = useMemo(() => {
    const base = api?.defaults?.baseURL;
    if (!base || typeof base !== "string") return "";
    return base.replace(/\/$/, "");
  }, []);

  const makeAbsoluteUrl = useCallback(
    (url, fallback = "") => {
      if (!url || typeof url !== "string") return fallback;
      if (/^https?:\/\//i.test(url)) return url;
      if (!apiBase) return url.startsWith("/") ? url : `/${url}`;
      return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
    },
    [apiBase]
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const list = await getPublicGames();
        const mapped = (Array.isArray(list) ? list : []).map((game) => ({
          id: game.id,
          title: game.title || "",
          description: game.description || "",
          externalUrl: game.externalUrl || "",
          imageUrl: makeAbsoluteUrl(game.imageUrl, "/logo.png"),
          videoUrl: makeAbsoluteUrl(game.videoUrl || ""),
          active: game.active !== false,
        }));
        setGames(mapped.filter((g) => g.active));
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || "Failed to load games.";
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [makeAbsoluteUrl]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          {t("games.title", { defaultValue: "Therapeutic Games Library" })}
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          {t("games.subtitle", {
            defaultValue:
              "Browse our collection of engaging, therapist-approved games crafted to support emotional awareness and mindfulness.",
          })}
        </p>
      </div>

      {loading && <p className="text-center text-gray-500">{t("games.loading", { defaultValue: "Loading games..." })}</p>}
      {error && !loading && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && games.length === 0 && (
        <p className="text-center text-gray-500">
          {t("games.empty", { defaultValue: "No games are available right now. Please check again soon." })}
        </p>
      )}

      {!loading && !error && games.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id || game.title}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
            >
              <Link to={game.id ? `/games/${game.id}` : "#"} className="relative h-52 bg-gray-100 block">
                <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
              </Link>
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div>
                  <Link to={game.id ? `/games/${game.id}` : "#"} className="text-2xl font-semibold text-gray-800 hover:text-[#4CB5AB] transition-colors">
                    {game.title}
                  </Link>
                  <p className="text-gray-600 mt-3">{game.description}</p>
                </div>

                {game.videoUrl && (
                  <video
                    src={game.videoUrl}
                    controls
                    className="w-full rounded-lg bg-black/5"
                    preload="metadata"
                    poster={game.imageUrl}
                  >
                    {t("games.videoNotSupported", { defaultValue: "Your browser does not support the video tag." })}
                  </video>
                )}

                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  <Link
                    to={game.id ? `/games/${game.id}` : "#"}
                    className="text-center px-5 py-2 rounded-full border border-[#4CB5AB] text-[#4CB5AB] hover:bg-[#4CB5AB]/10 transition-colors"
                  >
                    {t("games.details", { defaultValue: "View Details" })}
                  </Link>
                  {game.externalUrl ? (
                    <a
                      href={game.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center rounded-full px-5 py-2 font-semibold bg-[#E68A6C] text-white hover:bg-[#d97a5f] transition-colors"
                    >
                      {t("games.play", { defaultValue: "Play Now" })}
                    </a>
                  ) : (
                    <span className="flex-1 text-center rounded-full px-5 py-2 font-semibold bg-gray-200 text-gray-600">
                      {t("games.comingSoon", { defaultValue: "Online version coming soon" })}
                    </span>
                  )}
                  {game.videoUrl && (
                    <a
                      href={game.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-center px-5 py-2 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      {t("games.download", { defaultValue: "Download Video" })}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Games;
