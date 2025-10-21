import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getGame } from "../../services/gameService";
import api from "../../services/api";
import useI18n from "../../hooks/useI18n";

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiBase = useMemo(() => {
    const base = api?.defaults?.baseURL;
    if (!base || typeof base !== "string") return "";
    return base.replace(/\/$/, "");
  }, []);

  const makeAbsoluteUrl = useCallback(
    (url, fallback = "") => {
      if (!url || typeof url !== "string" || url.length === 0) return fallback;
      if (/^https?:\/\//i.test(url)) return url;
      if (!apiBase) return url.startsWith("/") ? url : `/${url}`;
      return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
    },
    [apiBase]
  );

  useEffect(() => {
    if (!id) {
      setError("Game not found.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getGame(id);
        setGame({
          ...data,
          imageUrl: makeAbsoluteUrl(data?.imageUrl, "/logo.png"),
          videoUrl: makeAbsoluteUrl(data?.videoUrl || ""),
        });
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || "Failed to load this game.";
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, makeAbsoluteUrl]);

  const handleBack = () => navigate("/games");

  return (
    <div className="container mx-auto px-4 py-12">
      <button
        onClick={handleBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#4CB5AB] hover:text-[#3fa295] transition-colors"
      >
        ← {t("games.back", { defaultValue: "Back to games" })}
      </button>

      {loading && <p className="text-center text-gray-500">{t("games.loading", { defaultValue: "Loading games..." })}</p>}
      {error && !loading && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && game && (
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden">
          <div className="relative h-72 bg-gray-100">
            <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-8 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-sm uppercase tracking-wide text-[#4CB5AB] font-semibold">
                {t("games.featured", { defaultValue: "Featured Game" })}
              </span>
              <h1 className="text-4xl font-bold text-gray-900">{game.title}</h1>
              {game.updatedAt && (
                <p className="text-sm text-gray-400">
                  {t("games.updatedAt", { defaultValue: "Last updated" })}{" "}
                  {new Date(game.updatedAt).toLocaleDateString()}
                </p>
              )}
              <p className="text-lg text-gray-600 leading-relaxed">{game.description}</p>
            </div>

            {game.videoUrl && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {t("games.watch", { defaultValue: "Watch the demo" })}
                </h2>
                <video
                  src={game.videoUrl}
                  controls
                  className="w-full rounded-2xl bg-black/5"
                  preload="metadata"
                  poster={game.imageUrl}
                >
                  {t("games.videoNotSupported", { defaultValue: "Your browser does not support the video tag." })}
                </video>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              {game.externalUrl ? (
                <a
                  href={game.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center rounded-full px-6 py-3 font-semibold bg-[#E68A6C] text-white hover:bg-[#d97a5f] transition-colors"
                >
                  {t("games.play", { defaultValue: "Play Now" })}
                </a>
              ) : (
                <span className="flex-1 text-center rounded-full px-6 py-3 font-semibold bg-gray-200 text-gray-600">
                  {t("games.comingSoon", { defaultValue: "Online version coming soon" })}
                </span>
              )}

              <Link
                to="/games"
                className="text-center rounded-full px-6 py-3 font-semibold border border-[#4CB5AB] text-[#4CB5AB] hover:bg-[#4CB5AB]/10 transition-colors"
              >
                {t("games.browseMore", { defaultValue: "Browse more games" })}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetails;
