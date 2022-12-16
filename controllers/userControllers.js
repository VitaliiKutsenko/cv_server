const ApiError = require('../exceptions/api-errors');
const { upload } = require('../storage/storage');
const userServices = require('../services/userServices');
const { validationResult } = require('express-validator');
const CvDataModel = require('../models/cvCard-model');
const userController = {
    get: {
        async activateLink(req, res, next) {
            try {
                const activationLink = req.params.link;
                await userServices.activate(activationLink);
                return res.redirect(process.env.CLIENT_URL);
            } catch (error) {
                next(error);
            }
        },

        async refreshToken(req, res, next) {
            try {
                const { refreshToken } = req.cookies;
                const userData = await userServices.refresh(refreshToken);
                res.cookie('refreshToken', userData.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                return res.json(userData);
            } catch (error) {
                next(error);
            }
        },

        async users(req, res, next) {
            try {
                const allUsers = await userServices.getAllUsers();
                res.status(200).json(allUsers);
            } catch (error) {
                next(error);
            }
        },
        async authMe(req, res, next) {
            try {
                const { userStatus, username } = await req;
                if (userStatus) {
                    res.status(200).json({ username });
                }
            } catch (error) {
                next(error);
            }
        },
    },
    post: {
        async registration(req, res, next) {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return next(
                        ApiError.BadRequestError(
                            'Validation error',
                            errors.array()
                        )
                    );
                }
                const { email, password, username, age } = await req.body;
                const userData = await userServices.registration(
                    username,
                    email,
                    password,
                    age
                );
                return res.json(userData);
            } catch (error) {
                next(error);
            }
        },

        async login(req, res, next) {
            try {
                const { email, password } = req.body;
                const userData = await userServices.login(email, password);
                res.cookie('refreshToken', userData.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                const message = `Welcome back ${userData.user.username}`;
                return res.json({ ...userData, message });
            } catch (error) {
                next(error);
            }
        },

        async logout(req, res, next) {
            try {
                const { refreshToken } = req.cookies;
                const token = await userServices.logout(refreshToken);
                res.clearCookie('refreshToken');
                return res.json({ success: true });
            } catch (error) {
                next(error);
            }
        },

        async upload(req, res, next) {
            try {
                const file = await req.file;
                return res.json({
                    url: `uploads/${req.file.originalname}`,
                });
            } catch (err) {
                next(err);
            }
        },
    },
    delete: {},
};

module.exports = userController;
