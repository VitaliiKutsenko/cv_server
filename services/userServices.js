const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const tokenServices = require('./tokenServices');
const ApiError = require('../exceptions/api-errors');
const CvDataModel = require('../models/cvCard-model');
const userServices = {
    registration: async (username, email, password, age) => {
        const candidate = await UserModel.findOne({ email });
        const candidateName = await UserModel.findOne({ username });
        if (candidate) {
            throw ApiError.BadRequestError(
                `User with email:${email} already exists`
            );
        } else if (candidateName) {
            throw ApiError.BadRequestError(
                `Username:${username} already exists`
            );
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({
            username,
            email,
            password: hashPassword,
            age,
            activationLink,
        });
        await CvDataModel.create({ user: user._id });

        await tokenServices.tokenGenerator(user);
        return {
            message: `Creating user with ${email} success!`,
            success: true,
        };
    },

    activate: async (activationLink) => {
        const user = await UserModel.findOne({ activationLink });
        if (!user) {
            throw ApiError.BadRequestError('Incorrect activation link');
        }
        user.isActivated = true;
        await user.save();
    },

    login: async (email, password) => {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequestError(
                `User with email:${email} is not found!`
            );
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequestError(`Password:${password} is incorrect`);
        }
        return tokenServices.tokenGenerator(user);
    },

    logout: async (refreshToken) => {
        return await tokenServices.removeToken(refreshToken);
    },

    refresh: async (refreshToken) => {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = await tokenServices.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenServices.findToken(refreshToken);
        if (!userData && !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = UserModel.findById(userData.id);
        return tokenServices.tokenGenerator(user);
    },

    getAllUsers: async () => {
        return UserModel.find();
    },

    getAllFiles: async () => {
        return CvModel.find();
    },
};

module.exports = userServices;
