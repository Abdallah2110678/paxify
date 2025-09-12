// Pure presentational sidebar (no logic). Values and handlers are provided via props.
export default function TherapistFilters({
  gender = "",
  address = "",
  specialist = "",
  price = [0, 10000],
  options = { genders: [], addresses: [], specialties: [], initialRange: [0, 10000] },
  onGenderChange,
  onAddressChange,
  onSpecialistChange,
  onPriceChange,
  onClear,
}) {
  return (
    <aside className="w-full lg:w-72 bg-white border border-slate-200 rounded-2xl p-4 h-max sticky top-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">Filters</h3>

      {/* Gender */}
      <div className="mb-4">
        <label className="block text-sm text-slate-600 mb-1">Gender</label>
        <select
          value={gender}
          onChange={(e) => onGenderChange?.(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Any</option>
          {options.genders?.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className="block text-sm text-slate-600 mb-1">Address</label>
        <select
          value={address}
          onChange={(e) => onAddressChange?.(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Any</option>
          {options.addresses?.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Specialist */}
      <div className="mb-4">
        <label className="block text-sm text-slate-600 mb-1">Specialist</label>
        <select
          value={specialist}
          onChange={(e) => onSpecialistChange?.(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Any</option>
          {options.specialties?.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Price Range (min/max) */}
      <div className="mb-4">
        <label className="block text-sm text-slate-600 mb-1">Price Range (L.E)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="w-1/2 border rounded-lg px-2 py-2 text-sm"
            value={price?.[0] ?? options.initialRange?.[0] ?? 0}
            min="0"
            onChange={(e) => onPriceChange?.([Number(e.target.value || 0), price?.[1] ?? options.initialRange?.[1] ?? 10000])}
          />
          <span className="text-slate-500">-</span>
          <input
            type="number"
            className="w-1/2 border rounded-lg px-2 py-2 text-sm"
            value={price?.[1] ?? options.initialRange?.[1] ?? 10000}
            min={price?.[0] ?? 0}
            onChange={(e) => onPriceChange?.([price?.[0] ?? 0, Number(e.target.value || 0)])}
          />
        </div>
      </div>

      <button
        className="w-full bg-slate-700 hover:bg-slate-800 text-white rounded-lg py-2 text-sm"
        onClick={() => onClear?.()}
      >
        Clear Filters
      </button>
    </aside>
  );
}
