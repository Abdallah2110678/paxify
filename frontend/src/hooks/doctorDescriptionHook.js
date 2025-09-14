import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import useNavbar from "./navbarHook";
import {
  getPublicDoctorProfile,
  getDoctorReviews,
  submitDoctorReview,
} from "../services/doctorService";

// Renamed from useDoctorDescription.js
export default function doctorDescriptionHook() {
  const { id } = useParams();
  const { resolveUrl } = useNavbar();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null); // { doctor, averageRating, reviewsCount }
  const [reviews, setReviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const [p, rv] = await Promise.all([
        getPublicDoctorProfile(id),
        getDoctorReviews(id),
      ]);
      setProfile(p);
      setReviews(Array.isArray(rv) ? rv : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load doctor profile");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const mapped = useMemo(() => {
    const d = profile?.doctor || {};
    const avg = profile?.averageRating;
    const cnt = profile?.reviewsCount || 0;
    const ratingStars = typeof avg === "number"
      ? Array.from({ length: 5 }, (_, i) => (i < Math.round(avg) ? "★" : "☆")).join(" ")
      : null;

    return {
      rawDoctor: d,
      doctorProps: {
        name: d.name,
        title: d.type === "DOCTOR" ? "Consultant" : d.title,
        specialty: d.specialty,
        bio: d.bio,
        address: d.address,
        profilePictureUrl: d.profilePictureUrl ? resolveUrl(d.profilePictureUrl) : "",
        ratingStars,
        ratingLabel: avg != null ? `${avg.toFixed(1)} / 5` : null,
        reviewsCountLabel: cnt ? `From ${cnt} Visitors` : null,
      },
      consultationFee: d.consultationFee,
      highlights: [],
      specializations: [],
      reviewsSummary: {
        overallLabel: "Overall Rating",
        overallStars: ratingStars,
        clinicRatingLabel: "Clinic Rating",
        clinicRatingStars: null,
        doctorRatingLabel: "Doctor Rating",
        doctorRatingStars: avg != null ? `${avg.toFixed(1)}/5` : null,
      },
      reviews: reviews.map((r) => ({
        id: r.id,
        title: "Overall Rating",
        comment: r.comment,
        author: r.patient?.name || "Visitor",
        dateLabel: r.createdAt?.replace("T", " ")?.slice(0, 16) || "",
        ratingLabel: String(r.rating ?? ""),
        ratingStars: Array.from({ length: 5 }, (_, i) => (i < Math.round(r.rating || 0) ? "★" : "☆")).join(" "),
      })),
    };
  }, [profile, reviews]);

  const submitReview = useCallback(
    async ({ rating, comment }) => {
      if (!id) return;
      setSubmitting(true);
      try {
        await submitDoctorReview({ doctorId: id, rating, comment });
        await fetchAll();
      } finally {
        setSubmitting(false);
      }
    },
    [id, fetchAll]
  );

  return {
    id,
    loading,
    error,
    ...mapped,
    submitReview,
    submitting,
    refetch: fetchAll,
  };
}
