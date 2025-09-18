import useProfile from "../../hooks/profileHook";

const Profile = () => {
  const {
    user,
    form,
    avatarSrc,
    isDoctor,
    handleChange,
    onFileChange,
    handleSave,
    handleDelete,
  } = useProfile();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Section */}
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Profile Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {user?.profilePictureUrl ? (
                    <img
                      src={avatarSrc}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>
                {isDoctor && (
                  <div className="flex flex-col space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section (unchanged) */}
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Email Notifications</span>
                <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Dark Mode</span>
                <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Security
            </h2>
            <div className="space-y-4">
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-left">
                Change Password
              </button>
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-left">
                Two-Factor Authentication
              </button>
              <button
                onClick={handleDelete}
                className="w-full bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-left"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
