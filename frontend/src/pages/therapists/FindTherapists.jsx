import useNavbar from "../../hooks/navbarHook";
import { Link } from "react-router-dom";
import DoctorScheduleContainer from "../../components/therapists/DoctorScheduleContainer";

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
        <div className="space-y-6">
          {therapists.map((t) => (
            <div
              key={t.id || t.email || t.name}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-100 w-full max-w-[900px] lg:mr-auto"
            >
              <div className="flex flex-col lg:flex-row items-start gap-6">
                {/* Left + Middle clickable area */}
                <Link
                  to={`/doctors/${t.id || t.userId || t.doctorId}`}
                  className="flex items-start gap-4 w-full lg:w-auto flex-1"
                >
                  {/* Left: Avatar */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-2 ring-slate-100">
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
                      className={`w-full h-full items-center justify-center text-3xl ${t.profilePictureUrl ? 'hidden' : 'flex'}`}
                      aria-hidden
                    >
                      {t.emoji || (t.gender === 'FEMALE' ? '👩‍⚕️' : '👨‍⚕️')}
                    </div>
                  </div>

                  {/* Middle: Details */}
                  <div className="flex-1 w-full">
                    <div className="mb-2">
                      {t.title && (<div className="text-sm text-sky-700 font-medium">{t.title}</div>)}
                      {t.name && (
                        <h3 className="text-2xl font-semibold text-gray-800">{t.name}</h3>
                      )}
                      {t.specialty && (
                        <p className="text-slate-600 -mt-0.5">Specialist of {t.specialty}</p>
                      )}
                    </div>

                    {t.rating != null && (
                      <div className="flex items-center text-amber-500 mb-2">
                        <span className="mr-1">{Array.from({ length: 5 }, (_, i) => i < Math.round(t.rating) ? '★' : '☆').join(' ')}</span>
                        {t.reviewsCount != null && (
                          <span className="text-slate-500 text-sm ml-2">Overall Rating From {t.reviewsCount} Visitors</span>
                        )}
                      </div>
                    )}

                    <ul className="text-slate-700 space-y-2 text-sm">
                      {Array.isArray(t.specializations) && t.specializations.length > 0 && (
                        <li className="flex items-start gap-2">
                          <span className="text-sky-600 mt-0.5">🦷</span>
                          <span>
                            <span className="text-sky-700 font-medium">{t.specialty || 'Specialist'}</span> Specialized in{' '}
                            <span className="text-sky-600">{t.specializations.join(', ')}</span>
                          </span>
                        </li>
                      )}
                      {t.address && (
                        <li className="flex items-start gap-2">
                          <span className="text-sky-600 mt-0.5">📍</span>
                          <span>{t.address}</span>
                        </li>
                      )}
                      {t.consultationFee != null && (
                        <li className="flex items-start gap-2">
                          <span className="text-sky-600 mt-0.5">💳</span>
                          <span>Fees : L.E {t.consultationFee}</span>
                        </li>
                      )}
                      {t.waitingTimeMinutes != null && (
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 mt-0.5">⏱️</span>
                          <span>Waiting Time : {t.waitingTimeMinutes} Minutes</span>
                        </li>
                      )}
                      {t.callCostLabel && (
                        <li className="flex items-start gap-2">
                          <span className="text-sky-600 mt-0.5">📞</span>
                          <span>{t.callCostLabel}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </Link>
                {/* Right: Schedule (from backend via container) */}
                <DoctorScheduleContainer doctorId={t.id || t.userId || t.doctorId} onBook={(slot) => onBook?.(t, slot)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
