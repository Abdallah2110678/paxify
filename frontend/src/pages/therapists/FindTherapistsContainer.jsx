import useFindTherapists from "../../hooks/findTherapistsHook";
import FindTherapists from "./FindTherapists";

export default function FindTherapistsContainer() {
  const { therapists, loading, error, onBook } = useFindTherapists();
  return (
    <FindTherapists
      therapists={therapists}
      loading={loading}
      error={error}
      onBook={onBook}
    />
  );
}
