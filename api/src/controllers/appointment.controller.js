import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} from '../services/appointment.service.js';
import { isAllowedStatus, validateAppointmentInput } from '../utils/validation.js';

export async function listAppointments(req, res, next) {
  try {
    const appointments = await getAllAppointments();
    res.json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
}

export async function addAppointment(req, res, next) {
  try {
    const { errors, data } = validateAppointmentInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    const appointment = await createAppointment(data);
    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

export async function changeAppointmentStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const status = String(req.body.status ?? '');

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid appointment ID.' });
    }

    if (!isAllowedStatus(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Completed or Cancelled.',
      });
    }

    const appointment = await updateAppointmentStatus(id, status);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    return res.json({
      success: true,
      message: `Appointment marked as ${status}.`,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeAppointment(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid appointment ID.' });
    }

    const deleted = await deleteAppointment(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    return res.json({ success: true, message: 'Appointment deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
