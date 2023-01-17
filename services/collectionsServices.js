const ApiErrors = require('../exceptions/api-errors');
const cvModel = require('../models/cv-model');
const CvDataModel = require('../models/cvCard-model');

const collectionServices = {
    get: {
        async collectionsFromDb(userId) {
            if (userId) {
                const cvData = await CvDataModel.findOne(
                    {
                        user: userId,
                    },
                    { [`collections.name`]: 1, [`collections._id`]: 1 }
                );

                return cvData;
            } else {
                throw ApiErrors.BadRequestError(`Incorrect id:${userId}`);
            }
        },
    },
    post: {
        async addCollectionsToDb(userId, body) {
            const { name } = body;
            const collectionCandidate = await CvDataModel.findOne({
                user: userId,
                [`collections.name`]: { $in: name },
            });
            if (collectionCandidate) {
                throw ApiErrors.BadRequestError(
                    'This name exist in your collections'
                );
            }
            const cvData = await CvDataModel.findOneAndUpdate(
                { user: userId },
                {
                    $addToSet: {
                        collections: { name },
                    },
                },
                {
                    returnDocument: 'after',
                }
            )
                .then((doc) => {
                    if (!doc) {
                        return ApiErrors.BadRequestError('not found');
                    }

                    return doc;
                })
                .then((doc) => {
                    const [last] = doc.collections.slice(-1);
                    cvModel.create({
                        collectionId: last._id,
                        collectionName: last.name,
                    });
                    return doc;
                })
                .catch((err) => {
                    if (err) {
                        return ApiErrors.BadRequestError('error');
                    }
                });
            return cvData;
        },
    },
    put: {},
    delete: {
        async deleteCollectionById(userId, removeId) {
            await cvModel.findOneAndDelete({ collectionId: removeId });
            return await CvDataModel.findOneAndUpdate(
                {
                    userId,
                },
                {
                    $pull: { ['collections']: { _id: removeId } },
                },
                { returnDocument: 'after' }
            )
                .then((doc) => {
                    if (!doc) {
                        return ApiErrors.BadRequestError('not found');
                    }
                    return doc;
                })
                .catch((err) => {
                    if (err) {
                        return ApiErrors.BadRequestError('error');
                    }
                });
        },
    },
};

module.exports = collectionServices;
