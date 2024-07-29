/**
 * @swagger
 * components:
 *   schemas:
 *     Detail:
 *       type: object
 *       required:
 *         - fullName
 *         - dob
 *         - aboutMe
 *       properties:
 *         fullName:
 *           type: string
 *         dob:
 *           type: string
 *           format: date
 *         aboutMe:
 *           type: string
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         token:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   - name: Details
 *     description: The details managing API
 *   - name: Auth
 *     description: User authentication API
 */

/**
 * @swagger
 * /api/details:
 *   get:
 *     tags: [Details]
 *     summary: Get all details
 *     responses:
 *       200:
 *         description: Successfully retrieved details
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/details/{id}:
 *   get:
 *     tags: [Details]
 *     summary: Get a single detail by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The detail ID
 *     responses:
 *       200:
 *         description: Successfully retrieved detail
 *       404:
 *         description: Detail not found
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/details:
 *   post:
 *     tags: [Details]
 *     summary: Create a new detail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Detail'
 *     responses:
 *       200:
 *         description: Successfully created detail
 *       400:
 *         description: Bad request
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/details/{id}:
 *   delete:
 *     tags: [Details]
 *     summary: Delete a detail by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The detail ID
 *     responses:
 *       200:
 *         description: Successfully deleted detail
 *       404:
 *         description: Detail not found
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/details/{id}:
 *   patch:
 *     tags: [Details]
 *     summary: Update a detail by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The detail ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Detail'
 *     responses:
 *       200:
 *         description: Successfully updated detail
 *       404:
 *         description: Detail not found
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid login credentials
 */

/**
 * @swagger
 * /api/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Signup a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successfully signed up
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid signup details
 */
