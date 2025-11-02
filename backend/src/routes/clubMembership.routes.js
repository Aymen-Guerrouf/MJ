import express from 'express';
import * as clubMembershipController from '../controllers/clubMembershipController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isCenterAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Club Memberships
 *   description: Club membership management
 */

/**
 * @swagger
 * /api/club-memberships:
 *   get:
 *     summary: Get all club memberships (Admin)
 *     tags: [Participation]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clubId
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of club memberships
 */
router.get('/', authenticate, isCenterAdmin, clubMembershipController.getAllClubMemberships);

/**
 * @swagger
 * /api/club-memberships/my:
 *   get:
 *     summary: Get my club memberships
 *     tags: [Participation]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of my club memberships
 */
router.get('/my', authenticate, clubMembershipController.getMyClubMemberships);

/**
 * @swagger
 * /api/club-memberships/club/{clubId}/members:
 *   get:
 *     summary: Get members of a club
 *     tags: [Participation]
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of club members
 */
router.get('/club/:clubId/members', clubMembershipController.getClubMembers);

/**
 * @swagger
 * /api/club-memberships/join:
 *   post:
 *     summary: Join a club
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
 *               - clubId
 *             properties:
 *               clubId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully joined club
 */
router.post('/join', authenticate, clubMembershipController.joinClub);

/**
 * @swagger
 * /api/club-memberships/leave/{clubId}:
 *   delete:
 *     summary: Leave a club
 *     tags: [Participation]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully left club
 */
router.delete('/leave/:clubId', authenticate, clubMembershipController.leaveClub);

/**
 * @swagger
 * /api/club-memberships/{id}/role:
 *   put:
 *     summary: Update member role (Admin)
 *     tags: [Participation]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [member, moderator, leader]
 *     responses:
 *       200:
 *         description: Member role updated successfully
 */
router.put('/:id/role', authenticate, isCenterAdmin, clubMembershipController.updateMemberRole);

/**
 * @swagger
 * /api/club-memberships/{id}:
 *   delete:
 *     summary: Remove member from club (Admin)
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
 *         description: Member removed successfully
 */
router.delete('/:id', authenticate, isCenterAdmin, clubMembershipController.removeMember);

export default router;
