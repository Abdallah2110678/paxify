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
    <>
      {/* Mobile: collapsible filter trigger */}
      <details className="mt-8 lg:hidden mb-4 bg-white border border-slate-200 rounded-2xl">
        <summary className="flex items-center justify-between cursor-pointer select-none px-4 py-3 rounded-2xl">
          <span className="text-base font-medium text-slate-800">Filter</span>
          <span className="text-slate-500 text-sm">Tap to expand</span>
        </summary>
        <div className="px-4 pb-4">
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

          {/* Price Range */}
          <div className="mb-4">
            <label className="block text-sm text-slate-600 mb-2">
              Price Range: L.E {price[0]} - L.E{price[1]}
            </label>
            <div className="px-2">
              <input
                type="range"
                min={options.initialRange?.[0] || 0}
                max={options.initialRange?.[1] || 10000}
                value={price[0]}
                onChange={(e) => onPriceChange?.([Number(e.target.value), price[1]])}
                className="w-full mb-2"
              />
              <input
                type="range"
                min={options.initialRange?.[0] || 0}
                max={options.initialRange?.[1] || 10000}
                value={price[1]}
                onChange={(e) => onPriceChange?.([price[0], Number(e.target.value)])}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>${options.initialRange?.[0] || 0}</span>
              <span>${options.initialRange?.[1] || 10000}</span>
            </div>
          </div>

          <button
            onClick={onClear}
            className="w-full mt-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </details>

      {/* Desktop: Sidebar */}
      <aside className="hidden lg:block w-72 bg-white border border-slate-200 rounded-2xl p-4 h-max sticky top-4">
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

        {/* Price Range */}
        <div className="mb-4">
          <label className="block text-sm text-slate-600 mb-2">
            Price Range: L.E {price[0]} - L.E{price[1]}
          </label>
          <div className="px-2">
            <input
              type="range"
              min={options.initialRange?.[0] || 0}
              max={options.initialRange?.[1] || 10000}
              value={price[0]}
              onChange={(e) => onPriceChange?.([Number(e.target.value), price[1]])}
              className="w-full mb-2"
            />
            <input
              type="range"
              min={options.initialRange?.[0] || 0}
              max={options.initialRange?.[1] || 10000}
              value={price[1]}
              onChange={(e) => onPriceChange?.([price[0], Number(e.target.value)])}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>${options.initialRange?.[0] || 0}</span>
            <span>${options.initialRange?.[1] || 10000}</span>
          </div>
        </div>

        <button
          onClick={onClear}
          className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          Clear All Filters
        </button>
      </aside>
    </>
  );
}
