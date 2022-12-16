const jwt = require('jsonwebtoken');
const TokenModel = require('../models/token-model');
const UserDto = require('../dtos/user-dto');

const tokenServices = {
    generateToken(payload) {
        const accessToken = () =>
            jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
                expiresIn: '30d',
            });

        const refreshToken = () =>
            jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
                expiresIn: '30d',
            });

        return { accessToken: accessToken(), refreshToken: refreshToken() };
    },

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({ user: userId });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await TokenModel.create({ user: userId, refreshToken });
    },

    async tokenGenerator(user) {
        const userDto = new UserDto(user);
        const tokens = await this.generateToken({ ...userDto });
        await this.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    },

    async removeToken(refreshToken) {
        return TokenModel.deleteOne({ refreshToken });
    },

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
        } catch (error) {
            return null;
        }
    },

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
        } catch (error) {
            return null;
        }
    },

    async findToken(refreshToken) {
        return await TokenModel.findOne({ refreshToken });
    },
};

module.exports = tokenServices;
