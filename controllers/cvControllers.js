const {
    addCvCardField,
    getCvCard,
    deleteFieldsById,
} = require('../services/cvServices');

const cvControllers = {
    get: {
        async cvData(req, res, next) {
            try {
                const { username, name } = await req.params;
                const cvCard = await getCvCard({ username, name });
                return res.status(200).json(cvCard);
            } catch (error) {
                next(error);
            }
        },
    },
    post: {
        async cvCard(req, res, next) {
            try {
                const { userId, body } = await req;
                const cvCard = await addCvCardField({ userId, body });
                console.log(cvCard);
                return res.status(200).json(cvCard);
            } catch (error) {
                next(error);
            }
        },
    },
    put: {},
    delete: {
        async additionalFields(req, res, next) {
            try {
                const user = await req.userId;
                const params = await req.params;
                const cvCard = await deleteFieldsById({ user, params });
                console.log(cvCard);
                return res.status(200).json(cvCard);
            } catch (error) {
                next(error);
            }
        },
    },
};

module.exports = cvControllers;
