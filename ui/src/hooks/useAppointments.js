import { useState, useEffect, useCallback, useMemo } from 'react';
import { appointmentApi } from '../services/api.js';

export function useAppointments(notify) {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const scheduledCount = useMemo(
    () => appointments.filter((appointment) => appointment.status === 'Scheduled').length,
    [appointments]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [doctorResult, appointmentResult] = await Promise.all([
        appointmentApi.getDoctors(),
        appointmentApi.getAppointments(),
      ]);
      setDoctors(doctorResult.data);
      setAppointments(appointmentResult.data);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = useCallback(async (data) => {
    setSubmitting(true);
    try {
      const result = await appointmentApi.createAppointment(data);
      setAppointments((current) =>
        [...current, result.data].sort((a, b) =>
          `${a.appointment_date} ${a.appointment_time}`.localeCompare(
            `${b.appointment_date} ${b.appointment_time}`
          )
        )
      );
      notify(result.message);
      return true;
    } catch (error) {
      notify(error.message, 'error');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [notify]);

  const handleStatus = useCallback(async (id, status) => {
    setBusyId(id);
    try {
      const result = await appointmentApi.updateStatus(id, status);
      setAppointments((current) =>
        current.map((appointment) => (appointment.id === id ? result.data : appointment))
      );
      notify(result.message);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusyId(null);
    }
  }, [notify]);

  const handleDelete = useCallback(async (appointment) => {
    const confirmed = window.confirm(
      `Delete the appointment for ${appointment.patient_name}? This cannot be undone.`
    );
    if (!confirmed) return;

    setBusyId(appointment.id);
    try {
      const result = await appointmentApi.deleteAppointment(appointment.id);
      setAppointments((current) => current.filter((item) => item.id !== appointment.id));
      notify(result.message);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusyId(null);
    }
  }, [notify]);

  const handleGenerateSummary = useCallback(async (reasonForVisit) => {
    try {
      const result = await appointmentApi.generateSummary(reasonForVisit);
      notify(result.message);
      return result.data.summary;
    } catch (error) {
      notify(error.message, 'error');
      throw error;
    }
  }, [notify]);

  return {
    doctors,
    appointments,
    loading,
    submitting,
    busyId,
    scheduledCount,
    handleCreate,
    handleStatus,
    handleDelete,
    handleGenerateSummary,
  };
}
