import { useMemo, useState, useCallback } from "react";

// Renamed from useTherapistFilters.js
export default function therapistFiltersHook(therapists = []) {
  const [gender, setGender] = useState(""); // '', 'MALE', 'FEMALE'
  const [address, setAddress] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [price, setPrice] = useState([0, 10000]); // [min, max]

  // Build option lists from current dataset
  const options = useMemo(() => {
    const genders = ["MALE", "FEMALE"]; // fixed
    const addresses = Array.from(new Set(therapists.map(t => t.address).filter(Boolean)));
    const specialties = Array.from(new Set(therapists.map(t => t.specialty).filter(Boolean)));
    const minFee = Math.min(...therapists.map(t => Number(t.consultationFee ?? Infinity)));
    const maxFee = Math.max(...therapists.map(t => Number(t.consultationFee ?? 0)));
    const initialRange = [isFinite(minFee) ? minFee : 0, isFinite(maxFee) ? maxFee : 10000];
    return { genders, addresses, specialties, initialRange };
  }, [therapists]);

  // Derive filtered list
  const filteredTherapists = useMemo(() => {
    return therapists.filter(t => {
      if (gender && String(t.gender).toUpperCase() !== gender) return false;
      if (address && String(t.address) !== address) return false;
      if (specialist && String(t.specialty) !== specialist) return false;
      const fee = Number(t.consultationFee ?? 0);
      if (fee < price[0] || fee > price[1]) return false;
      return true;
    });
  }, [therapists, gender, address, specialist, price]);

  // public API for containers to pass to presentational component
  const actions = {
    setGender,
    setAddress,
    setSpecialist,
    setPrice, // expects [min,max]
    clear: useCallback(() => {
      setGender("");
      setAddress("");
      setSpecialist("");
      // reset price to detected range if available
      setPrice(options.initialRange || [0, 10000]);
    }, [options.initialRange])
  };

  return { gender, address, specialist, price, options, actions, filteredTherapists };
}
