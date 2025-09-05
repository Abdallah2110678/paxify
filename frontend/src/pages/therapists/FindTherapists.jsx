import useNavbar from "../../hooks/navbarHook";

// Pure presentational component. All data/logic must be provided via props.
export default function FindTherapists({ therapists = [], loading = false, error = "", onBook }) {
  const { resolveUrl } = useNavbar();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Find Your Therapist</h1>

      {loading && (
        <div className="p-6 text-center text-slate-500">Loading…</div>
      )}

      {error && !loading && (
        <div className="p-4 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 max-w-3xl">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapists.map((t) => (
            <div key={t.id || t.email || t.name} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {t.profilePictureUrl ? (
                    <img 
                      src={resolveUrl(t.profilePictureUrl)} 
                      alt={`${t.name}'s profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full flex items-center justify-center text-2xl ${t.profilePictureUrl ? 'hidden' : 'flex'}`}
                    aria-hidden
                  >
                    {t.emoji || (t.gender === "FEMALE" ? "👩‍⚕️" : "👨‍⚕️")}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{t.name}</h3>
                  <p className="text-blue-600">{t.specialty || "General Counseling"}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">⭐</span>
                  <span>4.8 (127 reviews)</span>
                </div>
                {t.consultationFee && (
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">💰</span>
                    <span>L.E {t.consultationFee}/session</span>
                  </div>
                )}
                
              </div>
              <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => onBook?.(t)}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
