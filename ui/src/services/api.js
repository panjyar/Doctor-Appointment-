const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = { success: false, message: 'Invalid response from server.' };
  }

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed.');
  }

  return payload;
}

export const appointmentApi = {
  getDoctors() {
    return request('/doctors');
  },

  getAppointments() {
    return request('/appointments');
  },

  createAppointment(data) {
    return request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateStatus(id, status) {
    return request(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  deleteAppointment(id) {
    return request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },

  generateSummary(reasonForVisit) {
    return request('/ai/summary', {
      method: 'POST',
      body: JSON.stringify({ reason_for_visit: reasonForVisit }),
    });
  },
};
