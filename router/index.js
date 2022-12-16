const Router = require('express');
const router = new Router();
const { body } = require('express-validator');
const { userMiddleware } = require('../middlewares/user-middleware');
const checkAuth = require('../utils/checkAuth.js');
const userController = require('../controllers/userControllers');
const collectionsControllers = require('../controllers/collectionsControllers');
const cvControllers = require('../controllers/cvControllers');
const { storage, upload } = require('../storage/storage');
const multer = require('multer');
const express = require('express');
// POST
router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 12 }),
    userController.post.registration
);
router.post('/login', userController.post.login);
router.post('/logout', userController.post.logout);
router.post('/upload', upload.single('image'), userController.post.upload);

// GET
router.get('/activate/:link', userController.get.activateLink);
router.get('/refresh', userController.get.refreshToken);
router.get('/users', userMiddleware, userController.get.users);
router.get('/auth_me', checkAuth, userController.get.authMe);

// CV route
router.get('/cv/:username/:name', cvControllers.get.cvData);
router.post('/cv', checkAuth, cvControllers.post.cvCard);
router.delete(
    '/cv/:path/:id',
    checkAuth,
    cvControllers.delete.additionalFields
);

// Collections route
router.get(
    '/collections',
    checkAuth,
    collectionsControllers.get.allCollections
);
router.post(
    '/collections',
    checkAuth,
    collectionsControllers.post.addCollection
);
router.delete(
    '/collections/:id',
    checkAuth,
    collectionsControllers.delete.collectionById
);

module.exports = router;
