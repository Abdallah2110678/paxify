import DoctorHook from "../../hooks/doctorHook";

const DoctorRegister = () => {
  const { register } = DoctorHook();
  const { form, error, submitting, setForm, handleChange, handleFileChange, handleSubmit } = register;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Create your doctor account
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Sign up as a doctor to start offering consultations
        </p>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Full name"
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
              required
            />
            <input
              name="phoneNumber"
              placeholder="Phone"
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
              required
            />
            <select
              name="gender"
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          {/* Row 3 */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="border p-2 rounded-lg w-full"
            required
          />

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="specialty"
              placeholder="Specialty"
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            />
            <input
              name="consultationFee"
              type="number"
              step="0.01"
              placeholder="Consultation Fee"
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            />
          </div>

          {/* Short Bio */}
          <textarea
            name="bio"
            placeholder="Short Bio"
            onChange={handleChange}
            className="border p-2 rounded-lg w-full"
          />

          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-white"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded w-full"
          >
            {submitting ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default DoctorRegister;
