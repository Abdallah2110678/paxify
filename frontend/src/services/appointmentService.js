import api from './api';

// Create appointment (doctor creates available slots)
export const createAppointment = async (appointmentData) => {
  const response = await api.post('/api/appointments', appointmentData);
  return response.data;
};

// Book appointment (patient books an available slot)
export const bookAppointment = async (appointmentId, patientId) => {
  const response = await api.post(`/api/appointments/${appointmentId}/book`, {
    patientId
  });
  return response.data;
};

// Get appointments by doctor
export const getAppointmentsByDoctor = async (doctorId) => {
  const response = await api.get(`/api/appointments/doctor/${doctorId}`);
  return response.data;
};

// Get appointments by patient
export const getAppointmentsByPatient = async (patientId) => {
  const response = await api.get(`/api/appointments/patient/${patientId}`);
  return response.data;
};

// Get available appointments for a doctor
export const getAvailableAppointments = async (doctorId) => {
  const response = await api.get(`/api/appointments/doctor/${doctorId}/available`);
  return response.data;
};

// Delete appointment
export const deleteAppointment = async (appointmentId) => {
  const response = await api.delete(`/api/appointments/${appointmentId}`);
  return response.data;
};

// Update appointment (partial via query params)
// Supported params: dateTime (ISO), durationMinutes (int), sessionType (ONLINE|IN_PERSON), price (decimal), notes (string)
export const updateAppointment = async (appointmentId, params = {}) => {
  // Axios: send null body with params in config
  const response = await api.patch(`/api/appointments/${appointmentId}`, null, { params });
  return response.data;
};
