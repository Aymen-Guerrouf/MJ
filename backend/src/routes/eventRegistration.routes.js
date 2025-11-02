import express from 'express';
import * as eventRegistrationController from '../controllers/eventRegistrationController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isCenterAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Participation
 *   description: Event registration management
 */

/**
 * @swagger
 * /api/event-registrations:
 *   get:
 *     summary: Get all event registrations (Admin)
 *     tags: [Participation]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of event registrations
 */
router.get('/', authenticate, isCenterAdmin, eventRegistrationController.getAllEventRegistrations);

/**
 * @swagger
 * /api/event-registrations/my:
 *   get:
 *     summary: Get my event registrations
 *     tags: [Participation]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of my event registrations
 */
router.get('/my', authenticate, eventRegistrationController.getMyEventRegistrations);

/**
 * @swagger
 * /api/event-registrations:
 *   post:
 *     summary: Register for an event
 *     tags: [Participation]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully registered for event
 */
router.post('/', authenticate, eventRegistrationController.registerForEvent);

/**
 * @swagger
 * /api/event-registrations/{id}:
 *   delete:
 *     summary: Cancel/Delete event registration
 *     tags: [Participation]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registration cancelled successfully
 */
router.delete(
  '/:id',
  authenticate,
  eventRegistrationController.deleteEventRegistration
);

export default router;
