const ApiErrors = require('../exceptions/api-errors');
const CvDataModel = require('../models/cvCard-model');
const CvModel = require('../models/cv-model');
const getCvCard = async ({ username, name }) => {
    const cvData = await CvDataModel.findOne(
        {
            username,
            ['collections']: { $elemMatch: { name } },
        }
        // {
        //     ['collections._id']: 1,
        // }
    );

    if (!cvData) {
        throw ApiErrors.BadRequestError('This CV is not exist!');
    }

    const cvModel = await CvModel.findOne({
        collectionId: cvData.collections.find((item) => item.name === name).id,
    });
    return cvModel;
};

const addCvCardField = async ({ userId, body }) => {
    const { collectionId, ...fields } = body;
    console.log(collectionId);
    const [itemKey] = Object.keys(fields);
    const findField = await CvModel.findOne({
        collectionId,
        [`data.${itemKey}`]: { $elemMatch: { id: fields[itemKey].id } },
    });
    if (!findField) {
        return await CvModel.findOneAndUpdate(
            {
                collectionId,
                [`data.${itemKey}.id`]: { $ne: fields[itemKey].id },
            },
            {
                $addToSet: {
                    [`data.${itemKey}`]: fields[itemKey],
                },
            },
            { returnDocument: 'after' }
        )
            .then((doc) => {
                if (!doc) {
                    return ApiErrors.BadRequestError('not found');
                }
                const updateDoc = { [itemKey]: doc.data[itemKey] };
                return updateDoc;
            })
            .catch((err) => {
                if (err) {
                    return ApiErrors.BadRequestError('error');
                }
            });
    } else {
        return await CvModel.findOneAndUpdate(
            {
                collectionId,
                [`data.${itemKey}`]: { $elemMatch: { id: fields[itemKey].id } },
            },
            {
                $set: {
                    [`data.${itemKey}.$.options`]: fields[itemKey].options,
                    [`data.${itemKey}.$.fields`]: fields[itemKey].fields,
                },
            },
            { returnDocument: 'after' }
        )
            .then((doc) => {
                if (!doc) {
                    return ApiErrors.BadRequestError('not found');
                }
                const updateDoc = { [itemKey]: doc.data[itemKey] };
                return updateDoc;
            })
            .catch((err) => {
                if (err) {
                    return ApiErrors.BadRequestError('error');
                }
            });
    }
};
const deleteFieldsById = ({ user, params }) => {
    console.log(params);
    return CvModel.findOneAndUpdate(
        {
            userId: user,
        },
        {
            $pull: { [params.path]: { _id: params.id } },
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
};
module.exports = {
    getCvCard,
    addCvCardField,
    deleteFieldsById,
};
