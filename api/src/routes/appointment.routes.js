import { Router } from 'express';
import {
  addAppointment,
  changeAppointmentStatus,
  listAppointments,
  removeAppointment,
} from '../controllers/appointment.controller.js';

const router = Router();

router.get('/', listAppointments);
router.post('/', addAppointment);
router.patch('/:id/status', changeAppointmentStatus);
router.delete('/:id', removeAppointment);

export default router;
