import React from "react";

export default function DoctorDescription({
  doctor = {},
  highlights = [],
  specializations = [],
  reviewsSummary = {},
  reviews = [],
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 ring-2 ring-slate-100 flex-shrink-0">
            {doctor.profilePictureUrl ? (
              <img
                src={doctor.profilePictureUrl}
                alt={doctor.name || "Doctor profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">🧑‍⚕️</div>
            )}
          </div>

          {/* Main info */}
          <div className="flex-1">
            {doctor.title && (
              <div className="text-sm text-sky-700 font-medium mb-1">{doctor.title}</div>
            )}
            {doctor.name && (
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{doctor.name}</h1>
            )}
            {doctor.specialty && (
              <p className="text-slate-700 mt-1">Specialist in {doctor.specialty}</p>
            )}

            {/* Inline specializations list */}
            {Array.isArray(specializations) && specializations.length > 0 && (
              <p className="text-sky-700 mt-2 text-sm">
                Specialized in {specializations.join(", ")}
              </p>
            )}

            {/* Rating row */}
            {(doctor.ratingStars || doctor.ratingLabel || doctor.reviewsCountLabel) && (
              <div className="flex items-center gap-3 mt-4">
                {doctor.ratingStars && (
                  <div className="text-amber-500 text-xl">{doctor.ratingStars}</div>
                )}
                {doctor.ratingLabel && (
                  <div className="text-slate-700 text-sm">{doctor.ratingLabel}</div>
                )}
                {doctor.reviewsCountLabel && (
                  <div className="text-slate-500 text-sm">{doctor.reviewsCountLabel}</div>
                )}
              </div>
            )}

            {/* Highlights tags */}
            {Array.isArray(highlights) && highlights.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {highlights.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full border text-slate-700 text-sm bg-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About the doctor */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">About The Doctor</h2>
        {doctor.bio ? (
          <p className="text-slate-700 leading-7 whitespace-pre-line">{doctor.bio}</p>
        ) : (
          <p className="text-slate-500">Biography not provided.</p>
        )}
        {doctor.address && (
          <div className="mt-4 text-slate-600 text-sm">📍 {doctor.address}</div>
        )}
      </section>

      {/* Reviews summary */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Patients' Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-amber-500 text-2xl mb-1">
              {reviewsSummary.overallStars}
            </div>
            <div className="text-slate-700 text-sm">{reviewsSummary.overallLabel}</div>
          </div>
          <div>
            <div className="text-amber-500 text-xl mb-1">
              {reviewsSummary.clinicRatingStars}
            </div>
            <div className="text-slate-700 text-sm">{reviewsSummary.clinicRatingLabel}</div>
          </div>
          <div>
            <div className="text-amber-500 text-xl mb-1">
              {reviewsSummary.doctorRatingStars}
            </div>
            <div className="text-slate-700 text-sm">{reviewsSummary.doctorRatingLabel}</div>
          </div>
        </div>
      </section>

      {/* Reviews list */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="space-y-6">
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((r) => (
              <article key={r.id || r.title} className="border-b last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">{r.title || "Overall Rating"}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sky-700 text-sm">{r.ratingLabel}</span>
                    <span className="text-amber-500">{r.ratingStars}</span>
                  </div>
                </div>
                {r.comment && (
                  <p className="text-slate-700 mt-2 leading-7 whitespace-pre-line">{r.comment}</p>
                )}
                <div className="flex items-center justify-between mt-3 text-sm text-slate-500">
                  <div>{r.author}</div>
                  <div>{r.dateLabel}</div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-slate-500">No reviews yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
