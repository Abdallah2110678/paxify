import api from './api';

// Helper: attach Authorization header from localStorage when available
const withAuth = (config = {}) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
    }
  } catch (_) {}
  return config;
};

// Create appointment (doctor creates available slots)
export const createAppointment = async (appointmentData) => {
  const response = await api.post('/api/appointments', appointmentData);
  return response.data;
};

// Book appointment (patient books an available slot)
export const bookAppointment = async (appointmentId, patientId, paymentMethod = 'CASH', paymentReference = null) => {
  const response = await api.post(
    `/api/appointments/${appointmentId}/book`,
    {
      patientId,
      paymentMethod,
      paymentReference,
    },
    withAuth()
  );
  return response.data;
};

// Get appointments by doctor
export const getAppointmentsByDoctor = async (doctorId) => {
  const response = await api.get(`/api/appointments/doctor/${doctorId}`, withAuth());
  return response.data;
};

// Get appointments by patient
export const getAppointmentsByPatient = async (patientId) => {
  const response = await api.get(`/api/appointments/patient/${patientId}`, withAuth());
  return response.data;
};

// Get current patient's appointments using JWT principal
export const getMyAppointments = async () => {
  const response = await api.get(`/api/appointments/me`, withAuth());
  return response.data;
};

// Get available appointments for a doctor
export const getAvailableAppointments = async (doctorId) => {
  const response = await api.get(`/api/appointments/doctor/${doctorId}/available`);
  return response.data;
};

// Public: Get FUTURE appointments for a doctor including all statuses
export const getDoctorFutureAppointmentsPublic = async (doctorId) => {
  const response = await api.get(`/api/appointments/doctor/${doctorId}/public/future`);
  return response.data;
};

// Delete appointment
export const deleteAppointment = async (appointmentId) => {
  const response = await api.delete(`/api/appointments/${appointmentId}`);
  return response.data;
};

// Patient cancels their own appointment (releases slot)
export const cancelAppointmentByPatient = async (appointmentId, patientId) => {
  const response = await api.post(
    `/api/appointments/${appointmentId}/cancel`,
    null,
    { params: { patientId }, ...withAuth() }
  );
  return response.data;
};

// Cancel current patient's appointment via JWT principal
export const cancelMyAppointment = async (appointmentId) => {
  const response = await api.post(
    `/api/appointments/${appointmentId}/cancel/me`,
    null,
    withAuth()
  );
  return response.data;
};

// Update appointment (partial via query params)
// Supported params: dateTime (ISO), durationMinutes (int), sessionType (ONLINE|IN_PERSON), price (decimal), notes (string)
export const updateAppointment = async (appointmentId, params = {}) => {
  // Axios: send null body with params in config
  const response = await api.patch(`/api/appointments/${appointmentId}`, null, { params });
  return response.data;
};
