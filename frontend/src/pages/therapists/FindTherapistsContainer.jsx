import useFindTherapists from "../../hooks/findTherapistsHook";
import therapistFiltersHook from "../../hooks/therapistFiltersHook";
import TherapistFilters from "../../components/therapists/TherapistFilters";
import FindTherapists from "./FindTherapists";
import BookingModal from "../doctor/BookingModal";

export default function FindTherapistsContainer() {
  const { therapists, loading, error, onBook, bookingModalProps } = useFindTherapists();
  const { gender, address, specialist, price, options, actions, filteredTherapists } = therapistFiltersHook(therapists);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6">
        <TherapistFilters
          gender={gender}
          address={address}
          specialist={specialist}
          price={price}
          options={options}
          onGenderChange={actions.setGender}
          onAddressChange={actions.setAddress}
          onSpecialistChange={actions.setSpecialist}
          onPriceChange={actions.setPrice}
          onClear={actions.clear}
        />

        <FindTherapists
          therapists={filteredTherapists}
          loading={loading}
          error={error}
          onBook={onBook}
        />
      </div>

      <BookingModal {...bookingModalProps} />
    </div>
  );
}
